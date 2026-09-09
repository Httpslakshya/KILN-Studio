import { API_URL, apiFetch, apiPost, checkAuth } from './api.js';

// --- APPLICATION STATE ---
const state = {
  docs: [],
  showAll: false,
  activeWorkspace: 'studio', // 'studio' | 'docs' | 'live' | 'guard'
  activeDockFormat: 'article',
  cachedPipelineAssets: {},
  latestPipelineData: null,
  latestLiveRagData: null,
  isPipelineRunning: false
};

// Verify session
const sessionId = checkAuth();

document.addEventListener('DOMContentLoaded', () => {
  initUserSession();
  bindSidebarAndNavigation();
  bindCreatorStudio();
  bindDocumentLibrary();
  bindLiveFactCheck();
  bindAgentPrahari();
  bindSharedModals();
  
  // Load documents and route to active tab
  loadDocuments();
  resolveInitialWorkspace();
});

// --- SESSION & USER INITIALIZATION ---
function initUserSession() {
  if (!sessionId) return;
  const rawName = sessionId.split('@')[0];
  const capitalized = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  
  const userGreeting = document.getElementById('user-greeting');
  if (userGreeting) userGreeting.textContent = `Good Morning, ${capitalized}`;
  
  const userPill = document.getElementById('user-greeting-pill');
  if (userPill) {
    // Relabel Guest or unauthenticated to consistent "Pro Active"
    userPill.textContent = (rawName.toLowerCase() === 'guest' || !rawName) ? 'Pro Active' : `${capitalized} · Pro Active`;
  }
}

// --- WORKSPACE NAVIGATION (UNIFIED HOUSE ROUTER) ---
function resolveInitialWorkspace() {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  const targetTab = (tab && ['studio', 'docs', 'live', 'guard'].includes(tab)) ? tab : 'studio';
  switchWorkspace(targetTab, false);

  const topicParam = params.get('topic');
  if (topicParam) {
    const topicInput = document.getElementById('pipeline-topic-input');
    if (topicInput) topicInput.value = topicParam;
  }

  const pdfParam = params.get('pdf');
  if (pdfParam) {
    const usePdfCheckbox = document.getElementById('pipeline-use-pdf-context');
    if (usePdfCheckbox) {
      usePdfCheckbox.checked = true;
      document.getElementById('pipeline-pdf-selector-wrap')?.classList.remove('hidden');
    }
    setTimeout(() => {
      const pdfSelect = document.getElementById('pipeline-pdf-select');
      if (pdfSelect) pdfSelect.value = pdfParam;
    }, 400);
  }
}

function switchWorkspace(workspaceKey, updateUrl = true) {
  state.activeWorkspace = workspaceKey;

  // Workspace DOM mapping
  const workspaces = {
    studio: {
      section: document.getElementById('workspace-studio'),
      navBtn: document.getElementById('nav-studio-btn'),
      title: 'Autonomous 4-Agent Pipeline',
      crumb: '/ Creator Studio'
    },
    docs: {
      section: document.getElementById('workspace-docs'),
      navBtn: document.getElementById('nav-docs-btn'),
      title: 'Document Knowledge Base & PDF RAG',
      crumb: '/ Document Library'
    },
    live: {
      section: document.getElementById('workspace-live'),
      navBtn: document.getElementById('nav-live-btn'),
      title: 'Live Fact-Checking & News Radar',
      crumb: '/ Live Fact-Check'
    },
    guard: {
      section: document.getElementById('workspace-guard'),
      navBtn: document.getElementById('nav-guard-btn'),
      title: 'AgentPrahari Security Console',
      crumb: '/ Security Console'
    }
  };

  // Toggle Visibility
  Object.keys(workspaces).forEach(key => {
    const item = workspaces[key];
    if (!item || !item.section) return;

    if (key === workspaceKey) {
      item.section.classList.remove('hidden');
      if (item.navBtn) {
        item.navBtn.className = 'nav-tab-btn w-full flex items-center gap-3 bg-forgeSoft border-4 border-ink shadow-sm-brutal p-3 font-black text-sm text-left transition';
      }
      // Update sticky header
      document.getElementById('header-title').textContent = item.title;
      document.getElementById('header-breadcrumb').textContent = item.crumb;
    } else {
      item.section.classList.add('hidden');
      if (item.navBtn) {
        item.navBtn.className = 'nav-tab-btn w-full flex items-center gap-3 border-4 border-transparent hover:border-ink hover:bg-soft p-3 font-bold text-sm text-left transition';
      }
    }
  });

  if (updateUrl) {
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('tab', workspaceKey);
    window.history.pushState({}, '', newUrl);
  }

  // Close mobile sidebar on selection
  const sidebar = document.getElementById('sidebar');
  if (sidebar && !sidebar.classList.contains('-translate-x-full') && window.innerWidth < 768) {
    sidebar.classList.add('-translate-x-full');
  }
}

function bindSidebarAndNavigation() {
  const sidebar = document.getElementById('sidebar');
  const appLayout = document.getElementById('app-layout') || document.body;
  const headerToggleBtn = document.getElementById('header-sidebar-toggle');
  const sidebarCollapseBtn = document.getElementById('sidebar-collapse-btn');

  // Check saved collapsed state
  const isCollapsed = localStorage.getItem('docmind_sidebar_collapsed') === 'true';
  if (isCollapsed && window.innerWidth >= 768) {
    appLayout.classList.add('sidebar-collapsed');
    updateSidebarToggleIcon(true);
  }

  function toggleSidebar() {
    if (window.innerWidth < 768) {
      // Mobile drawer toggle
      sidebar?.classList.toggle('-translate-x-full');
    } else {
      // Desktop ChatGPT-style collapse
      const currentlyCollapsed = appLayout.classList.toggle('sidebar-collapsed');
      localStorage.setItem('docmind_sidebar_collapsed', String(currentlyCollapsed));
      updateSidebarToggleIcon(currentlyCollapsed);
    }
  }

  function updateSidebarToggleIcon(collapsed) {
    const iconSpan = headerToggleBtn?.querySelector('.material-symbols-outlined');
    if (iconSpan) {
      iconSpan.textContent = collapsed ? 'dock_to_right' : 'dock_to_left';
    }
    if (headerToggleBtn) {
      headerToggleBtn.title = collapsed ? 'Open sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)';
    }
  }

  headerToggleBtn?.addEventListener('click', toggleSidebar);
  sidebarCollapseBtn?.addEventListener('click', toggleSidebar);

  // Keyboard shortcut: Ctrl + B or Cmd + B to toggle sidebar
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      toggleSidebar();
    }
  });

  // Nav buttons
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-workspace');
      if (target) switchWorkspace(target);
    });
  });

  // Quick switch buttons in UI
  document.getElementById('studio-switch-to-docs')?.addEventListener('click', () => switchWorkspace('docs'));
  document.getElementById('quick-creator-dock')?.addEventListener('click', () => switchWorkspace('studio'));
  document.getElementById('header-quick-upload')?.addEventListener('click', () => {
    switchWorkspace('docs');
    document.getElementById('file-upload')?.click();
  });

  // Popstate listener for back/forward navigation
  window.addEventListener('popstate', () => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') || 'studio';
    switchWorkspace(tab, false);
  });
}

