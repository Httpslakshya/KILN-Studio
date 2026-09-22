import { API_URL, apiFetch, checkAuth, logout } from './api.js';

const prompts = {
  'Summarize Document': 'Summarize this document clearly. Include the main argument, important sections, and practical takeaways. Cite the most relevant pages.',
  'Generate Notes': 'Generate structured study notes from this document with headings, bullet points, definitions, and cited page references.',
  'Generate Quiz': 'Create a quiz from this document with 8 questions, answer choices where useful, correct answers, and page citations.',
  'Key Concepts': 'Identify the key concepts in this document. Explain each concept briefly and cite the pages where it appears.',
  'Explain Like Beginner': 'Explain the document like I am a beginner. Use simple language, examples, and cite the source pages.',
  'Create Study Guide': 'Create a complete study guide from this document with overview, key ideas, terms, likely exam questions, and cited pages.',
  'Explain Simply': 'Explain the selected document simply and clearly. Focus on the essential ideas and cite source pages.',
  'Extract Key Metrics': 'Extract key metrics, facts, dates, numbers, and named entities from the document. Organize them in a table-like list and cite source pages.'
};

let currentPdf = '';
let currentPage = 1;
let totalPages = 1;
let zoomScale = 1.0;
let fitMode = 'width';
let pdfDoc = null;
let pageRendering = false;
let pageNumPending = null;
let currentRenderTask = null;
let mobilePdfVisible = false;

// Verify session
checkAuth();

document.addEventListener('DOMContentLoaded', init);

