/**
 * KILN Studio - Carousel Forge Controller
 * Handles live preview, scale transformation, slide deck navigation,
 * template theme switching, aspect ratio toggling, and 1080px high-res PNG export.
 */

import html2canvas from 'html2canvas';
import * as htmlToImage from 'html-to-image';
import JSZip from 'jszip';
import { 
  CANVAS_SIZES, 
  TEMPLATE_THEMES, 
  DEFAULT_SLIDES, 
  PRESET_DECKS,
  renderSlideHTML 
} from './carousel_templates.js';

// Application State
const state = {
  activeTheme: 'kiln_neobrutalist',
  aspectRatio: 'portrait', // 'portrait' (1080x1350) | 'square' (1080x1080)
  currentSlideIndex: 0,
  slides: JSON.parse(JSON.stringify(DEFAULT_SLIDES)),
  authorHandle: '@kilnstudio',
  zoomMode: 'fit', // 'fit' | 0.35 | 0.5 | 0.75 | 1
  isExporting: false
};

// DOM References
let canvasWrapper = null;
let slideNode = null;
let slideDeckStrip = null;
let currentSlideCounter = null;
let previewScaleFactor = 0.45;

/**
 * Initialize Carousel Forge
 */
export function initCarouselForge() {
  canvasWrapper = document.getElementById('carousel-canvas-wrapper');
  slideNode = document.getElementById('active-slide-canvas');
  slideDeckStrip = document.getElementById('slide-deck-strip');
  currentSlideCounter = document.getElementById('current-slide-counter');

  // Check if content was transferred from Autonomous Creator Studio
  loadTransferredStudioContent();

  // Bind all interactive elements
  bindThemePickers();
  bindAspectRatioToggles();
  bindSlideNavigation();
  bindContentEditor();
  bindExportActions();
  bindPresetSelectors();

  // Setup dynamic resize observer for preview container
  setupPreviewScaler();

  // Initial render
  renderDeckStrip();
  renderActiveSlide();
  updateEditorFields();
}

/**
 * Loads content transferred from Creator Studio (via sessionStorage)
 */
function loadTransferredStudioContent() {
  try {
    const rawData = sessionStorage.getItem('kiln_carousel_export_data');
    if (!rawData) return;
    const data = JSON.parse(rawData);

    if (data.slides && Array.isArray(data.slides) && data.slides.length > 0) {
      state.slides = data.slides.map((s, idx) => {
        let cleanBody = '';
        if (Array.isArray(s.body)) {
          cleanBody = s.body.join('\n\n');
        } else if (typeof s.body === 'string') {
          cleanBody = s.body.replace(/\.,\s*/g, '.\n\n').replace(/!,\s*/g, '!\n\n').replace(/\?,\s*/g, '?\n\n');
        } else {
          cleanBody = String(s.body || '');
        }

        return {
          id: `slide-${idx + 1}`,
          type: s.type || (idx === 0 ? 'hook' : (idx === data.slides.length - 1 ? 'cta' : 'step')),
          badge: s.badge || (idx === 0 ? 'VERIFIED TAKEAWAY' : `STEP 0${idx + 1}`),
          headline: s.headline || 'Verified Research Finding',
          highlight_word: s.highlight_word || '',
          body: cleanBody,
          tag: s.source_tag || 'kiln studio',
          source: s.source_tag || 'verified sources',
          stepNumber: String(idx + 1).padStart(2, '0')
        };
      });
      showToast(`Loaded ${state.slides.length} slides from Creator Studio!`);
    }

    if (data.topic) {
      const topicEl = document.getElementById('deck-topic-title');
      if (topicEl) topicEl.textContent = data.topic;
    }
  } catch (err) {
    console.warn('Failed to parse transferred carousel data:', err);
  }
}

/**
 * Dynamically computes preview scale so 1080px canvas fits neatly on any screen
 */