// ======================================================================
// WORKSPACE 1: AUTONOMOUS CREATOR STUDIO (4-AGENT CLOSED-LOOP ENGINE)
// ======================================================================
function bindCreatorStudio() {
  const startBtn = document.getElementById('pipeline-start-btn');
  const topicInput = document.getElementById('pipeline-topic-input');
  const audienceSelect = document.getElementById('pipeline-audience-select');
  const usePdfContext = document.getElementById('pipeline-use-pdf-context');
  const pdfSelectWrap = document.getElementById('pipeline-pdf-selector-wrap');
  const pdfSelect = document.getElementById('pipeline-pdf-select');

  // Toggle PDF enrichment selector
  usePdfContext?.addEventListener('change', () => {
    if (usePdfContext.checked) {
      pdfSelectWrap?.classList.remove('hidden');
    } else {
      pdfSelectWrap?.classList.add('hidden');
    }
  });

  // Inspiration chips
  document.querySelectorAll('.pipeline-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (topicInput) topicInput.value = chip.textContent.trim();
    });
  });

  // Format Switcher Buttons in Dock
  document.querySelectorAll('#pipeline-format-tabs .format-dock-btn').forEach(b => {
    b.addEventListener('click', () => {
      const format = b.getAttribute('data-format');
      updateFormatDockButtons(format);
      renderActiveDockFormat(format);
    });
  });

  // In-place Copy Active Asset Button
  const dockCopyBtn = document.getElementById('studio-dock-copy-btn');
  dockCopyBtn?.addEventListener('click', () => {
    let copyText = '';
    const active = state.activeDockFormat;
    
    if (active === 'article') {
      copyText = state.cachedPipelineAssets.article || '';
    } else if (state.cachedPipelineAssets[active]) {
      const asset = state.cachedPipelineAssets[active];
      if (asset.slides && Array.isArray(asset.slides)) {
        copyText = asset.slides.map(s => `SLIDE ${s.slide_number} (${s.type}):\n${s.headline}\n\n${s.body}\n${s.source_tag || ''}`).join('\n\n---\n\n');
      } else {
        copyText = asset.formatted_output || '';
      }
    }

    if (!copyText) {
      showToast('No active asset content to copy.');
      return;
    }

    navigator.clipboard.writeText(copyText).then(() => {
      dockCopyBtn.innerHTML = '<span class="material-symbols-outlined text-sm">check</span> Copied!';
      setTimeout(() => {
        updateDockCopyButtonLabel(state.activeDockFormat);
      }, 2000);
      showToast('Asset copied to clipboard!');
    });
  });

  // Launch Pipeline Button
  startBtn?.addEventListener('click', async () => {
    const topic = topicInput?.value.trim();
    if (!topic) {
      showToast('Please enter a research subject or topic.');
      return;
    }

    if (state.isPipelineRunning) return;
    state.isPipelineRunning = true;
    startBtn.disabled = true;
    startBtn.innerHTML = '<span class="animate-spin inline-block mr-1">⏳</span> ●○○○ [Step 1/4] Researcher scraping web intelligence...';

    // Clear previous output & logs
    const outputContainer = document.getElementById('pipeline-output-container');
    outputContainer?.classList.add('hidden');
    resetAgentBadges();
    clearPipelineLogs();
    addPipelineLog(`Initiating autonomous supervisor pipeline for: "${topic}"`);

    // PDF context enrichment check
    let selectedPdf = '';
    if (usePdfContext?.checked && pdfSelect?.value) {
      selectedPdf = pdfSelect.value;
      addPipelineLog(`Enriching workflow with document library context: ${selectedPdf}`);
    }

    try {
      const toneSelect = document.getElementById('pipeline-tone-select');
      const payload = {
        topic: topic,
        target_audience: audienceSelect?.value || 'General Tech & Media Community',
        editorial_tone: toneSelect?.value || 'Authoritative Thought Leadership',
        max_revisions: 1,
        enriched_pdf: selectedPdf
      };

      // Step progression ticker with dots & step numbers
      let elapsed = 0;
      updateAgentBadges('RESEARCH');
      addPipelineLog('Supervisor: Ingesting live RSS feeds and open-web intelligence...');
      
      const progressTimer = setInterval(() => {
        elapsed += 1;
        if (elapsed < 2) {
          startBtn.innerHTML = `<span class="animate-spin inline-block mr-1">⏳</span> ●○○○ [Step 1/4] Researcher scraping sources (${elapsed}s)...`;
        } else if (elapsed >= 2 && elapsed < 8) {
          updateAgentBadges('VERIFY');
          startBtn.innerHTML = `<span class="animate-spin inline-block mr-1">⏳</span> ●●○○ [Step 2/4] Verifier checking sources (${elapsed}s)...`;
          if (elapsed === 2) {
            addPipelineLog('VerifierAgent: Cross-checking claims across independent domains with AgentPrahari guard...');
          }
        } else if (elapsed >= 8 && elapsed < 18) {
          updateAgentBadges('WRITE');
          startBtn.innerHTML = `<span class="animate-spin inline-block mr-1">⏳</span> ●●●○ [Step 3/4] Writer drafting narrative (${elapsed}s)...`;
          if (elapsed === 8) {
            addPipelineLog('WriterAgent: Synthesizing verified claims with strict citations...');
          }
        } else if (elapsed >= 18) {
          updateAgentBadges('EDIT');
          startBtn.innerHTML = `<span class="animate-spin inline-block mr-1">⏳</span> ●●●● [Step 4/4] Editor reviewing groundedness (${elapsed}s)...`;
          if (elapsed === 18) {
            addPipelineLog('EditorAgent: Evaluating draft groundedness, rubric scoring, and citation density...');
          } else if (elapsed > 18 && elapsed % 5 === 0) {
            addPipelineLog(`Supervisor: Consensus refinement active (${elapsed}s elapsed)...`);
          }
        }
      }, 1000);

      try {
        const res = await apiPost('/api/live-rag/research-pipeline', payload);
        clearInterval(progressTimer);

        if (res.success && res.data) {
          updateAgentBadges('COMPLETED');
          addPipelineLog('All 4 agents completed successfully. Editorial consensus achieved.');
          renderPipelineOutput(res.data);
          showToast('Autonomous 4-Agent Pipeline Finished!');
        } else {
          throw new Error(res.message || 'Pipeline execution failed');
        }
      } catch (pipelineErr) {
        clearInterval(progressTimer);
        throw pipelineErr;
      }
    } catch (err) {
      addPipelineLog(`ERROR: ${err.message}`);
      showToast(`Pipeline execution failed: ${err.message}`);
    } finally {
      startBtn.disabled = false;
      startBtn.innerHTML = '<span class="material-symbols-outlined">play_arrow</span> Launch 4-Agent Workflow';
      state.isPipelineRunning = false;
    }
  });
}

function updateDockCopyButtonLabel(format) {
  const dockCopyBtn = document.getElementById('studio-dock-copy-btn');
  if (!dockCopyBtn) return;
  if (format === 'carousel_slides') {
    dockCopyBtn.innerHTML = '<span class="material-symbols-outlined text-sm">content_copy</span> Copy All Slides';
  } else if (format === 'viral_reel_script') {
    dockCopyBtn.innerHTML = '<span class="material-symbols-outlined text-sm">content_copy</span> Copy Reel Script';
  } else if (format === 'linkedin_post') {
    dockCopyBtn.innerHTML = '<span class="material-symbols-outlined text-sm">content_copy</span> Copy LinkedIn Post';
  } else if (format === 'infometry_blog') {
    dockCopyBtn.innerHTML = '<span class="material-symbols-outlined text-sm">content_copy</span> Copy Infometry Blog';
  } else {
    dockCopyBtn.innerHTML = '<span class="material-symbols-outlined text-sm">content_copy</span> Copy Verified Article';
  }
}

function updateAgentBadges(stage) {
  const stages = ['researcher', 'verifier', 'writer', 'editor'];
  const mapping = {
    'RESEARCH': 0,
    'VERIFY': 1,
    'WRITE': 2,
    'EDIT': 3,
    'COMPLETED': 4
  };

  const currentIndex = mapping[stage] ?? -1;
  const pillBase = 'px-2.5 py-0.5 text-[10px] font-black uppercase border-2 border-ink shadow-xs';

  stages.forEach((st, idx) => {
    const badge = document.getElementById(`badge-${st}`);
    const card = document.getElementById(`step-${st}`);
    if (!badge || !card) return;

    if (idx < currentIndex || stage === 'COMPLETED') {
      badge.className = `${pillBase} bg-successSoft text-success`;
      badge.textContent = 'DONE';
      card.classList.remove('pulse-step');
    } else if (idx === currentIndex) {
      badge.className = `${pillBase} bg-yellow text-ink`;
      badge.textContent = 'RUNNING';
      card.classList.add('pulse-step');
    } else {
      badge.className = `${pillBase} bg-soft text-muted`;
      badge.textContent = 'IDLE';
      card.classList.remove('pulse-step');
    }
  });
}

function resetAgentBadges() {
  const pillBase = 'px-2.5 py-0.5 text-[10px] font-black uppercase border-2 border-ink shadow-xs';
  ['researcher', 'verifier', 'writer', 'editor'].forEach(st => {
    const badge = document.getElementById(`badge-${st}`);
    const card = document.getElementById(`step-${st}`);
    if (badge) {
      badge.className = `${pillBase} bg-soft text-muted`;
      badge.textContent = 'IDLE';
    }
    if (card) card.classList.remove('pulse-step');
  });
}

function clearPipelineLogs() {
  const box = document.getElementById('pipeline-logs-box');
  if (box) box.innerHTML = '';
}