function formatDocTitle(filename) {
  if (!filename) return 'Document';
  return filename
    .replace(/\.pdf$/i, '')
    .replace(/___z-library(\.sk)?/gi, '')
    .replace(/__+/g, ' — ')
    .replace(/_+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  currentPdf = params.get('pdf') || '';
  if (!currentPdf) {
    window.location.href = '/dashboard';
    return;
  }
  const cleanTitle = formatDocTitle(currentPdf);
  document.title = `KILN Studio | ${cleanTitle}`;
  const docTitle = document.getElementById('current-doc-title');
  if (docTitle) {
    docTitle.textContent = cleanTitle;
    docTitle.title = currentPdf;
  }
  const pdfTitle = document.getElementById('pdf-title');
  if (pdfTitle) {
    pdfTitle.textContent = cleanTitle;
    pdfTitle.title = currentPdf;
  }
  const detailsLink = document.getElementById('details-link');
  if (detailsLink) detailsLink.href = `/document?pdf=${encodeURIComponent(currentPdf)}`;
  
  bindUI();
  initResizer();
  renderSuggestions();
  loadPdf();
  await verifyDocument();
  await loadRecent();
  appendSystemIntro();
  
  const action = params.get('action');
  if (action && prompts[action]) {
    setTimeout(() => sendSuggestion(action), 450);
  }
}

function bindUI() {
  document.querySelectorAll('.control-btn').forEach(btn => btn.className = 'border-2 border-ink bg-card h-8 w-8 grid place-items-center hover:bg-forge hover:text-white transition text-ink shrink-0');
  document.getElementById('menu-btn').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('-translate-x-full'));
  document.getElementById('new-chat-btn').addEventListener('click', clearChat);
  document.getElementById('settings-btn').addEventListener('click', openModal);
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('logout-btn').addEventListener('click', logout);
  document.getElementById('send-btn').addEventListener('click', () => sendMessage());
  document.getElementById('prev-page').addEventListener('click', () => goToPage(currentPage - 1));
  document.getElementById('next-page').addEventListener('click', () => goToPage(currentPage + 1));
  document.getElementById('page-input').addEventListener('change', event => goToPage(Number(event.target.value)));
  document.getElementById('zoom-in').addEventListener('click', () => setZoom(zoomScale + .15));
  document.getElementById('zoom-out').addEventListener('click', () => setZoom(zoomScale - .15));
  document.getElementById('fit-width').addEventListener('click', fitToWidth);
  document.getElementById('fit-page').addEventListener('click', fitToPage);
  document.getElementById('mobile-pdf-tab').addEventListener('click', toggleMobilePdf);

  let resizeDebounce;
  window.addEventListener('resize', () => {
    clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(() => {
      if (pdfDoc && (fitMode === 'width' || fitMode === 'page')) {
        renderPage(currentPage);
      }
    }, 150);
  });

  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft') {
      goToPage(currentPage - 1);
    } else if (e.key === 'ArrowRight') {
      goToPage(currentPage + 1);
    }
  });
  document.getElementById('repurpose-chat-btn')?.addEventListener('click', () => {
    if (currentPdf) {
      const clean = currentPdf.replace(/\.pdf$/i, '').replace(/[-_]+/g, ' ');
      window.location.href = `/dashboard.html?tab=studio&topic=${encodeURIComponent(clean)}&pdf=${encodeURIComponent(currentPdf)}`;
    } else {
      window.location.href = '/dashboard.html?tab=studio';
    }
  });
  
  const input = document.getElementById('chat-input');
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 160)}px`;
  });
  setupSpeechRecognition();
}

function renderSuggestions() {
  const order = ['Summarize Document', 'Generate Notes', 'Generate Quiz', 'Key Concepts', 'Explain Like Beginner', 'Create Study Guide', 'Explain Simply', 'Extract Key Metrics'];
  document.getElementById('suggestions').innerHTML = order.map(label => `
    <button onclick="window.sendSuggestion('${label}')" class="shrink-0 border-4 border-ink bg-card px-3 py-2 text-sm font-black hover:bg-yellow transition">${label}</button>
  `).join('');
}

async function verifyDocument() {
  try {
    const res = await apiFetch(`/api/document/status/${encodeURIComponent(currentPdf)}`);
    if (res.data.status === 'indexed') {
      totalPages = Math.max(Number(res.data.pages || 1), 1);
      updatePageStatus();
    } else if (res.data.status === 'error') {
      showToast(`Indexing warning: ${res.data.detail}`);
    }
  } catch (err) {
    showToast('Could not verify indexing status.');
  }
}

async function loadRecent() {
  try {
    const res = await apiFetch('/api/documents');
    const docs = res.data.documents || [];
    document.getElementById('recent-list').innerHTML = docs.slice(0, 8).map(doc => `
      <li><a href="/chat?pdf=${encodeURIComponent(doc.filename)}" class="block border-4 ${doc.filename === currentPdf ? 'border-ink bg-yellow' : 'border-transparent hover:border-ink hover:bg-soft'} p-2 font-bold truncate">${escapeHtml(doc.filename)}</a></li>
    `).join('') || '<li class="font-bold text-muted">No documents yet.</li>';
  } catch {
    document.getElementById('recent-list').innerHTML = '<li class="font-bold text-danger">Could not load recent documents.</li>';
  }
}

function initResizer() {
  const resizer = document.getElementById('chat-resizer');
  const chatPane = document.getElementById('chat-pane');
  const pdfPane = document.getElementById('pdf-pane');
  const sidebar = document.getElementById('sidebar');
  if (!resizer || !chatPane || !pdfPane) return;

  // Restore saved width from localStorage if exists
  const savedWidth = localStorage.getItem('kiln_pdf_pane_width');
  if (savedWidth) {
    const widthVal = parseFloat(savedWidth);
    if (!isNaN(widthVal) && widthVal >= 280) {
      pdfPane.style.width = `${widthVal}px`;
    }
  }

  let isDragging = false;
  let startX = 0;
  let startWidth = 0;
  let renderDebounce = null;

  const onMouseDown = (e) => {
    isDragging = true;
    startX = e.clientX;
    startWidth = pdfPane.getBoundingClientRect().width;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    resizer.classList.add('bg-forge');
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = startX - e.clientX; // Moving left enlarges PDF, right reduces it
    let newWidth = startWidth + deltaX;

    const sidebarWidth = (sidebar && !sidebar.classList.contains('-translate-x-full') && window.innerWidth >= 1024) 
      ? sidebar.offsetWidth 
      : 0;
    const availableWidth = window.innerWidth - sidebarWidth - resizer.offsetWidth;
    const minPdfWidth = 300;
    const maxPdfWidth = Math.max(availableWidth - 320, minPdfWidth);

    if (newWidth < minPdfWidth) newWidth = minPdfWidth;
    if (newWidth > maxPdfWidth) newWidth = maxPdfWidth;

    pdfPane.style.width = `${newWidth}px`;

    // Dynamic render update during drag
    if (renderDebounce) cancelAnimationFrame(renderDebounce);
    renderDebounce = requestAnimationFrame(() => {
      if (pdfDoc && (fitMode === 'width' || fitMode === 'page')) {
        renderPage(currentPage);
      }
    });
  };

  const onMouseUp = () => {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    resizer.classList.remove('bg-forge');
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);

    const finalWidth = pdfPane.getBoundingClientRect().width;
    localStorage.setItem('kiln_pdf_pane_width', finalWidth);
    if (pdfDoc) {
      renderPage(currentPage);
    }
  };

  resizer.addEventListener('mousedown', onMouseDown);

  // Touch support for touch screens
  resizer.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      startX = e.touches[0].clientX;
      startWidth = pdfPane.getBoundingClientRect().width;
      resizer.classList.add('bg-forge');
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = startX - e.touches[0].clientX;
    let newWidth = startWidth + deltaX;
    const minPdfWidth = 280;
    const maxPdfWidth = window.innerWidth - 300;
    if (newWidth < minPdfWidth) newWidth = minPdfWidth;
    if (newWidth > maxPdfWidth) newWidth = maxPdfWidth;
    pdfPane.style.width = `${newWidth}px`;
    if (renderDebounce) cancelAnimationFrame(renderDebounce);
    renderDebounce = requestAnimationFrame(() => {
      if (pdfDoc && (fitMode === 'width' || fitMode === 'page')) {
        renderPage(currentPage);
      }
    });
  }, { passive: true });

  window.addEventListener('touchend', () => {
    if (isDragging) {
      isDragging = false;
      resizer.classList.remove('bg-forge');
      const finalWidth = pdfPane.getBoundingClientRect().width;
      localStorage.setItem('kiln_pdf_pane_width', finalWidth);
      if (pdfDoc) renderPage(currentPage);
    }
  });

  // Double-click resizer to reset to 50/50 split
  resizer.addEventListener('dblclick', () => {
    const sidebarWidth = (sidebar && window.innerWidth >= 1024) ? sidebar.offsetWidth : 0;
    const availableWidth = window.innerWidth - sidebarWidth - resizer.offsetWidth;
    const halfWidth = Math.floor(availableWidth / 2);
    pdfPane.style.width = `${halfWidth}px`;
    localStorage.setItem('kiln_pdf_pane_width', halfWidth);
    if (pdfDoc) {
      renderPage(currentPage);
    }
  });
}

function appendSystemIntro() {
  appendAiMessage('I have this PDF ready in the forge. Ask a question or pick a quick action below. Every answer will include clickable source pages when KILN Studio finds supporting chunks.', []);
}

async function loadPdf() {
  const loadingEl = document.getElementById('pdf-loading');
  const canvasWrapper = document.getElementById('pdf-canvas-wrapper');
  
  if (loadingEl) loadingEl.classList.remove('hidden');
  if (canvasWrapper) canvasWrapper.classList.add('hidden');
  
  const pdfUrl = `${API_URL}/api/document/${encodeURIComponent(currentPdf)}`;
  
  if (!window.pdfjsLib) {
    console.warn('PDF.js not available, falling back to iframe');
    fallbackToIframe(pdfUrl);
    return;
  }
  
  try {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    
    const loadingTask = window.pdfjsLib.getDocument({
      url: pdfUrl,
      cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
      cMapPacked: true,
    });
    
    pdfDoc = await loadingTask.promise;
    totalPages = pdfDoc.numPages || 1;
    updatePageStatus();
    
    if (loadingEl) loadingEl.classList.add('hidden');
    if (canvasWrapper) canvasWrapper.classList.remove('hidden');
    
    renderPage(currentPage);
  } catch (err) {
    console.error('Failed to load PDF via PDF.js:', err);
    fallbackToIframe(pdfUrl);
  }
}

function renderPage(num) {
  if (!pdfDoc) return;
  
  if (pageRendering) {
    pageNumPending = num;
    if (currentRenderTask) {
      try { currentRenderTask.cancel(); } catch (_) {}
    }
    return;
  }
  
  pageRendering = true;
  
  pdfDoc.getPage(num).then(page => {
    const canvas = document.getElementById('pdf-canvas');
    const shell = document.getElementById('pdf-shell');
    if (!canvas || !shell) {
      pageRendering = false;
      return;
    }
    
    const ctx = canvas.getContext('2d');
    const unscaledViewport = page.getViewport({ scale: 1 });
    
    // Container dimensions with comfortable padding
    const padding = 36;
    const availableWidth = Math.max(shell.clientWidth - padding, 280);
    const availableHeight = Math.max(shell.clientHeight - padding, 320);
    
    let scale = 1.0;
    if (fitMode === 'width') {
      scale = (availableWidth / unscaledViewport.width) * zoomScale;
    } else if (fitMode === 'page') {
      const scaleW = availableWidth / unscaledViewport.width;
      const scaleH = availableHeight / unscaledViewport.height;
      scale = Math.min(scaleW, scaleH) * zoomScale;
    } else {
      scale = (availableWidth / unscaledViewport.width) * zoomScale;
    }
    
    scale = Math.max(0.35, Math.min(3.5, scale));
    const viewport = page.getViewport({ scale });
    
    // HiDPI crispness
    const outputScale = window.devicePixelRatio || 1;
    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;
    
    const transform = outputScale !== 1 
      ? [outputScale, 0, 0, outputScale, 0, 0] 
      : null;
      
    const renderContext = {
      canvasContext: ctx,
      transform: transform,
      viewport: viewport,
    };
    
    currentRenderTask = page.render(renderContext);
    currentRenderTask.promise.then(() => {
      pageRendering = false;
      currentRenderTask = null;
      if (pageNumPending !== null) {
        const pending = pageNumPending;
        pageNumPending = null;
        renderPage(pending);
      }
    }).catch(err => {
      pageRendering = false;
      currentRenderTask = null;
      if (err?.name !== 'RenderingCancelledException') {
        console.error('PDF render error:', err);
      }
      if (pageNumPending !== null) {
        const pending = pageNumPending;
        pageNumPending = null;
        renderPage(pending);
      }
    });
  }).catch(err => {
    pageRendering = false;
    console.error('PDF getPage error:', err);
  });
  
  updatePageStatus();
}

function goToPage(page, highlight = false) {
  const clean = Math.max(1, Math.min(Number(page) || 1, totalPages || 1));
  currentPage = clean;
  if (pdfDoc) {
    renderPage(clean);
  } else {
    const frame = document.getElementById('pdf-frame');
    if (frame) frame.src = `${API_URL}/api/document/${encodeURIComponent(currentPdf)}#page=${clean}&view=FitH`;
  }
  const shell = document.getElementById('pdf-shell');
  if (shell) shell.scrollTo({ top: 0, behavior: 'smooth' });
  if (highlight) highlightPage(clean);
  if (window.innerWidth < 1024 && !mobilePdfVisible) toggleMobilePdf();
}