function setupPreviewScaler() {
  const container = document.getElementById('preview-viewport-container');
  if (!container) return;

  const updateScale = () => {
    const targetSize = CANVAS_SIZES[state.aspectRatio];
    // Subtract only minimal border + shadow margin (14px) so canvas hugs the container vertically
    const availableW = Math.max(container.clientWidth - 16, 100);
    const availableH = Math.max(container.clientHeight - 16, 100);

    if (state.zoomMode === 'fit') {
      const scaleW = availableW / targetSize.width;
      const scaleH = availableH / targetSize.height;
      // Exact fit scaling eliminates blank space above and below the card
      previewScaleFactor = Math.min(scaleW, scaleH);
    } else {
      previewScaleFactor = parseFloat(state.zoomMode) || 0.45;
    }

    // Apply scale to wrapper
    if (canvasWrapper) {
      canvasWrapper.style.width = `${Math.round(targetSize.width * previewScaleFactor)}px`;
      canvasWrapper.style.height = `${Math.round(targetSize.height * previewScaleFactor)}px`;
    }
    if (slideNode) {
      slideNode.style.transform = `scale(${previewScaleFactor})`;
      slideNode.style.transformOrigin = 'top left';
    }

    const zoomLabel = document.getElementById('zoom-percentage-label');
    if (zoomLabel) zoomLabel.textContent = `${Math.round(previewScaleFactor * 100)}%`;
  };

  window.addEventListener('resize', updateScale);
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => updateScale());
    ro.observe(container);
  }
  setTimeout(updateScale, 30);
  setTimeout(updateScale, 150);
}

/**
 * Renders the active slide inside the 1080px canvas node
 */
function renderActiveSlide() {
  if (!slideNode) return;
  const currentSlide = state.slides[state.currentSlideIndex] || state.slides[0];
  const targetSize = CANVAS_SIZES[state.aspectRatio];

  // Force exact pixel dimensions on container
  slideNode.style.width = `${targetSize.width}px`;
  slideNode.style.height = `${targetSize.height}px`;

  // Generate HTML from template engine
  const slideHtml = renderSlideHTML(currentSlide, state.activeTheme, {
    aspectRatio: state.aspectRatio,
    currentIndex: state.currentSlideIndex,
    totalCount: state.slides.length,
    handle: state.authorHandle
  });

  slideNode.innerHTML = slideHtml;

  // Update header indicators
  if (currentSlideCounter) {
    currentSlideCounter.textContent = `Slide ${state.currentSlideIndex + 1} of ${state.slides.length}`;
  }

  // Highlight active thumbnail in deck strip
  document.querySelectorAll('.deck-thumb-btn').forEach((btn, idx) => {
    if (idx === state.currentSlideIndex) {
      btn.classList.add('border-forge', 'ring-2', 'ring-forge');
      btn.classList.remove('border-ink');
    } else {
      btn.classList.remove('border-forge', 'ring-2', 'ring-forge');
      btn.classList.add('border-ink');
    }
  });
}

/**
 * Renders the slide navigator deck strip
 */
function renderDeckStrip() {
  if (!slideDeckStrip) return;
  slideDeckStrip.innerHTML = '';

  state.slides.forEach((slide, idx) => {
    const thumbBtn = document.createElement('button');
    const isActive = idx === state.currentSlideIndex;
    thumbBtn.className = `deck-thumb-btn press p-1.5 border-2 ${isActive ? 'border-forge ring-2 ring-forge bg-card' : 'border-ink bg-paper'} shadow-xs flex flex-col justify-between text-left shrink-0 transition w-24 h-14 relative`;
    thumbBtn.innerHTML = `
      <div class="flex items-center justify-between w-full leading-none">
        <span class="text-[8px] font-black uppercase px-1 py-0.5 bg-ink text-white rounded-xs">
          0${idx + 1}
        </span>
        <span class="text-[8px] font-bold text-muted uppercase truncate max-w-[50px]">
          ${escapeHtml(slide.type)}
        </span>
      </div>
      <div class="text-[9px] font-black text-ink line-clamp-1 leading-tight mt-0.5">
        ${escapeHtml(slide.headline)}
      </div>
    `;

    thumbBtn.addEventListener('click', () => {
      state.currentSlideIndex = idx;
      renderActiveSlide();
      updateEditorFields();
    });

    slideDeckStrip.appendChild(thumbBtn);
  });
}