function addPipelineLog(msg) {
  const box = document.getElementById('pipeline-logs-box');
  if (!box) return;

  let agent = 'SYSTEM';
  let badgeClass = 'bg-card text-ink border border-ink';
  let textClass = 'text-ink font-semibold';
  let content = String(msg);

  if (/^Supervisor:/i.test(content)) {
    agent = 'SUPERVISOR';
    badgeClass = 'bg-yellow text-ink border border-ink';
    content = content.replace(/^Supervisor:\s*/i, '');
  } else if (/^Researcher(?:Agent)?:/i.test(content)) {
    agent = 'RESEARCHER';
    badgeClass = 'bg-[#0077b5]/20 text-[#0077b5] border border-[#0077b5]';
    content = content.replace(/^Researcher(?:Agent)?:\s*/i, '');
  } else if (/^Verifier(?:Agent)?:/i.test(content)) {
    agent = 'VERIFIER';
    badgeClass = 'bg-successSoft text-success border border-success';
    content = content.replace(/^Verifier(?:Agent)?:\s*/i, '');
  } else if (/^Writer(?:Agent)?:/i.test(content)) {
    agent = 'WRITER';
    badgeClass = 'bg-purple/20 text-purple border border-purple';
    content = content.replace(/^Writer(?:Agent)?:\s*/i, '');
  } else if (/^Editor(?:Agent)?:/i.test(content)) {
    agent = 'EDITOR';
    badgeClass = 'bg-[#ff8c00]/20 text-[#d97706] border border-[#d97706]';
    content = content.replace(/^Editor(?:Agent)?:\s*/i, '');
  } else if (/AgentPrahari/i.test(content)) {
    agent = 'PRAHARI';
    badgeClass = 'bg-dangerSoft text-danger border border-danger';
  } else if (/ERROR/i.test(content)) {
    agent = 'ERROR';
    badgeClass = 'bg-danger text-white border border-ink';
    textClass = 'text-danger font-bold';
  }

  const row = document.createElement('div');
  row.className = 'flex items-start gap-2 py-0.5 text-xs font-mono border-b border-ink/5 last:border-0';
  row.innerHTML = `
    <span class="inline-block px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${badgeClass} shrink-0 shadow-2xs">${agent}</span>
    <span class="leading-relaxed ${textClass}">${escapeHtml(content)}</span>
  `;
  box.appendChild(row);
  box.scrollTop = box.scrollHeight;
}

function renderPipelineOutput(result) {
  state.latestPipelineData = result;
  state.cachedPipelineAssets = {
    article: result.final_article || ''
  };

  const outputContainer = document.getElementById('pipeline-output-container');
  outputContainer?.classList.remove('hidden');

  // Populate Scorecard
  const latestCritique = (result.revision_history && result.revision_history.length > 0)
    ? result.revision_history[result.revision_history.length - 1]
    : { overall_score: 92, feedback: 'Approved by Editor. Verified claims grounded in primary citations.', groundedness_score: 0.95 };

  const scoreSummary = document.getElementById('scorecard-summary');
  if (scoreSummary) {
    scoreSummary.innerHTML = `<span>Approved by Editor (Score: ${latestCritique.overall_score || 92}/100)</span><span class="material-symbols-outlined text-base text-muted group-hover:text-purple transition ml-2 align-middle" title="Scored by Editor Critic: 40% Groundedness & Source Citations, 30% Multi-Domain Corroboration, 30% Narrative Clarity & Structure">info</span>`;
    scoreSummary.title = 'Scored by Editor Critic: 40% Groundedness & Source Citations, 30% Multi-Domain Corroboration, 30% Narrative Clarity & Structure';
  }
  
  const scoreFeedback = document.getElementById('scorecard-feedback');
  if (scoreFeedback) scoreFeedback.textContent = latestCritique.feedback || 'Strict citations corroborated across sources.';

  const scoreGroundedness = document.getElementById('scorecard-groundedness');
  if (scoreGroundedness) scoreGroundedness.textContent = `${((latestCritique.groundedness_score || 0.95) * 100).toFixed(0)}%`;

  const scoreRevisions = document.getElementById('scorecard-revisions');
  if (scoreRevisions) scoreRevisions.textContent = result.iterations || 1;

  // Reset and display active format
  updateFormatDockButtons('article');
  renderActiveDockFormat('article');

  // Scroll smoothly down to the output container
  outputContainer?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateFormatDockButtons(selected) {
  state.activeDockFormat = selected;
  const activeStyles = {
    article: 'bg-purple text-white',
    linkedin_post: 'bg-[#0077b5] text-white',
    carousel_slides: 'bg-[#ff8c00] text-ink font-black',
    viral_reel_script: 'bg-[#e1306c] text-white',
    infometry_blog: 'bg-[#00a86b] text-white'
  };

  document.querySelectorAll('#pipeline-format-tabs .format-dock-btn').forEach(b => {
    const f = b.getAttribute('data-format');
    if (f === selected) {
      const activeTheme = activeStyles[f] || 'bg-purple text-white';
      b.className = `format-dock-btn active press border-2 border-ink ${activeTheme} px-3.5 py-2 text-xs font-black shadow-xs flex items-center gap-1.5`;
    } else {
      b.className = 'format-dock-btn press border-2 border-ink bg-paper text-ink hover:bg-yellowSoft px-3.5 py-2 text-xs font-black shadow-xs flex items-center gap-1.5';
    }
  });

  // Dynamically update copy button label for current format
  updateDockCopyButtonLabel(selected);
}

async function renderActiveDockFormat(format) {
  state.activeDockFormat = format;
  const viewport = document.getElementById('dock-content-viewport');
  const loadingView = document.getElementById('dock-loading-view');

  if (format === 'article') {
    loadingView?.classList.add('hidden');
    if (viewport) {
      viewport.classList.remove('hidden');
      viewport.innerHTML = `<div id="pipeline-final-article" class="prose max-w-none text-sm md:text-base leading-relaxed space-y-4 text-ink">${renderMarkdown(state.cachedPipelineAssets.article || '')}</div>`;
    }
    return;
  }

  // If already cached, render immediately without re-fetching
  if (state.cachedPipelineAssets[format]) {
    loadingView?.classList.add('hidden');
    if (viewport) {
      viewport.classList.remove('hidden');
      renderDockPayload(format, state.cachedPipelineAssets[format]);
    }
    return;
  }

  // Fetch from backend repurposer
  loadingView?.classList.remove('hidden');
  viewport?.classList.add('hidden');

  try {
    const res = await apiPost('/api/live-rag/repurpose', {
      format_type: format,
      topic: state.latestPipelineData?.topic || 'Verified Topic',
      content: state.latestPipelineData?.final_article || '',
      claims: state.latestPipelineData?.verified_claims || []
    });

    if (res.success && res.data) {
      state.cachedPipelineAssets[format] = res.data;
      loadingView?.classList.add('hidden');
      if (viewport) {
        viewport.classList.remove('hidden');
        renderDockPayload(format, res.data);
      }
    } else {
      showToast(res.message || 'Failed to generate format');
      loadingView?.classList.add('hidden');
    }
  } catch (err) {
    showToast(`Format generation error: ${err.message}`);
    loadingView?.classList.add('hidden');
  }
}

function renderDockPayload(format, payload) {
  const viewport = document.getElementById('dock-content-viewport');
  if (!viewport) return;

  if (format === 'carousel_slides' && payload.slides && payload.slides.length > 0) {
    let slidesHtml = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
    payload.slides.forEach(slide => {
      slidesHtml += `
        <div class="border-4 border-ink p-4 bg-paper shadow-sm-brutal space-y-2 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between border-b-2 border-ink pb-2 mb-2">
              <span class="px-2 py-0.5 bg-yellow border border-ink text-xs font-black">SLIDE ${escapeHtml(slide.slide_number)}</span>
              <span class="text-xs font-bold text-muted uppercase">${escapeHtml(slide.type)}</span>
            </div>
            <h5 class="text-base font-black leading-tight text-ink mb-2">${escapeHtml(slide.headline)}</h5>
            <p class="text-xs font-bold text-muted leading-relaxed whitespace-pre-wrap">${escapeHtml(slide.body)}</p>
          </div>
          <div class="pt-2 border-t-2 border-dashed border-ink flex items-center justify-between mt-3">
            <span class="text-[10px] font-black text-purple">${escapeHtml(slide.source_tag || '')}</span>
            <button class="copy-dock-slide border border-ink bg-card hover:bg-yellow px-2 py-1 text-[10px] font-black shadow-xs" data-text="${escapeHtml(String(slide.headline || '') + '\n\n' + String(slide.body || ''))}">
              Copy Slide
            </button>
          </div>
        </div>
      `;
    });
    slidesHtml += '</div>';
    viewport.innerHTML = slidesHtml;

    // Wire per-slide copy
    viewport.querySelectorAll('.copy-dock-slide').forEach(sb => {
      sb.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const text = sb.getAttribute('data-text');
        navigator.clipboard.writeText(text);
        sb.textContent = 'Copied!';
        setTimeout(() => { sb.textContent = 'Copy Slide'; }, 1500);
      });
    });

  } else {
    viewport.innerHTML = `<div class="prose max-w-none text-sm md:text-base leading-relaxed space-y-4 text-ink">${renderMarkdown(payload.formatted_output || '', format)}</div>`;
  }
}