function updatePageStatus() {
  const statusEl = document.getElementById('page-status');
  if (statusEl) statusEl.textContent = `Page ${currentPage}${totalPages ? ` / ${totalPages}` : ''}`;
  const inputEl = document.getElementById('page-input');
  if (inputEl) {
    inputEl.value = currentPage;
    inputEl.max = totalPages || '';
  }
}

function highlightPage(page) {
  document.querySelectorAll('[data-source-page]').forEach(el => el.classList.toggle('bg-yellow', Number(el.dataset.sourcePage) === Number(page)));
  const banner = document.getElementById('source-banner');
  const canvasWrapper = document.getElementById('pdf-canvas-wrapper');
  if (banner) {
    banner.textContent = `Highlighted Page ${page}`;
    banner.classList.remove('hidden');
  }
  if (canvasWrapper) {
    canvasWrapper.classList.add('ring-4', 'ring-forge');
  }
  clearTimeout(highlightPage.timer);
  highlightPage.timer = setTimeout(() => {
    if (canvasWrapper) canvasWrapper.classList.remove('ring-4', 'ring-forge');
    if (banner) banner.classList.add('hidden');
  }, 2200);
}

function setZoom(value) {
  fitMode = 'custom';
  zoomScale = Math.max(0.4, Math.min(3.0, value));
  renderPage(currentPage);
}