/**
 * Binds theme selection cards
 */
function bindThemePickers() {
  document.querySelectorAll('[data-theme-id]').forEach(card => {
    card.addEventListener('click', (e) => {
      // If user clicked the preset deck button inside, let preset deck handler handle it
      if (e.target.closest('.preset-deck-btn')) return;
      
      const themeId = card.getAttribute('data-theme-id');
      if (themeId && TEMPLATE_THEMES[themeId]) {
        state.activeTheme = themeId;
        document.querySelectorAll('[data-theme-id]').forEach(b => {
          b.classList.remove('ring-2', 'ring-forge', 'active-template', 'active-theme');
        });
        card.classList.add('ring-2', 'ring-forge', 'active-template');
        renderActiveSlide();
        showToast(`Applied ${TEMPLATE_THEMES[themeId].name}`);
      }
    });
  });
}

/**
 * Binds aspect ratio toggle (1080x1350 vs 1080x1080)
 */
function bindAspectRatioToggles() {
  const togglePortrait = document.getElementById('ratio-toggle-portrait');
  const toggleSquare = document.getElementById('ratio-toggle-square');

  const setRatio = (ratio) => {
    state.aspectRatio = ratio;
    if (ratio === 'portrait') {
      togglePortrait?.classList.add('bg-forge', 'text-white');
      togglePortrait?.classList.remove('bg-card', 'text-ink');
      toggleSquare?.classList.remove('bg-forge', 'text-white');
      toggleSquare?.classList.add('bg-card', 'text-ink');
    } else {
      toggleSquare?.classList.add('bg-forge', 'text-white');
      toggleSquare?.classList.remove('bg-card', 'text-ink');
      togglePortrait?.classList.remove('bg-forge', 'text-white');
      togglePortrait?.classList.add('bg-card', 'text-ink');
    }
    setupPreviewScaler();
    renderActiveSlide();
    showToast(`Aspect ratio switched to ${CANVAS_SIZES[ratio].label}`);
  };

  togglePortrait?.addEventListener('click', () => setRatio('portrait'));
  toggleSquare?.addEventListener('click', () => setRatio('square'));
}

/**
 * Slide Navigation (Prev, Next, Add, Delete)
 */
function bindSlideNavigation() {
  document.getElementById('prev-slide-btn')?.addEventListener('click', () => {
    if (state.currentSlideIndex > 0) {
      state.currentSlideIndex--;
      renderActiveSlide();
      updateEditorFields();
    }
  });

  document.getElementById('next-slide-btn')?.addEventListener('click', () => {
    if (state.currentSlideIndex < state.slides.length - 1) {
      state.currentSlideIndex++;
      renderActiveSlide();
      updateEditorFields();
    }
  });

  document.getElementById('add-slide-btn')?.addEventListener('click', () => {
    const newIdx = state.slides.length + 1;
    state.slides.push({
      id: `slide-${Date.now()}`,
      type: 'step',
      badge: `TAKEAWAY 0${newIdx}`,
      headline: 'New Verified Takeaway',
      highlight_word: '',
      body: 'Add your grounded insight, statistical corroboration, or step explanation here.',
      tag: 'kiln studio',
      source: 'primary sources',
      stepNumber: String(newIdx).padStart(2, '0')
    });
    state.currentSlideIndex = state.slides.length - 1;
    renderDeckStrip();
    renderActiveSlide();
    updateEditorFields();
    showToast('Added new slide to carousel deck');
  });

  document.getElementById('duplicate-slide-btn')?.addEventListener('click', () => {
    const current = state.slides[state.currentSlideIndex];
    const clone = JSON.parse(JSON.stringify(current));
    clone.id = `slide-${Date.now()}`;
    state.slides.splice(state.currentSlideIndex + 1, 0, clone);
    state.currentSlideIndex++;
    renderDeckStrip();
    renderActiveSlide();
    updateEditorFields();
    showToast('Duplicated current slide');
  });

  document.getElementById('delete-slide-btn')?.addEventListener('click', () => {
    if (state.slides.length <= 1) {
      showToast('Carousel deck must have at least 1 slide.');
      return;
    }
    state.slides.splice(state.currentSlideIndex, 1);
    if (state.currentSlideIndex >= state.slides.length) {
      state.currentSlideIndex = state.slides.length - 1;
    }
    renderDeckStrip();
    renderActiveSlide();
    updateEditorFields();
    showToast('Slide removed from deck');
  });
}