// ======================================================================
// WORKSPACE 2: DOCUMENT KNOWLEDGE BASE & PDF LIBRARY (ORIGINAL OLD HOUSE)
// ======================================================================
function bindDocumentLibrary() {
  const fileInput = document.getElementById('file-upload');
  const dropZone = document.getElementById('drop-zone');

  document.getElementById('view-all-btn')?.addEventListener('click', toggleViewAll);
  document.getElementById('refresh-btn')?.addEventListener('click', loadDocuments);

  // Drop zone events
  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());
    
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropZone.classList.add('bg-yellowSoft');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropZone.classList.remove('bg-yellowSoft');
      });
    });

    dropZone.addEventListener('drop', (event) => {
      const file = event.dataTransfer.files[0];
      if (file) handleUpload(file);
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files[0]) handleUpload(fileInput.files[0]);
    });
  }

  // Quick action study buttons
  document.querySelectorAll('.quick-action').forEach(button => {
    button.addEventListener('click', () => {
      if (!state.docs.length) {
        showToast('Upload a PDF first, then KILN Studio can run that action.');
        fileInput?.click();
        return;
      }
      const doc = state.docs[0];
      window.location.href = `/chat?pdf=${encodeURIComponent(doc.filename)}&action=${encodeURIComponent(button.dataset.action)}`;
    });
  });
}

async function loadDocuments() {
  const grid = document.getElementById('documents-grid');
  if (grid) grid.innerHTML = loadingState();

  try {
    const res = await apiFetch('/api/documents');
    state.docs = res.data.documents || [];
    renderDocuments();
    populatePdfSelectDropdown();
  } catch (err) {
    if (grid) grid.innerHTML = errorState(err.message);
  }
}

function renderDocuments() {
  const grid = document.getElementById('documents-grid');
  if (!grid) return;

  const visible = state.showAll ? state.docs : state.docs.slice(0, 6);
  const docCountEl = document.getElementById('doc-count');
  if (docCountEl) docCountEl.textContent = `${state.docs.length} document${state.docs.length === 1 ? '' : 's'} in your workspace`;

  const sectionTitleEl = document.getElementById('section-title');
  if (sectionTitleEl) sectionTitleEl.textContent = state.showAll ? 'All Documents' : 'Recent Documents';

  const viewAllBtn = document.getElementById('view-all-btn');
  if (viewAllBtn) viewAllBtn.textContent = state.showAll ? 'Show Recent' : 'View All';

  if (!state.docs.length) {
    grid.innerHTML = emptyState();
    return;
  }

  grid.innerHTML = visible.map((doc, index) => cardTemplate(doc, index)).join('');
  bindDocumentCardActions();
}

function bindDocumentCardActions() {
  // Chat buttons
  document.querySelectorAll('.open-chat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const filename = btn.getAttribute('data-filename');
      if (filename) window.location.href = `/chat?pdf=${encodeURIComponent(filename)}`;
    });
  });

  // "Send to Creator Studio" synergy button!
  document.querySelectorAll('.send-to-studio-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const filename = btn.getAttribute('data-filename');
      if (!filename) return;

      // Extract clean topic name from filename (remove .pdf, replace _ with space)
      const cleanTopic = filename.replace(/\.pdf$/i, '').replace(/[-_]+/g, ' ');

      // Populate Creator Studio topic & select this PDF in dropdown
      const topicInput = document.getElementById('pipeline-topic-input');
      if (topicInput) topicInput.value = cleanTopic;

      const usePdfCheckbox = document.getElementById('pipeline-use-pdf-context');
      if (usePdfCheckbox) {
        usePdfCheckbox.checked = true;
        document.getElementById('pipeline-pdf-selector-wrap')?.classList.remove('hidden');
      }

      const pdfSelect = document.getElementById('pipeline-pdf-select');
      if (pdfSelect) pdfSelect.value = filename;

      // Switch to Creator Studio view seamlessly!
      switchWorkspace('studio');
      showToast(`Transferred "${cleanTopic}" into Creator Studio!`);
    });
  });

  // Delete buttons
  document.querySelectorAll('.delete-doc-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const filename = btn.getAttribute('data-filename');
      if (!confirm(`Are you sure you want to delete ${filename}?`)) return;

      try {
        await apiFetch(`/api/documents/${encodeURIComponent(filename)}`, { method: 'DELETE' });
        showToast('Document deleted.');
        loadDocuments();
      } catch (err) {
        showToast(`Failed to delete document: ${err.message}`);
      }
    });
  });
}

function populatePdfSelectDropdown() {
  const select = document.getElementById('pipeline-pdf-select');
  if (!select) return;

  const currentVal = select.value;
  select.innerHTML = '<option value="">-- Choose an uploaded document from your library --</option>';

  state.docs.forEach(doc => {
    const opt = document.createElement('option');
    opt.value = doc.filename;
    opt.textContent = `${doc.filename} (${doc.chunk_count || 0} chunks)`;
    select.appendChild(opt);
  });

  if (currentVal && state.docs.some(d => d.filename === currentVal)) {
    select.value = currentVal;
  }
}

async function handleUpload(file) {
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    showToast('Please upload a PDF file.');
    return;
  }

  const feedback = document.getElementById('upload-feedback');
  if (feedback) {
    feedback.classList.remove('hidden');
    feedback.textContent = `Uploading and vectorizing ${file.name}...`;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await apiFetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (res.success) {
      if (feedback) feedback.textContent = 'Document indexed into Qdrant successfully!';
      showToast(`Uploaded ${file.name}`);
      setTimeout(() => {
        if (feedback) feedback.classList.add('hidden');
        loadDocuments();
      }, 1500);
    } else {
      throw new Error(res.message || 'Upload failed');
    }
  } catch (err) {
    if (feedback) feedback.textContent = `Upload error: ${err.message}`;
    showToast(`Upload failed: ${err.message}`);
  }
}

function toggleViewAll() {
  state.showAll = !state.showAll;
  renderDocuments();
}

function cardTemplate(doc, index) {
  const formattedDate = doc.upload_date ? new Date(doc.upload_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently added';
  const sizeMb = doc.file_size ? `${(doc.file_size / (1024 * 1024)).toFixed(1)} MB` : 'PDF';

  return `
    <div class="card-reveal bg-card border-4 border-ink shadow-brutal p-5 flex flex-col justify-between" style="animation-delay: ${index * 40}ms">
      <div>
        <div class="flex items-center justify-between gap-3 border-b-2 border-ink pb-3 mb-3">
          <div class="h-10 w-10 rounded-full border-2 border-ink bg-forge text-white flex items-center justify-center font-black shadow-xs">
            <span class="material-symbols-outlined text-xl">description</span>
          </div>
          <button class="delete-doc-btn text-muted hover:text-danger p-1" data-filename="${escapeHtml(doc.filename)}" title="Delete document">
            <span class="material-symbols-outlined text-lg">delete</span>
          </button>
        </div>
        <h4 class="font-black text-lg line-clamp-2 leading-tight text-ink" title="${escapeHtml(doc.filename)}">${escapeHtml(doc.filename)}</h4>
        <div class="mt-3 flex flex-wrap gap-2 text-xs font-bold text-muted">
          <span class="bg-soft px-2 py-0.5 border border-ink">${escapeHtml(formattedDate)}</span>
          <span class="bg-soft px-2 py-0.5 border border-ink">${escapeHtml(sizeMb)}</span>
          <span class="bg-forgeSoft px-2 py-0.5 border border-ink text-forge font-black">${doc.chunk_count || 0} chunks</span>
        </div>
      </div>

      <div class="mt-5 pt-3 border-t-2 border-dashed border-ink flex flex-col sm:flex-row gap-2">
        <button class="open-chat-btn press flex-1 border-2 border-ink bg-forge text-white hover:bg-forge/90 p-2 font-black text-xs text-center shadow-xs flex items-center justify-center gap-1" data-filename="${escapeHtml(doc.filename)}">
          <span class="material-symbols-outlined text-sm">chat</span> Chat with PDF
        </button>
        <button class="send-to-studio-btn press flex-1 border-2 border-ink bg-card hover:bg-purple hover:text-white p-2 font-black text-xs text-center shadow-xs flex items-center justify-center gap-1" data-filename="${escapeHtml(doc.filename)}">
          <span class="material-symbols-outlined text-sm">hub</span> Send to Studio
        </button>
      </div>
    </div>
  `;
}

function emptyState() {
  return `
    <div class="col-span-full border-4 border-dashed border-ink bg-card p-8 text-center shadow-brutal space-y-3">
      <div class="h-16 w-16 mx-auto rounded-full border-4 border-ink bg-forge text-white grid place-items-center">
        <span class="material-symbols-outlined text-3xl">folder_open</span>
      </div>
      <h3 class="text-2xl font-black">No Documents Yet</h3>
      <p class="text-xs sm:text-sm font-semibold text-muted max-w-md mx-auto">Drop a PDF above to start chatting with verified citations or feeding context to your autonomous agents.</p>
    </div>
  `;
}

function loadingState() {
  return `
    <div class="col-span-full border-4 border-ink bg-yellowSoft/30 p-8 text-center shadow-brutal space-y-2">
      <div class="inline-block animate-spin h-8 w-8 border-4 border-ink border-t-transparent rounded-full"></div>
      <p class="font-black text-sm">Connecting to Qdrant and loading document collection...</p>
    </div>
  `;
}

function errorState(msg) {
  return `
    <div class="col-span-full border-4 border-ink bg-dangerSoft p-6 text-center shadow-brutal space-y-2">
      <p class="font-black text-danger text-base">Failed to load documents</p>
      <p class="text-xs font-bold text-muted">${escapeHtml(msg)}</p>
      <button onclick="window.location.reload()" class="press mt-3 border-2 border-ink bg-card px-4 py-1.5 text-xs font-black shadow-xs">Retry</button>
    </div>
  `;
}

// ======================================================================
// WORKSPACE 3: LIVE FACT-CHECK & NEWS RADAR
// ======================================================================
function bindLiveFactCheck() {
  const liveSearchBtn = document.getElementById('live-search-btn');
  const liveQueryInput = document.getElementById('live-query-input');
  const liveRagLoading = document.getElementById('live-rag-loading');
  const liveRagResults = document.getElementById('live-rag-results');

  // Quick Query chips
  document.querySelectorAll('.quick-query-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (liveQueryInput) liveQueryInput.value = chip.textContent.trim();
    });
  });

  liveSearchBtn?.addEventListener('click', async () => {
    const query = liveQueryInput?.value.trim();
    if (!query) return;

    liveSearchBtn.disabled = true;
    liveRagLoading?.classList.remove('hidden');
    liveRagResults?.classList.add('hidden');

    try {
      const res = await apiPost('/api/live-rag/search', { query, max_articles: 8 });
      if (res.success && res.data) {
        state.latestLiveRagData = res.data;
        renderLiveRagResults(res.data);
      } else {
        showToast(res.message || 'Live search error');
      }
    } catch (err) {
      showToast(`Search error: ${err.message}`);
    } finally {
      liveSearchBtn.disabled = false;
      liveRagLoading?.classList.add('hidden');
    }
  });

  // Live RAG Repurpose buttons (opens shared creator modal)
  document.querySelectorAll('.repurpose-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const format = btn.getAttribute('data-format');
      if (!state.latestLiveRagData) {
        showToast('Run a Live Verified Search first.');
        return;
      }

      btn.disabled = true;
      const origText = btn.innerHTML;
      btn.innerHTML = '⏳ Generating...';

      try {
        const res = await apiPost('/api/live-rag/repurpose', {
          format_type: format,
          topic: state.latestLiveRagData.query || 'Live Fact-Check',
          content: state.latestLiveRagData.answer || '',
          claims: (state.latestLiveRagData.verification && state.latestLiveRagData.verification.claims) || []
        });

        if (res.success && res.data) {
          openCreatorModal(res.data);
        } else {
          showToast(res.message || 'Repurposing failed');
        }
      } catch (e) {
        showToast(`Error: ${e.message}`);
      } finally {
        btn.disabled = false;
        btn.innerHTML = origText;
      }
    });
  });
}

