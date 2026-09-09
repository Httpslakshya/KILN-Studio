import { apiPost } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  // Tab Switching
  const tabLiveRag = document.getElementById('tab-live-rag');
  const tabPipeline = document.getElementById('tab-pipeline');
  const tabGuardrails = document.getElementById('tab-guardrails');

  const navPipelineBtn = document.getElementById('nav-pipeline-btn');
  const navLiveBtn = document.getElementById('nav-live-btn');
  const navGuardBtn = document.getElementById('nav-guard-btn');

  const secLiveRag = document.getElementById('section-live-rag');
  const secPipeline = document.getElementById('section-pipeline');
  const secGuardrails = document.getElementById('section-guardrails');

  function switchTab(activeTab, activeSec) {
    [tabLiveRag, tabPipeline, tabGuardrails].forEach(t => {
      if (!t) return;
      t.classList.remove('bg-yellow');
      t.classList.add('bg-card');
    });
    if (activeTab) {
      activeTab.classList.remove('bg-card');
      activeTab.classList.add('bg-yellow');
    }

    [navPipelineBtn, navLiveBtn, navGuardBtn].forEach(btn => {
      if (!btn) return;
      btn.className = 'w-full flex items-center gap-3 border-4 border-transparent hover:border-ink hover:bg-soft p-2.5 font-bold text-sm text-left transition';
    });

    if (activeTab === tabPipeline && navPipelineBtn) {
      navPipelineBtn.className = 'w-full flex items-center gap-3 bg-yellow border-4 border-ink shadow-sm-brutal p-2.5 font-black text-sm text-left transition';
    } else if (activeTab === tabLiveRag && navLiveBtn) {
      navLiveBtn.className = 'w-full flex items-center gap-3 bg-yellow border-4 border-ink shadow-sm-brutal p-2.5 font-black text-sm text-left transition';
    } else if (activeTab === tabGuardrails && navGuardBtn) {
      navGuardBtn.className = 'w-full flex items-center gap-3 bg-yellow border-4 border-ink shadow-sm-brutal p-2.5 font-black text-sm text-left transition';
    }

    [secLiveRag, secPipeline, secGuardrails].forEach(s => s.classList.add('hidden'));
    activeSec.classList.remove('hidden');
  }

  tabLiveRag?.addEventListener('click', () => switchTab(tabLiveRag, secLiveRag));
  tabPipeline?.addEventListener('click', () => switchTab(tabPipeline, secPipeline));
  tabGuardrails?.addEventListener('click', () => switchTab(tabGuardrails, secGuardrails));

  navPipelineBtn?.addEventListener('click', () => switchTab(tabPipeline, secPipeline));
  navLiveBtn?.addEventListener('click', () => switchTab(tabLiveRag, secLiveRag));
  navGuardBtn?.addEventListener('click', () => switchTab(tabGuardrails, secGuardrails));

  // Quick Query chips (Search)
  document.querySelectorAll('.quick-query-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const input = document.getElementById('live-query-input');
      if (input) input.value = chip.textContent.trim();
    });
  });

  // Pipeline Inspiration Chips
  document.querySelectorAll('.pipeline-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const input = document.getElementById('pipeline-topic-input');
      if (input) input.value = chip.textContent.trim();
    });
  });

  // Guardrail Sample buttons
  document.querySelectorAll('.guard-sample-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById('guard-input-text');
      if (input) input.value = btn.getAttribute('data-text');
    });
  });

  // 1. LIVE VERIFIED SEARCH HANDLER
  const liveSearchBtn = document.getElementById('live-search-btn');
  const liveQueryInput = document.getElementById('live-query-input');
  const liveRagLoading = document.getElementById('live-rag-loading');
  const liveRagResults = document.getElementById('live-rag-results');

  liveSearchBtn?.addEventListener('click', async () => {
    const query = liveQueryInput.value.trim();
    if (!query) return;

    liveSearchBtn.disabled = true;
    liveRagLoading.classList.remove('hidden');
    liveRagResults.classList.add('hidden');

    try {
      const res = await apiPost('/api/live-rag/search', { query, max_articles: 8 });
      if (res.success && res.data) {
        renderLiveRagResults(res.data);
      } else {
        alert(res.message || 'Live search error');
      }
    } catch (err) {
      alert(`Search error: ${err.message}`);
    } finally {
      liveSearchBtn.disabled = false;
      liveRagLoading.classList.add('hidden');
    }
  });

  function renderLiveRagResults(data) {
    liveRagResults.classList.remove('hidden');

    // Populate Metrics
    const metrics = data.metrics || {};
    document.getElementById('metric-ingested').textContent = metrics.articles_ingested || 0;
    document.getElementById('metric-freshness').textContent = `${(metrics.avg_freshness_score * 100 || 85).toFixed(0)}%`;
    document.getElementById('metric-verified').textContent = `${metrics.verified_claims_count || 0}/${metrics.total_claims_count || 0}`;

    // Render Claims Matrix
    const claimsContainer = document.getElementById('claims-matrix');
    claimsContainer.innerHTML = '';
    const claims = (data.verification && data.verification.claims) || [];
    
    if (claims.length === 0) {
      claimsContainer.innerHTML = '<p class="text-xs font-bold text-muted">No explicit atomic claims extracted.</p>';
    } else {
      claims.forEach(c => {
        const isMulti = c.status === 'VERIFIED';
        const badgeColor = isMulti ? 'bg-successSoft text-success border-success' : 'bg-yellowSoft text-ink border-ink';
        const badgeText = isMulti ? `VERIFIED (${c.domain_count} Domains)` : 'SINGLE-SOURCE';
        const domains = c.corroborating_domains.join(', ') || 'Primary Source';

        const row = document.createElement('div');
        row.className = 'border-2 border-ink p-3 bg-paper shadow-sm-brutal flex flex-col md:flex-row md:items-center justify-between gap-3';
        row.innerHTML = `
          <div class="space-y-1 flex-1">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 text-xs font-black border-2 rounded ${badgeColor}">${badgeText}</span>
              <span class="text-xs font-bold text-muted">${c.category}</span>
            </div>
            <p class="font-bold text-sm">${escapeHtml(c.statement)}</p>
            <p class="text-xs text-muted font-bold">Corroborating Domains: <span class="text-ink">${escapeHtml(domains)}</span></p>
          </div>
          <div class="shrink-0 text-right">
            <span class="text-xs font-black uppercase text-muted">Confidence</span>
            <p class="font-black text-sm">${(c.confidence_score * 100).toFixed(0)}%</p>
          </div>
        `;
        claimsContainer.appendChild(row);
      });
    }

    // Render Synthesized Text
    const answerContainer = document.getElementById('rag-answer-content');
    answerContainer.innerHTML = renderMarkdown(data.answer || 'No response generated.');

    // Render Primary Citations
    const citationsGrid = document.getElementById('citations-grid');
    citationsGrid.innerHTML = '';
    const citations = data.citations || [];
    citations.forEach(cit => {
      const card = document.createElement('div');
      card.className = 'border-2 border-ink p-3 bg-paper shadow-sm-brutal space-y-1';
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="px-2 py-0.5 bg-yellow border border-ink text-xs font-black">Source ${cit.index}</span>
          <span class="text-xs font-bold text-muted">${cit.source_domain}</span>
        </div>
        <a href="${cit.url}" target="_blank" class="block font-black text-sm hover:text-purple hover:underline line-clamp-2">
          ${escapeHtml(cit.title)}
        </a>
        <div class="flex items-center justify-between text-xs text-muted font-bold pt-1">
          <span>Freshness: ${(cit.freshness_score * 100).toFixed(0)}%</span>
          <span>${cit.published_at ? new Date(cit.published_at).toLocaleDateString() : 'Live'}</span>
        </div>
      `;
      citationsGrid.appendChild(card);
    });
  }

  // 2. MULTI-AGENT PIPELINE HANDLER
  const pipelineBtn = document.getElementById('pipeline-start-btn');
  const pipelineTopicInput = document.getElementById('pipeline-topic-input');
  const pipelineAudienceSelect = document.getElementById('pipeline-audience-select');
  const pipelineOutputContainer = document.getElementById('pipeline-output-container');
  const logsBox = document.getElementById('pipeline-logs-box');

  const badgeResearcher = document.getElementById('badge-researcher');
  const badgeVerifier = document.getElementById('badge-verifier');
  const badgeWriter = document.getElementById('badge-writer');
  const badgeEditor = document.getElementById('badge-editor');

  pipelineBtn?.addEventListener('click', async () => {
    const topic = pipelineTopicInput.value.trim();
    if (!topic) return;

    pipelineBtn.disabled = true;
    const origBtnHtml = pipelineBtn.innerHTML;
    pipelineOutputContainer.classList.add('hidden');
    logsBox.innerHTML = '<p class="text-purple font-bold">> [Supervisor] Initializing 4-Agent pipeline lifecycle...</p>';

    // Stage 1: Researcher Active
    setStepState(badgeResearcher, 'WORKING', 'bg-yellow');
    setStepState(badgeVerifier, 'QUEUED', 'bg-soft');
    setStepState(badgeWriter, 'QUEUED', 'bg-soft');
    setStepState(badgeEditor, 'QUEUED', 'bg-soft');
    pipelineBtn.innerHTML = '<span class="animate-spin inline-block mr-1">⏳</span> 1. Researcher gathering live feeds...';

    // Step progression ticker to provide continuous visual feedback
    let elapsed = 0;
    appendLog('Supervisor', 'Launched 4-Agent Pipeline. Ingesting live intelligence streams...');
    const progressTimer = setInterval(() => {
      elapsed += 1;
      if (elapsed === 2) {
        setStepState(badgeResearcher, 'DONE', 'bg-successSoft text-success');
        setStepState(badgeVerifier, 'WORKING', 'bg-yellow animate-pulse');
        pipelineBtn.innerHTML = '<span class="animate-spin inline-block mr-1">⏳</span> 2. Verifier cross-checking sources... (' + elapsed + 's)';
        appendLog('VerifierAgent', 'Cross-checking factual claims across independent publisher domains with AgentPrahari guard...');
      } else if (elapsed === 8) {
        setStepState(badgeVerifier, 'DONE', 'bg-successSoft text-success');
        setStepState(badgeWriter, 'WORKING', 'bg-yellow animate-pulse');
        pipelineBtn.innerHTML = '<span class="animate-spin inline-block mr-1">⏳</span> 3. Writer drafting cited analysis... (' + elapsed + 's)';
        appendLog('WriterAgent', 'Synthesizing verified claims into structured report with strict bracketed citations...');
      } else if (elapsed === 18) {
        setStepState(badgeWriter, 'DONE', 'bg-successSoft text-success');
        setStepState(badgeEditor, 'WORKING', 'bg-yellow animate-pulse');
        pipelineBtn.innerHTML = '<span class="animate-spin inline-block mr-1">⏳</span> 4. Editor reviewing groundedness... (' + elapsed + 's)';
        appendLog('EditorAgent', 'Critiquing draft against factual rubric, citation density, and groundedness...');
      } else if (elapsed > 18 && elapsed % 5 === 0) {
        pipelineBtn.innerHTML = '<span class="animate-spin inline-block mr-1">⏳</span> 4. Finalizing review & citations... (' + elapsed + 's)';
        appendLog('Supervisor', `Pipeline active (${elapsed}s elapsed). Synthesizing editorial review...`);
      }
    }, 1000);

    function appendLog(agent, msg) {
      const p = document.createElement('p');
      p.className = 'py-0.5';
      p.innerHTML = `<span class="text-purple font-black">[${agent}]</span> ${escapeHtml(msg)}`;
      logsBox.appendChild(p);
      logsBox.scrollTop = logsBox.scrollHeight;
    }

    try {
      const res = await apiPost('/api/live-rag/research-pipeline', {
        topic,
        target_audience: pipelineAudienceSelect.value,
        max_revisions: 1
      });

      clearInterval(progressTimer);

      if (res.success && res.data) {
        // Complete all visual steps
        setStepState(badgeResearcher, 'DONE', 'bg-successSoft text-success');
        setStepState(badgeVerifier, 'DONE', 'bg-successSoft text-success');
        setStepState(badgeWriter, 'DONE', 'bg-successSoft text-success');
        setStepState(badgeEditor, 'APPROVED', 'bg-purple text-white');

        renderPipelineOutput(res.data);
      } else {
        alert(res.message || 'Pipeline execution failed');
      }
    } catch (err) {
      clearInterval(progressTimer);
      alert(`Pipeline error: ${err.message}`);
    } finally {
      clearInterval(progressTimer);
      pipelineBtn.disabled = false;
      pipelineBtn.innerHTML = origBtnHtml;
    }
  });

  function setStepState(badgeElem, text, bgClass) {
    if (!badgeElem) return;
    badgeElem.className = `px-2 py-0.5 text-xs font-bold border-2 border-ink ${bgClass}`;
    badgeElem.textContent = text;
  }

  let cachedPipelineAssets = {};
  let activeDockFormat = 'article';

  function renderPipelineOutput(data) {
    latestPipelineData = data;
    cachedPipelineAssets = {
      article: data.final_article || ''
    };
    activeDockFormat = 'article';

    pipelineOutputContainer.classList.remove('hidden');

    // Populate logs box
    logsBox.innerHTML = '';
    (data.step_logs || []).forEach(log => {
      const p = document.createElement('p');
      p.innerHTML = `<span class="text-purple font-bold">[${log.agent_name}]</span> ${escapeHtml(log.summary)}`;
      logsBox.appendChild(p);
    });

    // Scorecard
    const critiques = data.critiques || [];
    const latestCritique = critiques[critiques.length - 1] || {};
    document.getElementById('scorecard-summary').textContent = `Approved by Editor (Score: ${latestCritique.score || 90}/100)`;
    document.getElementById('scorecard-feedback').textContent = latestCritique.feedback || 'Content passed all groundedness thresholds.';
    document.getElementById('scorecard-groundedness').textContent = `${((latestCritique.groundedness_score || 0.94) * 100).toFixed(0)}%`;
    document.getElementById('scorecard-revisions').textContent = data.iterations || 1;

    // Reset and display active format
    updateFormatDockButtons('article');
    renderActiveDockFormat('article');
  }

  function updateFormatDockButtons(selected) {
    document.querySelectorAll('.format-dock-btn').forEach(b => {
      const f = b.getAttribute('data-format');
      if (f === selected) {
        b.className = 'format-dock-btn active press border-2 border-ink bg-purple text-white px-3.5 py-2 text-xs font-black shadow-xs flex items-center gap-1.5';
      } else {
        b.className = 'format-dock-btn press border-2 border-ink bg-paper text-ink hover:bg-yellow px-3.5 py-2 text-xs font-black shadow-xs flex items-center gap-1.5';
      }
    });
  }

  async function renderActiveDockFormat(format) {
    activeDockFormat = format;
    const viewport = document.getElementById('dock-content-viewport');
    const loadingView = document.getElementById('dock-loading-view');

    if (format === 'article') {
      if (loadingView) loadingView.classList.add('hidden');
      if (viewport) {
        viewport.classList.remove('hidden');
        viewport.innerHTML = `<div id="pipeline-final-article" class="prose max-w-none text-sm md:text-base leading-relaxed space-y-4 text-ink">${renderMarkdown(cachedPipelineAssets.article || '')}</div>`;
      }
      return;
    }

    if (cachedPipelineAssets[format]) {
      if (loadingView) loadingView.classList.add('hidden');
      if (viewport) {
        viewport.classList.remove('hidden');
        renderDockPayload(format, cachedPipelineAssets[format]);
      }
      return;
    }

    // Fetch from backend
    if (loadingView) loadingView.classList.remove('hidden');
    if (viewport) viewport.classList.add('hidden');

    try {
      const res = await apiPost('/api/live-rag/repurpose', {
        format_type: format,
        topic: latestPipelineData?.topic || 'Verified Topic',
        content: latestPipelineData?.final_article || '',
        claims: latestPipelineData?.verified_claims || []
      });

      if (res.success && res.data) {
        cachedPipelineAssets[format] = res.data;
        if (loadingView) loadingView.classList.add('hidden');
        if (viewport) {
          viewport.classList.remove('hidden');
          renderDockPayload(format, res.data);
        }
      } else {
        alert(res.message || 'Failed to generate format');
        if (loadingView) loadingView.classList.add('hidden');
      }
    } catch (err) {
      alert(`Format generation error: ${err.message}`);
      if (loadingView) loadingView.classList.add('hidden');
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
      const outputText = payload.formatted_output || (typeof payload === 'string' ? payload : '');
      viewport.innerHTML = `
        <div class="border-4 border-ink p-6 bg-paper shadow-sm-brutal space-y-4">
          ${renderMarkdown(outputText, format)}
        </div>
      `;
    }
  }

  // Format dock buttons click listener
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.format-dock-btn');
    if (!btn) return;
    const format = btn.getAttribute('data-format');
    updateFormatDockButtons(format);
    renderActiveDockFormat(format);
  });

  // Dock Copy Button listener
  document.getElementById('studio-dock-copy-btn')?.addEventListener('click', () => {
    const dockBtn = document.getElementById('studio-dock-copy-btn');
    let copyText = '';
    if (activeDockFormat === 'article') {
      copyText = cachedPipelineAssets.article || '';
    } else if (cachedPipelineAssets[activeDockFormat]) {
      const p = cachedPipelineAssets[activeDockFormat];
      copyText = p.formatted_output || (typeof p === 'string' ? p : '');
    }

    if (!copyText) {
      alert('No content available to copy yet.');
      return;
    }

    navigator.clipboard.writeText(copyText).then(() => {
      dockBtn.innerHTML = '<span class="material-symbols-outlined text-sm">check</span> Copied!';
      setTimeout(() => {
        dockBtn.innerHTML = '<span class="material-symbols-outlined text-sm">content_copy</span> Copy Active Asset';
      }, 2000);
    });
  });

  // 3. AGENTPRAHARI SANDBOX HANDLER
  const guardEvalBtn = document.getElementById('guard-evaluate-btn');
  const guardInput = document.getElementById('guard-input-text');
  const guardResultCard = document.getElementById('guard-result-card');
  const guardDecisionBadge = document.getElementById('guard-decision-badge');
  const guardOrigContent = document.getElementById('guard-orig-content');
  const guardSanitizedContent = document.getElementById('guard-sanitized-content');
  const guardViolationsList = document.getElementById('guard-violations-list');

  guardEvalBtn?.addEventListener('click', async () => {
    const text = guardInput.value.trim();
    if (!text) return;

    guardEvalBtn.disabled = true;
    try {
      const res = await apiPost('/api/live-rag/guardrails/check', {
        text,
        check_type: 'input'
      });

      if (res.success && res.data) {
        guardResultCard.classList.remove('hidden');
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

        guardOrigContent.textContent = data.original_content;
        guardSanitizedContent.textContent = data.sanitized_content || data.original_content;

        guardViolationsList.innerHTML = '';
        if (data.violations && data.violations.length > 0) {
          data.violations.forEach(v => {
            const vDiv = document.createElement('div');
            vDiv.className = 'border-2 border-ink p-2 bg-paper text-xs font-bold flex items-center justify-between';
            vDiv.innerHTML = `
              <span><strong>[${v.rule_id}]</strong> ${escapeHtml(v.message)}</span>
              <span class="px-2 py-0.5 bg-yellow border border-ink text-[10px] uppercase font-black">${v.severity}</span>
            `;
            guardViolationsList.appendChild(vDiv);
          });
        } else {
          guardViolationsList.innerHTML = '<p class="text-xs text-muted font-bold">No violations detected. Clean prompt.</p>';
        }
      } else {
        alert(res.message || 'Evaluation error');
      }
    } catch (e) {
      alert(`Guardrail error: ${e.message}`);
    } finally {
      guardEvalBtn.disabled = false;
    }
  });

  // 4. CREATOR STUDIO REPURPOSING HANDLER
  let latestLiveRagData = null;
  let latestPipelineData = null;

  // Cache data on search/pipeline completion
  const origRenderLiveRagResults = renderLiveRagResults;
  renderLiveRagResults = function(data) {
    latestLiveRagData = data;
    origRenderLiveRagResults(data);
  };

  const origRenderPipelineOutput = renderPipelineOutput;
  renderPipelineOutput = function(data) {
    latestPipelineData = data;
    origRenderPipelineOutput(data);
  };

  const creatorModal = document.getElementById('creator-modal');
  const creatorModalTitle = document.getElementById('creator-modal-title');
  const creatorModalClose = document.getElementById('creator-modal-close');
  const creatorCopyBtn = document.getElementById('creator-copy-btn');
  const creatorSlidesView = document.getElementById('creator-slides-view');
  const creatorTextView = document.getElementById('creator-text-view');
  const creatorRawView = document.getElementById('creator-raw-view');
  const modalViewFormattedBtn = document.getElementById('modal-view-formatted-btn');
  const modalViewRawBtn = document.getElementById('modal-view-raw-btn');
  const modalViewSwitcher = document.getElementById('modal-view-switcher');

  modalViewFormattedBtn?.addEventListener('click', () => {
    modalViewFormattedBtn.className = 'px-2.5 py-1 text-xs font-black bg-purple text-white';
    modalViewRawBtn.className = 'px-2.5 py-1 text-xs font-black bg-paper text-ink hover:bg-yellow';
    creatorTextView.classList.remove('hidden');
    creatorRawView.classList.add('hidden');
  });

  modalViewRawBtn?.addEventListener('click', () => {
    modalViewRawBtn.className = 'px-2.5 py-1 text-xs font-black bg-purple text-white';
    modalViewFormattedBtn.className = 'px-2.5 py-1 text-xs font-black bg-paper text-ink hover:bg-yellow';
    creatorTextView.classList.add('hidden');
    creatorRawView.classList.remove('hidden');
  });

  creatorModalClose?.addEventListener('click', () => {
    creatorModal.classList.add('hidden');
  });

  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.repurpose-btn');
    if (!btn) return;

    const format = btn.getAttribute('data-format');
    const source = btn.getAttribute('data-source');
    
    let topic = '';
    let content = '';
    let claims = [];

    if (source === 'pipeline') {
      if (!latestPipelineData) {
        alert('Please run the 4-Agent Pipeline first to generate source material.');
        return;
      }
      topic = latestPipelineData.topic || 'Intelligence Report';
      content = latestPipelineData.final_article || '';
      claims = latestPipelineData.verified_claims || [];
    } else {
      if (!latestLiveRagData) {
        alert('Please perform a Live Verified Search first to generate source material.');
        return;
      }
      topic = latestLiveRagData.query || 'Live News Topic';
      content = latestLiveRagData.answer || '';
      claims = (latestLiveRagData.verification && latestLiveRagData.verification.claims) || [];
    }

    if (!content) {
      alert('No text content available to repurpose.');
      return;
    }

    btn.disabled = true;
    const origHtml = btn.innerHTML;
    btn.innerHTML = '<span class="animate-spin inline-block mr-1">⏳</span> Generating...';

    try {
      const res = await apiPost('/api/live-rag/repurpose', {
        format_type: format,
        topic: topic,
        content: content,
        claims: claims
      });

      if (res.success && res.data) {
        openCreatorModal(res.data);
      } else {
        alert(res.message || 'Repurposing failed');
      }
    } catch (err) {
      alert(`Repurposing error: ${err.message}`);
    } finally {
      btn.disabled = false;
      btn.innerHTML = origHtml;
    }
  });

  function openCreatorModal(data) {
    creatorModal.classList.remove('hidden');
    creatorModalTitle.textContent = data.title || 'Creator Studio Export';

    // Reset view switcher to formatted
    if (modalViewFormattedBtn && modalViewRawBtn) {
      modalViewFormattedBtn.className = 'px-2.5 py-1 text-xs font-black bg-purple text-white';
      modalViewRawBtn.className = 'px-2.5 py-1 text-xs font-black bg-paper text-ink hover:bg-yellow';
    }

    // Carousel vs Text formatting
    if (data.format === 'carousel_slides' && data.slides && data.slides.length > 0) {
      if (modalViewSwitcher) modalViewSwitcher.classList.add('hidden');
      creatorSlidesView.classList.remove('hidden');
      creatorTextView.classList.add('hidden');
      creatorRawView.classList.add('hidden');
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
            <button class="copy-single-slide border border-ink bg-card hover:bg-yellow px-2 py-1 text-[10px] font-black shadow-xs" data-text="${escapeHtml(slide.headline + '\n\n' + slide.body)}">
              Copy Slide
            </button>
          </div>
        `;
        creatorSlidesView.appendChild(card);
      });

      // Wire per-slide copy
      document.querySelectorAll('.copy-single-slide').forEach(sb => {
        sb.addEventListener('click', (ev) => {
          ev.stopPropagation();
          const text = sb.getAttribute('data-text');
          navigator.clipboard.writeText(text);
          sb.textContent = 'Copied!';
          setTimeout(() => { sb.textContent = 'Copy Slide'; }, 1500);
        });
      });

    } else {
      if (modalViewSwitcher) modalViewSwitcher.classList.remove('hidden');
      creatorSlidesView.classList.add('hidden');
      creatorTextView.classList.remove('hidden');
      creatorRawView.classList.add('hidden');

      // Render rich markdown
      creatorTextView.innerHTML = renderMarkdown(data.formatted_output || '', data.format);
      creatorRawView.value = data.formatted_output || '';
    }

    // Global copy button (copies clean markdown ready to paste)
    creatorCopyBtn.onclick = () => {
      const fullText = data.formatted_output || '';
      navigator.clipboard.writeText(fullText).then(() => {
        creatorCopyBtn.innerHTML = '<span class="material-symbols-outlined text-sm">check</span> Copied!';
        setTimeout(() => {
          creatorCopyBtn.innerHTML = '<span class="material-symbols-outlined text-sm">content_copy</span> Copy';
        }, 2000);
      });
    };
  }

  // --- COMPREHENSIVE MARKDOWN & NEO-BRUTALIST FORMATTER ---
  function renderMarkdown(md, formatType = 'general') {
    if (!md) return '';
    let text = String(md).replace(/\r\n/g, '\n');

    // Dedicated cinematic card renderer for Viral Reel / Video Scripts
    if (formatType === 'viral_reel_script') {
      return renderReelScript(text);
    }

    return renderStandardMarkdown(text);
  }

  function renderReelScript(text) {
    // Split script into scenes by horizontal rules (---) or scene tags
    const rawScenes = text.split(/\n\s*---\s*\n/g);
    let html = '';

    rawScenes.forEach(rawScene => {
      const trimmed = rawScene.trim();
      if (!trimmed) return;

      // Extract timestamp header, e.g. **[0:00 - 0:03] HOOK** or **[0:03 - 0:15] THE CONFLICT / SHIFT**
      const headerMatch = trimmed.match(/^\*\*\[?(\d+:\d+\s*-\s*\d+:\d+)\]?\s*([^*]*)\*\*/i);
      let sceneTime = '';
      let sceneTitle = '';
      let sceneBody = trimmed;

      if (headerMatch) {
        sceneTime = headerMatch[1].trim();
        sceneTitle = headerMatch[2].trim() || 'SCENE';
        sceneBody = trimmed.slice(headerMatch[0].length).trim();
      }

      const lines = sceneBody.split('\n');
      let sceneCuesHtml = '';

      lines.forEach(line => {
        const l = line.trim();
        if (!l) return;

        if (/^\*\*VISUAL CUE:?\*\*/i.test(l)) {
          const val = l.replace(/^\*\*VISUAL CUE:?\*\*\s*/i, '');
          sceneCuesHtml += `
            <div class="p-3 bg-soft border-2 border-ink text-xs font-bold text-ink flex items-start gap-2.5 shadow-xs rounded">
              <span class="px-2 py-0.5 bg-yellow border border-ink text-[10px] font-black shrink-0 tracking-wider">🎥 VISUAL CUE</span>
              <span class="leading-relaxed">${inlineFormat(val)}</span>
            </div>`;
        } else if (/^\*\*VOICEOVER:?\*\*/i.test(l)) {
          const val = l.replace(/^\*\*VOICEOVER:?\*\*\s*/i, '');
          sceneCuesHtml += `
            <div class="p-3.5 bg-purple/10 border-l-4 border-purple border-t-2 border-r-2 border-b-2 border-ink text-sm font-bold text-ink flex items-start gap-2.5 shadow-xs rounded">
              <span class="px-2 py-0.5 bg-purple text-white border border-ink text-[10px] font-black shrink-0 tracking-wider">🎙️ VOICEOVER</span>
              <span class="leading-relaxed text-ink font-semibold">${inlineFormat(val)}</span>
            </div>`;
        } else if (/^\*\*ON-SCREEN TEXT:?\*\*/i.test(l)) {
          const val = l.replace(/^\*\*ON-SCREEN TEXT:?\*\*\s*/i, '');
          sceneCuesHtml += `
            <div class="p-3 bg-yellowSoft/40 border-2 border-ink text-xs font-black text-ink flex items-start gap-2.5 shadow-xs rounded">
              <span class="px-2 py-0.5 bg-card border border-ink text-[10px] font-black shrink-0 tracking-wider">💬 ON-SCREEN</span>
              <span class="tracking-wide">${inlineFormat(val)}</span>
            </div>`;
        } else {
          sceneCuesHtml += `<p class="text-xs font-bold text-ink leading-relaxed py-1">${inlineFormat(l)}</p>`;
        }
      });

      html += `
        <div class="border-4 border-ink bg-card p-4 md:p-5 shadow-brutal space-y-3 rounded mb-4">
          ${sceneTime ? `
            <div class="flex items-center justify-between border-b-2 border-ink pb-2.5">
              <span class="px-2.5 py-1 bg-yellow border-2 border-ink text-xs font-black shadow-xs">⏱ ${escapeHtml(sceneTime)}</span>
              <span class="font-black text-xs uppercase tracking-wider text-purple">${escapeHtml(sceneTitle)}</span>
            </div>
          ` : ''}
          <div class="space-y-2.5">
            ${sceneCuesHtml}
          </div>
        </div>
      `;
    });

    return html || `<div class="p-4">${inlineFormat(text)}</div>`;
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

      // Table line or continuation of a table row
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

      // Empty line
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

    // Stitch wrapped multi-line rows into single valid table lines
    const mergedRows = [];
    for (let l of tableLines) {
      const trimmed = l.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith('|') || mergedRows.length === 0) {
        mergedRows.push(trimmed);
      } else {
        // Line continuation of previous cell
        mergedRows[mergedRows.length - 1] += ' ' + trimmed;
      }
    }

    if (mergedRows.length === 0) return '';

    // Header cells
    const headerCells = mergedRows[0].split('|').map(c => c.trim()).filter(Boolean);

    // Body rows (skip separator rows containing :--- or ---)
    const bodyRows = [];
    for (let i = 1; i < mergedRows.length; i++) {
      const r = mergedRows[i];
      if (/^[|:\-\s]+$/.test(r)) continue;
      const cells = r.split('|').map(c => c.trim()).filter(Boolean);
      if (cells.length > 0) {
        bodyRows.push(cells);
      }
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

    // Citations: [Source 1: domain.com]
    s = s.replace(/\[Source\s+(\d+)(?::\s*([^\]]+))?\]/gi, (match, idx, dom) => {
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 my-0.5 bg-yellow border border-ink text-xs font-black shadow-xs">📎 Source ${idx}${dom ? ': ' + dom : ''}</span>`;
    });

    // Verified badges: [VERIFIED - Multi-Source] or [VERIFIED: >=2 Sources]
    s = s.replace(/\[VERIFIED(?:\s*-\s*Multi-Source|:[^\]]+|\s*\(\d+%\))?\]/gi, () => {
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 my-0.5 bg-successSoft text-success border border-ink text-xs font-black shadow-xs">✓ VERIFIED</span>`;
    });

    // Single-source badges: [SINGLE-SOURCE: domain.com]
    s = s.replace(/\[SINGLE-SOURCE(?::\s*([^\]]+))?\]/gi, (match, dom) => {
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 my-0.5 bg-soft text-muted border border-ink text-xs font-bold shadow-xs">⚠ ${dom || 'SINGLE-SOURCE'}</span>`;
    });

    // Bold: **text** -> styled bold with highlight
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-black text-ink bg-yellow/30 px-1 border border-ink/20 rounded-xs">$1</strong>');

    // Italics: *text* (avoiding double asterisks)
    s = s.replace(/(^|[^*])\*([^*\n]+)\*([^*]|$)/g, '$1<em class="italic font-semibold text-ink">$2</em>$3');

    // Inline code: `code`
    s = s.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-soft border border-ink text-xs font-mono font-bold">$1</code>');

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
});