/**
 * Slide Content Editor Form Binding
 */
function bindContentEditor() {
  const headlineInput = document.getElementById('edit-headline-input');
  const badgeInput = document.getElementById('edit-badge-input');
  const highlightInput = document.getElementById('edit-highlight-input');
  const bodyInput = document.getElementById('edit-body-input');
  const typeSelect = document.getElementById('edit-type-select');
  const handleInput = document.getElementById('edit-handle-input');

  const onFieldChange = () => {
    const cur = state.slides[state.currentSlideIndex];
    if (!cur) return;

    if (headlineInput) cur.headline = headlineInput.value;
    if (badgeInput) cur.badge = badgeInput.value;
    if (highlightInput) cur.highlight_word = highlightInput.value;
    if (bodyInput) cur.body = bodyInput.value;
    if (typeSelect) cur.type = typeSelect.value;
    if (handleInput) state.authorHandle = handleInput.value.trim() || '@kilnstudio';

    renderActiveSlide();
    // Also update thumbnail text
    const activeThumb = document.querySelectorAll('.deck-thumb-btn')[state.currentSlideIndex];
    if (activeThumb) {
      const hEl = activeThumb.querySelector('.text-xs');
      if (hEl) hEl.textContent = cur.headline;
    }
  };

  [headlineInput, badgeInput, highlightInput, bodyInput, handleInput].forEach(el => {
    el?.addEventListener('input', onFieldChange);
  });
  typeSelect?.addEventListener('change', onFieldChange);
}

/**
 * Sync form inputs with active slide content
 */
function updateEditorFields() {
  const cur = state.slides[state.currentSlideIndex];
  if (!cur) return;

  const headlineInput = document.getElementById('edit-headline-input');
  const badgeInput = document.getElementById('edit-badge-input');
  const highlightInput = document.getElementById('edit-highlight-input');
  const bodyInput = document.getElementById('edit-body-input');
  const typeSelect = document.getElementById('edit-type-select');
  const handleInput = document.getElementById('edit-handle-input');

  if (headlineInput) headlineInput.value = cur.headline || '';
  if (badgeInput) badgeInput.value = cur.badge || '';
  if (highlightInput) highlightInput.value = cur.highlight_word || '';
  if (bodyInput) bodyInput.value = cur.body || '';
  if (typeSelect) typeSelect.value = cur.type || 'step';
  if (handleInput) handleInput.value = state.authorHandle || '@kilnstudio';
}

/**
 * High-Res 1080px Canvas Export Actions
 */
function bindExportActions() {
  // 1. Export Current Slide as PNG
  document.getElementById('export-slide-png-btn')?.addEventListener('click', async () => {
    await exportCurrentSlidePNG();
  });

  // 2. Export All Slides as ZIP
  document.getElementById('export-all-zip-btn')?.addEventListener('click', async () => {
    await exportAllSlidesZip();
  });

  // 3. Copy Slide to Clipboard
  document.getElementById('copy-slide-clipboard-btn')?.addEventListener('click', async () => {
    await copySlideToClipboard();
  });
}

/**
 * Captures an unscaled fixed 1080px canvas element into a clean PNG blob/canvas
 * Uses html-to-image (native browser SVG foreignObject rasterizer) for pixel-perfect fidelity,
 * with automatic fallback to html2canvas if needed.
 */