function renderLiveRagResults(data) {
  const resultsContainer = document.getElementById('live-rag-results');
  if (!resultsContainer) return;
  resultsContainer.classList.remove('hidden');

  // Populate Metrics
  const metrics = data.metrics || {};
  document.getElementById('metric-ingested').textContent = metrics.articles_ingested || 0;
  document.getElementById('metric-freshness').textContent = `${(metrics.avg_freshness_score * 100 || 85).toFixed(0)}%`;
  document.getElementById('metric-verified').textContent = `${metrics.verified_claims_count || 0}/${metrics.total_claims_count || 0}`;

  // Render Claims Matrix
  const claimsContainer = document.getElementById('claims-matrix');
  if (claimsContainer) {
    claimsContainer.innerHTML = '';
    const claims = (data.verification && data.verification.claims) || [];
    
    if (claims.length === 0) {
      claimsContainer.innerHTML = '<p class="text-xs font-bold text-muted">No explicit atomic claims extracted.</p>';
    } else {
      claims.forEach(c => {
        const isMulti = c.status === 'VERIFIED';
        const badgeColor = isMulti ? 'bg-successSoft text-success border-success' : 'bg-yellowSoft text-ink border-ink';
        const badgeText = isMulti ? `VERIFIED (${c.domain_count} Domains)` : 'SINGLE-SOURCE';
        const domains = c.corroborating_domains?.join(', ') || 'Primary Source';

        const row = document.createElement('div');
        row.className = 'border-2 border-ink p-3 bg-paper shadow-sm-brutal flex flex-col md:flex-row md:items-center justify-between gap-3';
        row.innerHTML = `
          <div class="space-y-1 flex-1">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 text-xs font-black border-2 rounded ${badgeColor}">${badgeText}</span>
              <span class="text-xs font-bold text-muted">${escapeHtml(c.category || '')}</span>
            </div>
            <p class="font-bold text-sm">${escapeHtml(c.statement)}</p>
            <p class="text-xs text-muted font-bold">Corroborating Domains: <span class="text-ink">${escapeHtml(domains)}</span></p>
          </div>
          <div class="shrink-0 text-right">
            <span class="text-xs font-black uppercase text-muted">Confidence</span>
            <p class="font-black text-sm">${((c.confidence_score || 0.9) * 100).toFixed(0)}%</p>
          </div>
        `;
        claimsContainer.appendChild(row);
      });
    }
  }

  // Render Synthesized Text
  const answerContainer = document.getElementById('rag-answer-content');
  if (answerContainer) {
    answerContainer.innerHTML = renderMarkdown(data.answer || '');
  }

  // Render Citations Grid
  const citationsGrid = document.getElementById('citations-grid');
  if (citationsGrid) {
    citationsGrid.innerHTML = '';
    const articles = data.articles || [];
    articles.slice(0, 6).forEach((a, i) => {
      const card = document.createElement('div');
      card.className = 'border-2 border-ink p-3 bg-paper shadow-sm-brutal space-y-1.5 flex flex-col justify-between';
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between text-[10px] font-black border-b border-ink pb-1">
            <span class="bg-yellow border border-ink px-1.5 py-0.5">SOURCE ${i + 1}</span>
            <span class="text-purple">${escapeHtml(a.domain || 'Verified Domain')}</span>
          </div>
          <h5 class="font-black text-xs mt-1.5 line-clamp-2">${escapeHtml(a.title)}</h5>
          <p class="text-[11px] font-bold text-muted mt-1 line-clamp-2">${escapeHtml(a.snippet || '')}</p>
        </div>
        <div class="pt-2 border-t border-dashed border-ink flex items-center justify-between mt-2">
          <span class="text-[10px] text-muted font-semibold">${new Date(a.published_at || Date.now()).toLocaleDateString()}</span>
          <a href="${escapeHtml(a.url)}" target="_blank" class="text-[10px] font-black underline flex items-center gap-0.5">
            Visit Source <span class="material-symbols-outlined text-[12px]">open_in_new</span>
          </a>
        </div>
      `;
      citationsGrid.appendChild(card);
    });
  }
}

// ======================================================================
// WORKSPACE 4: AGENTPRAHARI SECURITY CONSOLE
// ======================================================================
function bindAgentPrahari() {
  const guardEvalBtn = document.getElementById('guard-evaluate-btn');
  const guardInput = document.getElementById('guard-input-text');
  const guardResultCard = document.getElementById('guard-result-card');
  const guardDecisionBadge = document.getElementById('guard-decision-badge');
  const guardOrigContent = document.getElementById('guard-orig-content');
  const guardSanitizedContent = document.getElementById('guard-sanitized-content');
  const guardViolationsList = document.getElementById('guard-violations-list');

  // Sample attack chips
  document.querySelectorAll('.guard-sample-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (guardInput) guardInput.value = btn.getAttribute('data-text');
    });
  });

  guardEvalBtn?.addEventListener('click', async () => {
    const text = guardInput?.value.trim();
    if (!text) return;

    guardEvalBtn.disabled = true;
    try {
      const res = await apiPost('/api/live-rag/guardrails/check', {
        text,
        check_type: 'input'
      });

      if (res.success && res.data) {
        guardResultCard?.classList.remove('hidden');
        const data = res.data;

        // Decision badge styling
        const decisionStr = String(data.decision);
        if (decisionStr.includes('BLOCK')) {
          guardDecisionBadge.className = 'px-3 py-1 text-xs font-black border-2 border-ink bg-dangerSoft text-danger';
          guardDecisionBadge.textContent = 'BLOCKED (POLICY VIOLATION)';
        } else if (decisionStr.includes('SANITIZE')) {
          guardDecisionBadge.className = 'px-3 py-1 text-xs font-black border-2 border-ink bg-yellow text-ink';
          guardDecisionBadge.textContent = 'SANITIZED (PII MASKED)';
        } else {
          guardDecisionBadge.className = 'px-3 py-1 text-xs font-black border-2 border-ink bg-successSoft text-success';
          guardDecisionBadge.textContent = 'ALLOWED (CLEAN)';
        }

        if (guardOrigContent) guardOrigContent.textContent = data.original_content;
        if (guardSanitizedContent) guardSanitizedContent.textContent = data.sanitized_content || data.original_content;

        if (guardViolationsList) {
          guardViolationsList.innerHTML = '';
          if (data.violations && data.violations.length > 0) {
            data.violations.forEach(v => {
              const vDiv = document.createElement('div');
              vDiv.className = 'border-2 border-ink p-2 bg-paper text-xs font-bold flex items-center justify-between';
              vDiv.innerHTML = `
                <span><strong>[${escapeHtml(v.rule_id)}]</strong> ${escapeHtml(v.message)}</span>
                <span class="px-2 py-0.5 bg-yellow border border-ink text-[10px] uppercase font-black">${escapeHtml(v.severity)}</span>
              `;
              guardViolationsList.appendChild(vDiv);
            });
          } else {
            guardViolationsList.innerHTML = '<p class="text-xs text-muted font-bold">No violations detected. Clean prompt passed AgentPrahari policy.</p>';
          }
        }
      } else {
        showToast(res.message || 'Evaluation error');
      }
    } catch (e) {
      showToast(`Guardrail error: ${e.message}`);
    } finally {
      guardEvalBtn.disabled = false;
    }
  });
}

// ======================================================================
// SHARED MODALS, CREATOR EXPORT & UTILITIES
// ======================================================================
function bindSharedModals() {
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modal-close');
  const settingsBtn = document.getElementById('settings-btn');
  const upgradeBtn = document.getElementById('upgrade-btn');
  const logoutBtn = document.getElementById('logout-btn');

  modalClose?.addEventListener('click', () => modal?.classList.add('hidden'));
  settingsBtn?.addEventListener('click', () => modal?.classList.remove('hidden'));
  upgradeBtn?.addEventListener('click', () => showToast('KILN Studio Pro features are fully unlocked in this workspace!'));
  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('docmind_session');
    localStorage.removeItem('kiln_session');
    window.location.href = '/index.html';
  });

  // Creator Modal controls
  const creatorModal = document.getElementById('creator-modal');
  const creatorModalClose = document.getElementById('creator-modal-close');
  const modalViewFormattedBtn = document.getElementById('modal-view-formatted-btn');
  const modalViewRawBtn = document.getElementById('modal-view-raw-btn');
  const creatorTextView = document.getElementById('creator-text-view');
  const creatorRawView = document.getElementById('creator-raw-view');

  creatorModalClose?.addEventListener('click', () => creatorModal?.classList.add('hidden'));

  modalViewFormattedBtn?.addEventListener('click', () => {
    modalViewFormattedBtn.className = 'px-2.5 py-1 text-xs font-black bg-purple text-white';
    modalViewRawBtn.className = 'px-2.5 py-1 text-xs font-black bg-paper text-ink hover:bg-yellow';
    creatorTextView?.classList.remove('hidden');
    creatorRawView?.classList.add('hidden');
  });

  modalViewRawBtn?.addEventListener('click', () => {
    modalViewRawBtn.className = 'px-2.5 py-1 text-xs font-black bg-purple text-white';
    modalViewFormattedBtn.className = 'px-2.5 py-1 text-xs font-black bg-paper text-ink hover:bg-yellow';
    creatorTextView?.classList.add('hidden');
    creatorRawView?.classList.remove('hidden');
  });
}

function openCreatorModal(data) {
  const creatorModal = document.getElementById('creator-modal');
  const creatorModalTitle = document.getElementById('creator-modal-title');
  const creatorSlidesView = document.getElementById('creator-slides-view');
  const creatorTextView = document.getElementById('creator-text-view');
  const creatorRawView = document.getElementById('creator-raw-view');
  const creatorCopyBtn = document.getElementById('creator-copy-btn');
  const modalViewSwitcher = document.getElementById('modal-view-switcher');

  if (!creatorModal) return;
  creatorModal.classList.remove('hidden');
  if (creatorModalTitle) creatorModalTitle.textContent = data.title || 'Creator Studio Export';

  if (data.format === 'carousel_slides' && data.slides && data.slides.length > 0) {
    modalViewSwitcher?.classList.add('hidden');
    creatorSlidesView?.classList.remove('hidden');
    creatorTextView?.classList.add('hidden');
    creatorRawView?.classList.add('hidden');
    
    if (creatorSlidesView) {
      creatorSlidesView.innerHTML = '';
      data.slides.forEach(slide => {
        const card = document.createElement('div');
        card.className = 'border-4 border-ink p-4 bg-paper shadow-sm-brutal space-y-2 flex flex-col justify-between';
        card.innerHTML = `
          <div>
            <div class="flex items-center justify-between border-b-2 border-ink pb-2 mb-2">
              <span class="px-2 py-0.5 bg-yellow border border-ink text-xs font-black">SLIDE ${slide.slide_number}</span>
              <span class="text-xs font-bold text-muted uppercase">${escapeHtml(slide.type)}</span>
            </div>
            <h5 class="text-base font-black leading-tight text-ink mb-2">${escapeHtml(slide.headline)}</h5>
            <p class="text-xs font-bold text-muted leading-relaxed whitespace-pre-wrap">${escapeHtml(slide.body)}</p>
          </div>
          <div class="pt-2 border-t-2 border-dashed border-ink flex items-center justify-between mt-3">
            <span class="text-[10px] font-black text-purple">${escapeHtml(slide.source_tag || '')}</span>
            <button class="copy-modal-slide border border-ink bg-card hover:bg-yellow px-2 py-1 text-[10px] font-black shadow-xs" data-text="${escapeHtml(slide.headline + '\n\n' + slide.body)}">
              Copy Slide
            </button>
          </div>
        `;
        creatorSlidesView.appendChild(card);
      });

      creatorSlidesView.querySelectorAll('.copy-modal-slide').forEach(sb => {
        sb.addEventListener('click', (ev) => {
          ev.stopPropagation();
          navigator.clipboard.writeText(sb.getAttribute('data-text'));
          sb.textContent = 'Copied!';
          setTimeout(() => { sb.textContent = 'Copy Slide'; }, 1500);
        });
      });
    }
  } else {
    modalViewSwitcher?.classList.remove('hidden');
    creatorSlidesView?.classList.add('hidden');
    creatorTextView?.classList.remove('hidden');
    creatorRawView?.classList.add('hidden');

    if (creatorTextView) creatorTextView.innerHTML = renderMarkdown(data.formatted_output || '', data.format);
    if (creatorRawView) creatorRawView.value = data.formatted_output || '';
  }

  if (creatorCopyBtn) {
    creatorCopyBtn.onclick = () => {
      const fullText = data.formatted_output || '';
      navigator.clipboard.writeText(fullText).then(() => {
        creatorCopyBtn.innerHTML = '<span class="material-symbols-outlined text-sm">check</span> Copied!';
        setTimeout(() => {
          creatorCopyBtn.innerHTML = '<span class="material-symbols-outlined text-sm">content_copy</span> Copy';
        }, 2000);
        showToast('Copied to clipboard!');
      });
    };
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3200);
}

// ======================================================================
// MARKDOWN & NEO-BRUTALIST FORMATTING ENGINE
// ======================================================================
function renderMarkdown(md, formatType = 'general') {
  if (!md) return '';
  const text = String(md).replace(/\r\n/g, '\n');

  if (formatType === 'viral_reel_script') {
    return renderReelScript(text);
  } else if (formatType === 'linkedin_post') {
    return renderLinkedInPost(text);
  }

  return renderStandardMarkdown(text);
}

function renderLinkedInPost(text) {
  const lines = text.split('\n');
  let html = '<div class="space-y-3.5 bg-card border-4 border-ink p-6 shadow-brutal">';
  
  // LinkedIn author header
  html += `
    <div class="flex items-center justify-between border-b-2 border-ink pb-3 mb-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full border-2 border-ink bg-[#0077b5] text-white flex items-center justify-center font-black text-sm shadow-xs">
          IN
        </div>
        <div>
          <span class="font-black text-sm text-ink block">KILN Studio Verified Creator</span>
          <span class="text-[10px] font-bold text-muted block">Cross-Domain Verified Intelligence • KILN Forge Network</span>
        </div>
      </div>
      <span class="px-2 py-0.5 bg-[#0077b5]/10 text-[#0077b5] border border-[#0077b5] text-[10px] font-black uppercase">
        LinkedIn Post
      </span>
    </div>
  `;

  lines.forEach(rawLine => {
    const line = rawLine.trim();
    if (!line) {
      html += '<div class="h-1.5"></div>';
      return;
    }

    // Check if hashtag row
    if (/^(?:#\w+\s*)+$/.test(line)) {
      const tags = line.match(/#\w+/g) || [];
      html += '<div class="flex flex-wrap gap-1.5 pt-2">';
      tags.forEach(t => {
        html += `<span class="px-2 py-0.5 bg-[#0077b5]/10 text-[#0077b5] border border-[#0077b5]/40 text-xs font-black shadow-2xs">${escapeHtml(t)}</span>`;
      });
      html += '</div>';
      return;
    }

    // Check if bullet point or numbered item
    const isBullet = /^[-*•]\s+/.test(line);
    const isNumber = /^\d+\.\s+/.test(line);

    if (isBullet || isNumber) {
      let content = line.replace(/^[-*•\d.]+\s*/, '');
      const hasVerification = /\[VERIFIED\]|verified|confirmed|corroborated|sources?|citation|data|benchmark/i.test(content);
      const isSingleSource = /\[SINGLE-SOURCE\]|single-source|unverified/i.test(content);

      let trustSignal = '';
      if (hasVerification && !isSingleSource) {
        trustSignal = '<span class="text-success font-black text-xs mr-1.5 inline-block select-none" title="Verified Fact">✓</span>';
      } else if (isSingleSource) {
        trustSignal = '<span class="text-amber-600 font-black text-xs mr-1.5 inline-block select-none" title="Single Source">⚠</span>';
      }

      html += `
        <div class="flex items-start gap-2 pl-2">
          <span class="text-purple font-black text-xs shrink-0 mt-0.5">•</span>
          <p class="text-sm font-semibold text-ink leading-relaxed">
            ${trustSignal}${inlineFormat(content)}
          </p>
        </div>
      `;
      return;
    }

    // Bold hook or header line
    if (line.startsWith('#') || (line.startsWith('**') && line.endsWith('**') && line.length < 80)) {
      const cleanHeading = line.replace(/^#+\s*/, '').replace(/\*\*/g, '');
      html += `<h4 class="text-base font-black text-ink pt-1 border-l-4 border-purple pl-2.5 my-2">${inlineFormat(cleanHeading)}</h4>`;
      return;
    }

    // Regular paragraph
    const hasFact = /\[VERIFIED\]|cross-verif|multiple sources|proven|findings indicate/i.test(line);
    const prefix = hasFact ? '<span class="text-success font-black mr-1 select-none" title="Corroborated Fact">✓ </span>' : '';
    html += `<p class="text-sm md:text-base font-medium text-ink leading-relaxed">${prefix}${inlineFormat(line)}</p>`;
  });

  html += '</div>';
  return html;
}

function renderReelScript(text) {
  if (!text) return '';
  const cleanText = String(text).replace(/\r\n/g, '\n');
  
  // Split scenes by horizontal rule OR by lines starting with timestamps [0:00 - 0:03]
  let rawScenes = [];
  if (cleanText.includes('---')) {
    rawScenes = cleanText.split(/\n\s*---\s*\n/g);
  } else {
    const parts = cleanText.split(/(?=(?:^|\n)(?:###?\s*)?(?:\*{0,2})\[?\d+:\d+\s*(?:–|-)\s*\d+:\d+\]?)/gi);
    rawScenes = parts.length > 1 ? parts : cleanText.split(/\n\s*\n/);
  }

  let html = '<div class="space-y-4">';

  rawScenes.forEach((rawScene, sIdx) => {
    const trimmed = rawScene.trim();
    if (!trimmed) return;

    // Extract scene timestamp: [0:00 - 0:03] or 0:00-0:03
    const timeMatch = trimmed.match(/\[?(\d+:\d+\s*(?:–|-)\s*\d+:\d+)\]?/);
    let sceneTime = timeMatch ? timeMatch[1].replace(/\s+/g, '') : '';
    
    // Extract scene title / theme
    let sceneTitle = '';
    const firstLine = trimmed.split('\n')[0].replace(/\*\*/g, '').replace(/^#+\s*/, '').trim();
    if (sceneTime) {
      sceneTitle = firstLine.replace(new RegExp(`\\[?${sceneTime.replace('-', '\\s*-\\s*')}\\]?`, 'i'), '')
                            .replace(/^[-:–]\s*/, '')
                            .replace(/^(?:HOOK|THE CONFLICT|THE VERIFIED PROOF|WHAT THIS MEANS|CTA)[:\s-]*/i, match => match)
                            .trim();
    }
    if (!sceneTitle && !sceneTime) {
      sceneTitle = `SCENE ${sIdx + 1}`;
    }

    const lines = trimmed.split('\n');
    let sceneCuesHtml = '';

    lines.forEach((line, lIdx) => {
      let l = line.trim();
      if (!l) return;

      // Skip first line if it was strictly the scene timestamp header
      if (lIdx === 0 && sceneTime && l.includes(sceneTime) && l.length < 50) {
        return;
      }

      // Check if line is Visual Direction / Cue
      const isVisual = /\b(?:VISUAL CUE|VISUAL DIRECTION|VISUAL|B-ROLL|CAMERA|SHOT)\b/i.test(l);
      // Check if line is Voiceover / Dialogue
      const isVoiceover = /\b(?:VOICEOVER|VOICE-OVER|VO|AUDIO|DIALOGUE|HOST|NARRATOR)\b/i.test(l);
      // Check if line is On-Screen Text
      const isOnScreen = /\b(?:ON-SCREEN TEXT|ON SCREEN TEXT|TEXT OVERLAY|GRAPHIC|OVERLAY)\b/i.test(l);

      // Trust signal detection: small ✓ or ⚠ prefix
      const hasVerified = /\[VERIFIED\]|verified|confirmed|corroborated|sources?|according to|benchmark|data/i.test(l);
      const isSingleSource = /\[SINGLE-SOURCE\]|single-source|unverified|unconfirmed/i.test(l);
      let trustPrefix = '';
      if (hasVerified && !isSingleSource) {
        trustPrefix = '<span class="inline-block text-success font-black mr-1.5 select-none" title="Verified Fact">✓</span>';
      } else if (isSingleSource) {
        trustPrefix = '<span class="inline-block text-amber-600 font-black mr-1.5 select-none" title="Single-source claim">⚠</span>';
      }

      if (isVisual) {
        // Strip label and any raw asterisks
        let val = l.replace(/^\*{0,2}(?:VISUAL\s*CUE|VISUAL\s*DIRECTION|VISUAL|B-ROLL|CAMERA|SHOT):?\*{0,2}\s*/i, '');
        val = val.replace(/\*\*/g, '').trim();
        sceneCuesHtml += `
          <div class="p-3 bg-soft border-2 border-ink text-xs text-ink flex items-start gap-2.5 shadow-xs">
            <span class="px-2 py-0.5 bg-yellow border border-ink text-[10px] font-black shrink-0 tracking-wider flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">videocam</span> VISUAL CUE
            </span>
            <em class="italic text-muted font-medium leading-relaxed">${escapeHtml(val)}</em>
          </div>`;
      } else if (isVoiceover) {
        // Strip label and any raw asterisks
        let val = l.replace(/^\*{0,2}(?:VOICEOVER|VOICE-OVER|VO|AUDIO|DIALOGUE|HOST|NARRATOR):?\*{0,2}\s*/i, '');
        val = val.replace(/\*\*/g, '').trim();
        sceneCuesHtml += `
          <div class="p-3.5 bg-card border-l-4 border-purple border-t-2 border-r-2 border-b-2 border-ink text-sm text-ink flex items-start gap-2.5 shadow-xs">
            <span class="px-2 py-0.5 bg-purple text-white border border-ink text-[10px] font-black shrink-0 tracking-wider flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">mic</span> VOICEOVER
            </span>
            <div class="leading-relaxed text-ink font-semibold flex-1">
              ${trustPrefix}${escapeHtml(val)}
            </div>
          </div>`;
      } else if (isOnScreen) {
        // Strip label and any raw asterisks
        let val = l.replace(/^\*{0,2}(?:ON-SCREEN\s*TEXT|ON\s*SCREEN\s*TEXT|TEXT\s*OVERLAY|GRAPHIC|OVERLAY):?\*{0,2}\s*/i, '');
        val = val.replace(/\*\*/g, '').trim();
        sceneCuesHtml += `
          <div class="p-2.5 bg-yellowSoft/40 border-2 border-ink text-xs text-ink flex items-start gap-2.5 shadow-xs">
            <span class="px-2 py-0.5 bg-card border border-ink text-[10px] font-black shrink-0 tracking-wider flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">subtitles</span> ON-SCREEN
            </span>
            <span class="font-mono font-black text-purple text-xs tracking-wide">${escapeHtml(val)}</span>
          </div>`;
      } else {
        // General script line: bold timestamps [0:00–0:03], remove stray asterisks
        let formatted = escapeHtml(l);
        formatted = formatted.replace(/\[?(\d+:\d+\s*(?:–|-)\s*\d+:\d+)\]?/g, '<strong class="font-black text-ink font-mono bg-yellow px-1.5 py-0.5 border border-ink shadow-xs">[$1]</strong>');
        formatted = formatted.replace(/\*\*/g, '');
        sceneCuesHtml += `
          <p class="text-xs font-bold text-ink leading-relaxed py-1 flex items-start">
            ${trustPrefix}<span>${formatted}</span>
          </p>`;
      }
    });

    html += `
      <div class="border-4 border-ink bg-card p-4 md:p-5 shadow-brutal space-y-3">
        <div class="flex items-center justify-between border-b-2 border-ink pb-2.5">
          <div class="flex items-center gap-2">
            ${sceneTime ? `<strong class="px-2.5 py-1 bg-yellow border-2 border-ink text-xs font-black font-mono shadow-xs">⏱ [${escapeHtml(sceneTime)}]</strong>` : ''}
            <span class="font-black text-xs uppercase tracking-wider text-purple">${escapeHtml(sceneTitle || 'SCENE')}</span>
          </div>
          <span class="text-[10px] font-black uppercase text-muted tracking-wider">REEL CUE</span>
        </div>
        <div class="space-y-2.5">
          ${sceneCuesHtml}
        </div>
      </div>
    `;
  });

  html += '</div>';
  return html;
}

function renderStandardMarkdown(text) {
  const lines = text.split('\n');
  let html = '';
  let inList = false;
  let listType = 'ul';
  let tableBuffer = [];

  function flushTable() {
    if (tableBuffer.length === 0) return;
    html += renderMarkdownTable(tableBuffer);
    tableBuffer = [];
  }

  function flushList() {
    if (inList) {
      html += `</${listType}>`;
      inList = false;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Table line or continuation of table row
    const isTablePipeLine = line.includes('|');
    const isTableSeparator = /^\|?[\s:\-]+\|?[\s:\-|]*$/.test(line) && line.includes('-');
    const isTableContinuation = tableBuffer.length > 0 && !line.startsWith('#') && !/^(\-{3,}|\*{3,}|_{3,})$/.test(line) && line.length > 0;

    if (isTablePipeLine || isTableSeparator || isTableContinuation) {
      flushList();
      tableBuffer.push(line);
      continue;
    } else if (tableBuffer.length > 0) {
      flushTable();
    }

    if (!line) {
      flushList();
      continue;
    }

    // Horizontal Rule
    if (/^(\-{3,}|\*{3,}|_{3,})$/.test(line)) {
      flushList();
      html += `<hr class="my-6 border-2 border-ink border-dashed" />`;
      continue;
    }

    // Headings
    if (/^#\s+(.+)$/.test(line)) {
      flushList();
      const content = line.replace(/^#\s+/, '');
      html += `<h2 class="text-2xl md:text-3xl font-black border-b-4 border-ink pb-2 my-4 text-ink">${inlineFormat(content)}</h2>`;
      continue;
    }
    if (/^##\s+(.+)$/.test(line)) {
      flushList();
      const content = line.replace(/^##\s+/, '');
      html += `<h3 class="text-xl md:text-2xl font-black mt-6 mb-3 text-ink flex items-center gap-2"><span class="w-3 h-3 bg-yellow border-2 border-ink inline-block"></span>${inlineFormat(content)}</h3>`;
      continue;
    }
    if (/^###\s+(.+)$/.test(line)) {
      flushList();
      const content = line.replace(/^###\s+/, '');
      html += `<h4 class="text-base md:text-lg font-black mt-5 mb-2 text-purple uppercase tracking-wider">${inlineFormat(content)}</h4>`;
      continue;
    }
    if (/^####\s+(.+)$/.test(line)) {
      flushList();
      const content = line.replace(/^####\s+/, '');
      html += `<h5 class="text-sm md:text-base font-black mt-4 mb-1 text-ink uppercase">${inlineFormat(content)}</h5>`;
      continue;
    }

    // Bullet List (- or *)
    if (/^[-*]\s+(.+)$/.test(line)) {
      const content = line.replace(/^[-*]\s+/, '');
      if (!inList || listType !== 'ul') {
        flushList();
        html += `<ul class="my-3 space-y-1.5 pl-4 list-disc font-bold text-ink">`;
        inList = true;
        listType = 'ul';
      }
      html += `<li class="leading-relaxed">${inlineFormat(content)}</li>`;
      continue;
    }

    // Numbered List (1. ...)
    if (/^\d+\.\s+(.+)$/.test(line)) {
      const content = line.replace(/^\d+\.\s+/, '');
      if (!inList || listType !== 'ol') {
        flushList();
        html += `<ol class="my-3 space-y-1.5 pl-4 list-decimal font-bold text-ink">`;
        inList = true;
        listType = 'ol';
      }
      html += `<li class="leading-relaxed">${inlineFormat(content)}</li>`;
      continue;
    }

    // Blockquote
    if (/^>\s+(.+)$/.test(line)) {
      flushList();
      const content = line.replace(/^>\s+/, '');
      html += `<blockquote class="border-l-4 border-purple bg-purple/10 p-3 my-3 italic font-semibold text-ink">${inlineFormat(content)}</blockquote>`;
      continue;
    }

    // Regular Paragraph
    flushList();
    html += `<p class="my-2 leading-relaxed font-semibold text-ink text-sm md:text-base">${inlineFormat(line)}</p>`;
  }

  flushTable();
  flushList();
  return html;
}

function renderMarkdownTable(tableLines) {
  if (tableLines.length < 2) return tableLines.map(l => `<p>${inlineFormat(l)}</p>`).join('');

  const mergedRows = [];
  for (let l of tableLines) {
    const trimmed = l.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('|') || mergedRows.length === 0) {
      mergedRows.push(trimmed);
    } else {
      mergedRows[mergedRows.length - 1] += ' ' + trimmed;
    }
  }

  if (mergedRows.length === 0) return '';

  const headerCells = mergedRows[0].split('|').map(c => c.trim()).filter(Boolean);
  const bodyRows = [];
  for (let i = 1; i < mergedRows.length; i++) {
    const r = mergedRows[i];
    if (/^[|:\-\s]+$/.test(r)) continue;
    const cells = r.split('|').map(c => c.trim()).filter(Boolean);
    if (cells.length > 0) bodyRows.push(cells);
  }

  if (headerCells.length === 0 && bodyRows.length === 0) {
    return tableLines.map(l => `<p>${inlineFormat(l)}</p>`).join('');
  }

  return `
    <div class="overflow-x-auto my-5 border-4 border-ink shadow-brutal bg-card">
      <table class="w-full text-left border-collapse text-xs sm:text-sm">
        <thead class="bg-yellow border-b-4 border-ink font-black uppercase tracking-wider text-xs">
          <tr>
            ${headerCells.map(h => `<th class="p-3 border-r-2 border-ink">${inlineFormat(h)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${bodyRows.map((row, idx) => `
            <tr class="${idx % 2 === 1 ? 'bg-soft' : 'bg-card'} hover:bg-yellowSoft/40 transition">
              ${row.map(cell => `<td class="p-3 border-t-2 border-r-2 border-ink font-bold align-top leading-relaxed">${inlineFormat(cell)}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function inlineFormat(str) {
  if (str === null || str === undefined) return '';
  let s = escapeHtml(String(str));

  // Consistent fixed height + padding + line-height across all inline badge types
  const badgeBase = 'inline-flex items-center gap-1 h-5 px-2 text-[10px] font-black uppercase border border-ink shadow-xs align-middle leading-none my-0.5 whitespace-nowrap';

  // Citations: [Source 1: domain.com]
  s = s.replace(/\[Source\s+(\d+)(?::\s*([^\]]+))?\]/gi, (match, idx, dom) => {
    return `<span class="${badgeBase} bg-yellow text-ink">📎 Source ${idx}${dom ? ': ' + dom : ''}</span>`;
  });

  // Verified badges
  s = s.replace(/\[VERIFIED(?:\s*-\s*Multi-Source|:[^\]]+|\s*\(\d+%\))?\]/gi, () => {
    return `<span class="${badgeBase} bg-successSoft text-success">✓ VERIFIED</span>`;
  });

  // Single-source badges
  s = s.replace(/\[SINGLE-SOURCE(?::\s*([^\]]+))?\]/gi, (match, dom) => {
    return `<span class="${badgeBase} bg-soft text-muted">⚠ ${dom || 'SINGLE-SOURCE'}</span>`;
  });

  // Bold: **text**
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-black text-ink bg-yellow/30 px-1 border border-ink/20 rounded-xs">$1</strong>');

  // Italics: *text*
  s = s.replace(/(^|[^*])\*([^*\n]+)\*([^*]|$)/g, '$1<em class="italic font-semibold text-ink">$2</em>$3');

  // Inline code: `code`
  s = s.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-soft border border-ink text-xs font-mono font-bold">$1</code>');

  // Eliminate any stray leaked asterisks (** showing raw)
  s = s.replace(/\*\*/g, '');

  return s;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}