function fitToWidth() {
  fitMode = 'width';
  zoomScale = 1.0;
  renderPage(currentPage);
}

function fitToPage() {
  fitMode = 'page';
  zoomScale = 1.0;
  renderPage(currentPage);
}

function fallbackToIframe(url) {
  const shell = document.getElementById('pdf-shell');
  if (!shell) return;
  shell.className = 'relative flex-1 overflow-hidden p-3 bg-paper';
  shell.innerHTML = `
    <div id="source-banner" class="hidden absolute top-5 left-1/2 -translate-x-1/2 z-10 border-4 border-ink bg-forge text-white shadow-brutal px-4 py-1.5 font-black text-sm pointer-events-none">Highlighted Page 1</div>
    <iframe id="pdf-frame" src="${url}#page=${currentPage}&view=FitH" title="PDF viewer" class="h-full w-full bg-card border-4 border-ink shadow-brutal"></iframe>
  `;
}

function toggleMobilePdf() {
  const pdfPane = document.getElementById('pdf-pane');
  const chatPane = document.getElementById('chat-pane');
  mobilePdfVisible = !mobilePdfVisible;
  pdfPane.classList.toggle('hidden', !mobilePdfVisible);
  pdfPane.classList.toggle('flex', mobilePdfVisible);
  pdfPane.classList.toggle('fixed', mobilePdfVisible);
  pdfPane.classList.toggle('inset-0', mobilePdfVisible);
  pdfPane.classList.toggle('z-[60]', mobilePdfVisible);
  chatPane.classList.toggle('hidden', mobilePdfVisible);
  document.getElementById('mobile-pdf-tab').textContent = mobilePdfVisible ? 'Chat' : 'PDF';
}