async function captureSlideCanvas(slideData, slideIdx) {
  const targetSize = CANVAS_SIZES[state.aspectRatio];

  // Wait for Google Fonts to ensure accurate font glyph rendering
  await document.fonts.ready;

  const offscreen = document.createElement('div');
  offscreen.style.position = 'fixed';
  offscreen.style.left = '0';
  offscreen.style.top = '0';
  offscreen.style.width = `${targetSize.width}px`;
  offscreen.style.height = `${targetSize.height}px`;
  offscreen.style.margin = '0';
  offscreen.style.padding = '0';
  offscreen.style.border = 'none';
  offscreen.style.zIndex = '-99999';
  offscreen.style.pointerEvents = 'none';
  offscreen.style.visibility = 'visible';
  offscreen.style.overflow = 'hidden';
  offscreen.style.transform = 'none';

  offscreen.innerHTML = renderSlideHTML(slideData, state.activeTheme, {
    aspectRatio: state.aspectRatio,
    currentIndex: slideIdx,
    totalCount: state.slides.length,
    handle: state.authorHandle
  });

  document.body.appendChild(offscreen);

  // Allow browser layout engine 100ms to compute exact font metrics and bounding boxes
  await new Promise(r => setTimeout(r, 100));

  const targetNode = offscreen.firstElementChild || offscreen;

  try {
    // 1. Primary engine: htmlToImage (uses browser's native Blink rasterizer via SVG foreignObject)
    // Renders 100% faithful to the preview: perfect gradients, frosted blur, box shadows, text baselines
    const dataUrl = await htmlToImage.toPng(targetNode, {
      width: targetSize.width,
      height: targetSize.height,
      pixelRatio: 1,
      skipAutoScale: true,
      cacheBust: false
    });

    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = dataUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = targetSize.width;
    canvas.height = targetSize.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    return canvas;
  } catch (err) {
    console.warn('html-to-image fallback to html2canvas:', err);
    // 2. High-res html2canvas fallback
    const canvas = await html2canvas(targetNode, {
      width: targetSize.width,
      height: targetSize.height,
      scale: 1,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      windowWidth: targetSize.width,
      windowHeight: targetSize.height,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false
    });

    return canvas;
  } finally {
    document.body.removeChild(offscreen);
  }
}

/**
 * Downloads current slide as PNG
 */
async function exportCurrentSlidePNG() {
  if (state.isExporting) return;
  state.isExporting = true;
  const btn = document.getElementById('export-slide-png-btn');
  const originalText = btn ? btn.innerHTML : '';
  if (btn) btn.innerHTML = '<span class="material-symbols-outlined text-sm animate-spin">sync</span> Rendering 1080px...';

  try {
    const cur = state.slides[state.currentSlideIndex];
    const canvas = await captureSlideCanvas(cur, state.currentSlideIndex);

    const link = document.createElement('a');
    const safeTitle = (cur.headline || 'carousel-slide').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
    link.download = `kiln-${state.activeTheme}-slide-${state.currentSlideIndex + 1}-${safeTitle}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    showToast(`Slide ${state.currentSlideIndex + 1} exported at ${CANVAS_SIZES[state.aspectRatio].width}×${CANVAS_SIZES[state.aspectRatio].height}px!`);
  } catch (err) {
    console.error('Export error:', err);
    showToast(`Export error: ${err.message}`);
  } finally {
    state.isExporting = false;
    if (btn) btn.innerHTML = originalText;
  }
}

/**
 * Batch exports entire carousel deck into a ZIP archive
 */
async function exportAllSlidesZip() {
  if (state.isExporting) return;
  state.isExporting = true;
  const btn = document.getElementById('export-all-zip-btn');
  const originalText = btn ? btn.innerHTML : '';

  try {
    const zip = new JSZip();
    const total = state.slides.length;

    for (let i = 0; i < total; i++) {
      if (btn) btn.innerHTML = `<span class="material-symbols-outlined text-sm animate-spin">sync</span> Rendering ${i + 1}/${total}...`;
      const slide = state.slides[i];
      const canvas = await captureSlideCanvas(slide, i);
      const dataUrl = canvas.toDataURL('image/png');
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');

      const fileName = `slide-${String(i + 1).padStart(2, '0')}.png`;
      zip.file(fileName, base64Data, { base64: true });
    }

    if (btn) btn.innerHTML = '<span class="material-symbols-outlined text-sm animate-spin">archive</span> Building ZIP...';
    const content = await zip.generateAsync({ type: 'blob' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `kiln-carousel-${state.activeTheme}-${Date.now()}.zip`;
    link.click();

    showToast(`Downloaded full carousel (${total} slides in ZIP)!`);
  } catch (err) {
    console.error('ZIP Export error:', err);
    showToast(`ZIP generation failed: ${err.message}`);
  } finally {
    state.isExporting = false;
    if (btn) btn.innerHTML = originalText;
  }
}

/**
 * Copies slide PNG directly to system clipboard
 */
async function copySlideToClipboard() {
  const btn = document.getElementById('copy-slide-clipboard-btn');
  const originalText = btn ? btn.innerHTML : '';
  if (btn) btn.innerHTML = '<span class="material-symbols-outlined text-sm animate-spin">sync</span> Copying...';

  try {
    const cur = state.slides[state.currentSlideIndex];
    const canvas = await captureSlideCanvas(cur, state.currentSlideIndex);

    canvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        showToast('Slide copied to clipboard as PNG! Ready to paste.');
      } catch (clipErr) {
        showToast('Direct clipboard copy unsupported by browser; downloading image instead.');
        const link = document.createElement('a');
        link.download = `slide-${state.currentSlideIndex + 1}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
      }
    }, 'image/png');
  } catch (err) {
    showToast(`Clipboard error: ${err.message}`);
  } finally {
    if (btn) btn.innerHTML = originalText;
  }
}

/**
 * Binds Preset Selectors
 */
function bindPresetSelectors() {
  document.querySelectorAll('.preset-deck-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetId = btn.getAttribute('data-preset-id');
      const preset = PRESET_DECKS[presetId];
      if (!preset) return;

      // 1. Load slides from preset
      state.slides = JSON.parse(JSON.stringify(preset.slides));
      state.currentSlideIndex = 0;

      // 2. Switch to matching theme
      if (preset.theme && TEMPLATE_THEMES[preset.theme]) {
        state.activeTheme = preset.theme;
        document.querySelectorAll('[data-theme-id]').forEach(b => {
          if (b.getAttribute('data-theme-id') === preset.theme) {
            b.classList.add('ring-2', 'ring-forge', 'active-template');
          } else {
            b.classList.remove('ring-2', 'ring-forge', 'active-template', 'active-theme');
          }
        });
      }

      // 3. Switch to matching aspect ratio
      if (preset.ratio && CANVAS_SIZES[preset.ratio]) {
        state.aspectRatio = preset.ratio;
        const togglePortrait = document.getElementById('ratio-toggle-portrait');
        const toggleSquare = document.getElementById('ratio-toggle-square');
        if (preset.ratio === 'portrait') {
          togglePortrait?.classList.add('bg-forge', 'text-white');
          togglePortrait?.classList.remove('bg-card', 'text-ink');
          toggleSquare?.classList.remove('bg-forge', 'text-white');
          toggleSquare?.classList.add('bg-card', 'text-ink');
        } else {
          toggleSquare?.classList.add('bg-forge', 'text-white');
          toggleSquare?.classList.remove('bg-card', 'text-ink');
          togglePortrait?.classList.remove('bg-forge', 'text-white');
          togglePortrait?.classList.add('bg-card', 'text-ink');
        }
        setupPreviewScaler();
      }

      // 4. Update Header Topic Title
      const topicEl = document.getElementById('deck-topic-title');
      if (topicEl) topicEl.textContent = preset.name;

      // 5. Render
      renderDeckStrip();
      renderActiveSlide();
      updateEditorFields();
      showToast(`Loaded "${preset.name}" (${preset.slides.length} slides)`);
    });
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Auto-run if on carousel page
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('carousel-canvas-wrapper')) {
      initCarouselForge();
    }
  });
}