function clearChat() {
  document.getElementById('chat-history').innerHTML = '';
  appendSystemIntro();
  showToast('Started a fresh chat view for this document.');
}

function sendSuggestion(label) {
  sendMessage(prompts[label] || label, label);
}

async function sendMessage(overrideText = '', label = '') {
  const input = document.getElementById('chat-input');
  const text = (overrideText || input.value).trim();
  if (!text) return;
  input.value = '';
  input.style.height = 'auto';
  appendUserMessage(label || text);
  setLoading(true);
  try {
    const res = await apiFetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ filename: currentPdf, message: text })
    });
    appendAiMessage(res.data.answer, res.data.sources || []);
  } catch (err) {
    appendAiMessage(`Sorry, I hit an error: ${err.message}`, []);
  } finally {
    setLoading(false);
  }
}

function appendUserMessage(text) {
  const row = document.createElement('article');
  row.className = 'message-in justify-self-end max-w-[94%] sm:max-w-[85%] flex items-start gap-2.5 sm:gap-3 flex-row-reverse min-w-0';
  row.innerHTML = `
    <div class="h-9 w-9 sm:h-10 sm:w-10 rounded-full border-4 border-ink bg-yellow grid place-items-center shadow-sm-brutal shrink-0"><span class="material-symbols-outlined text-lg sm:text-2xl">person</span></div>
    <div class="min-w-0">
      <div class="text-right text-xs font-black uppercase tracking-[.14em] text-muted">You | ${timeNow()}</div>
      <div class="mt-1 bg-yellow border-4 border-ink shadow-brutal p-3 sm:p-4 font-semibold whitespace-pre-wrap break-words">${escapeHtml(text)}</div>
    </div>`;
  pushMessage(row);
}

function appendAiMessage(text, sources) {
  const row = document.createElement('article');
  row.className = 'message-in justify-self-start max-w-[98%] sm:max-w-[90%] flex items-start gap-2.5 sm:gap-3 min-w-0';
  const sourceHtml = sources && sources.length ? `
    <div class="mt-4 pt-3 border-t-4 border-ink">
      <p class="font-black mb-2 text-xs sm:text-sm">Sources:</p>
      <div class="flex flex-wrap gap-1.5 sm:gap-2">
        ${sources.map(src => `<button data-source-page="${Number(src)}" onclick="window.goToPage(${Number(src)}, true)" class="border-2 sm:border-4 border-ink bg-card px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-black hover:bg-forge hover:text-white transition">Page ${escapeHtml(src)}</button>`).join('')}
      </div>
    </div>` : '';
  row.innerHTML = `
    <div class="h-9 w-9 sm:h-10 sm:w-10 rounded-full border-4 border-ink bg-purple text-white grid place-items-center shadow-sm-brutal shrink-0"><span class="material-symbols-outlined text-lg sm:text-2xl">smart_toy</span></div>
    <div class="min-w-0 flex-1">
      <div class="text-xs font-black uppercase tracking-[.14em] text-muted">KILN Studio | ${timeNow()}</div>
      <div class="mt-1 bg-card border-4 border-ink shadow-brutal p-3 sm:p-4 font-semibold leading-relaxed">
        <div class="whitespace-pre-wrap break-words">${formatMessage(text)}</div>
        ${sourceHtml}
        <div class="mt-3 flex gap-2">
          <button onclick="window.copyMessage(this)" class="border-2 sm:border-4 border-ink bg-soft px-2 py-1 text-xs font-black hover:bg-forge hover:text-white transition">Copy</button>
          <button onclick="window.speakMessage(this)" class="border-2 sm:border-4 border-ink bg-soft px-2 py-1 text-xs font-black hover:bg-forge hover:text-white transition">Read</button>
        </div>
      </div>
    </div>`;
  pushMessage(row);
}

function pushMessage(row) {
  const history = document.getElementById('chat-history');
  history.appendChild(row);
  history.scrollTop = history.scrollHeight;
}

function setLoading(isLoading) {
  document.getElementById('ai-loading').classList.toggle('hidden', !isLoading);
  document.getElementById('send-btn').disabled = isLoading;
}

function copyMessage(button) {
  const text = button.closest('.border-4').querySelector('.whitespace-pre-wrap').innerText;
  navigator.clipboard.writeText(text).then(() => showToast('Copied answer.'));
}

function speakMessage(button) {
  const text = button.closest('.border-4').querySelector('.whitespace-pre-wrap').innerText;
  if (!window.speechSynthesis) {
    showToast('Speech synthesis is not supported in this browser.');
    return;
  }
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    return;
  }
  speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const mic = document.getElementById('mic-btn');
  if (!SpeechRecognition) {
    mic.addEventListener('click', () => showToast('Voice input is not supported in this browser.'));
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.onstart = () => mic.classList.add('bg-yellow', 'text-ink');
  recognition.onend = () => mic.classList.remove('bg-yellow', 'text-ink');
  recognition.onresult = event => {
    const input = document.getElementById('chat-input');
    input.value = `${input.value} ${event.results[0][0].transcript}`.trim();
    input.dispatchEvent(new Event('input'));
  };
  recognition.onerror = () => showToast('Voice capture failed.');
  mic.addEventListener('click', () => recognition.start());
}

function openModal() {
  document.getElementById('modal').classList.remove('hidden');
  document.getElementById('modal').classList.add('flex');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  document.getElementById('modal').classList.remove('flex');
}

// logout is imported from ./api.js

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.add('hidden'), 3000);
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatMessage(text) {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong class="bg-yellow px-1 border-2 border-ink">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="bg-soft border-2 border-ink px-1">$1</code>');
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[char]));
}

// Expose modules to global window scope for inline HTML actions
window.goToPage = goToPage;
window.sendSuggestion = sendSuggestion;
window.copyMessage = copyMessage;
window.speakMessage = speakMessage;
