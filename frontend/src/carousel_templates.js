/**
 * KILN Studio - Fixed-Canvas Carousel Template Engine
 * Renders Instagram/LinkedIn carousel slides at exact fixed pixel dimensions:
 * - Portrait: 1080 x 1350 px (4:5)
 * - Square: 1080 x 1080 px (1:1)
 *
 * Presets shortlisted & refined based on user feedback:
 * 1. KILN Neobrutalist Gold (All-Cream Paper, No Black BG)
 * 2. Aura Glow & Glass (Dark Amber Mesh Gradient & Frosted Tabs)
 * 3. LinkedIn Authority (Pure White, Red Brackets [2], 100% English)
 * 4. Bold Kinetic Condensed (Deep Indigo, Anton Caps & Alternating Neon Pink)
 * 5. Retro Pill Stack & Chat (Flame Orange, Tilted Pills & iMessage Bubbles)
 * 6. Boho Roadmap (Per-Slide Authentic Flow Arrows & Playfair Serif)
 * 7. Minimal Publication (Refined Newsreader Serif & Terracotta Accent)
 * 8. Cyber Emerald & Terminal (NEW: Deep Midnight Carbon & Electric Matrix Green)
 * 9. Electric Cobalt & Acid Lime (NEW: Deep Cobalt Blue & High-Voltage Neon Yellow)
 * 10. Luxury Obsidian & Champagne (NEW: Velvet Noir, Champagne Gold & Executive Serif)
 */

export const CANVAS_SIZES = {
  portrait: { width: 1080, height: 1350, ratio: '4/5', label: 'Instagram Portrait (1080×1350)' },
  square: { width: 1080, height: 1080, ratio: '1/1', label: 'Square Post (1080×1080)' }
};

export const TEMPLATE_THEMES = {
  kiln_neobrutalist: {
    id: 'kiln_neobrutalist',
    name: 'KILN Neobrutalist Gold',
    subtitle: 'Signature Paper Cream, Intense Gold (#E8B923) & Bold Ink Shadows (No Black BG)',
    badge: 'Flagship',
    fontHeadline: "'Space Grotesk', sans-serif",
    fontBody: "'Space Grotesk', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    defaultRatio: 'portrait'
  },
  aura_glass: {
    id: 'aura_glass',
    name: 'Aura Glow & Glass',
    subtitle: 'Dark/Amber Mesh Gradient, Frosted Glass Cards & Flame Pill Buttons',
    badge: 'High-Converting',
    fontHeadline: "'Plus Jakarta Sans', 'Syne', sans-serif",
    fontBody: "'Plus Jakarta Sans', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    defaultRatio: 'portrait'
  },
  linkedin_authority: {
    id: 'linkedin_authority',
    name: 'LinkedIn Red & White',
    subtitle: 'Pure White, Red Bracket Numbers [2], Question Cards & Faint Watermarks',
    badge: 'Authority',
    fontHeadline: "'Inter', sans-serif",
    fontBody: "'Inter', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    defaultRatio: 'portrait'
  },
  bold_condensed: {
    id: 'bold_condensed',
    name: 'Bold Kinetic Condensed',
    subtitle: 'Deep Indigo (#35315C), Massive Anton Caps & Alternating Neon Pink',
    badge: 'Viral',
    fontHeadline: "'Anton', 'Archivo Black', sans-serif",
    fontBody: "'Plus Jakarta Sans', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    defaultRatio: 'square'
  },
  retro_pill_stack: {
    id: 'retro_pill_stack',
    name: 'Retro Pill Stack & Chat',
    subtitle: 'Flame Orange, Stacked Rounded Badges, iMessage Mockup & Rainbow Accents',
    badge: 'Engagement',
    fontHeadline: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",
    fontBody: "'Plus Jakarta Sans', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    defaultRatio: 'square'
  },
  boho_roadmap: {
    id: 'boho_roadmap',
    name: 'Boho Roadmap & Flow Arrow',
    subtitle: 'Warm Eggshell Sand, Playfair Display Serif & Authentic Per-Slide Flow Arrows',
    badge: 'Roadmap',
    fontHeadline: "'Playfair Display', 'Fraunces', serif",
    fontBody: "'Inter', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    defaultRatio: 'portrait'
  },
  minimal_editorial: {
    id: 'minimal_editorial',
    name: 'Minimal Serif Publication',
    subtitle: 'Refined Newsreader Serif with Brick Terracotta Top Accent Bar',
    badge: 'Prestige',
    fontHeadline: "'Newsreader', 'Lora', serif",
    fontBody: "'Newsreader', 'Lora', serif",
    fontMono: "'JetBrains Mono', monospace",
    defaultRatio: 'portrait'
  },
  acid_cobalt: {
    id: 'acid_cobalt',
    name: 'Cobalt & Acid Lime',
    subtitle: 'Deep Electric Cobalt Blue (#0B1A3D), High-Voltage Acid Lime (#E2F952) & SaaS Growth',
    badge: 'Growth SaaS',
    fontHeadline: "'Plus Jakarta Sans', 'Syne', sans-serif",
    fontBody: "'Plus Jakarta Sans', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    defaultRatio: 'portrait'
  },
  klowt_purple: {
    id: 'klowt_purple',
    name: 'Klowt Punch Purple',
    subtitle: 'Minimal Soft Off-White, Massive Heavy Sans, Tilted Lavender/Purple Punchbox & Multi-Handle Bar',
    badge: 'Viral Hook',
    fontHeadline: "'Plus Jakarta Sans', 'Inter', sans-serif",
    fontBody: "'Plus Jakarta Sans', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    defaultRatio: 'portrait'
  },
  monochrome_editorial: {
    id: 'monochrome_editorial',
    name: 'Monochrome Editorial & Asterisk',
    subtitle: 'Warm Fog White (#EBECE8) & Obsidian (#111), Giant Asterisk (*), Diagonal Diamond Frame & Pill Badges',
    badge: 'Editorial',
    fontHeadline: "'Plus Jakarta Sans', 'Inter', sans-serif",
    fontBody: "'Inter', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    defaultRatio: 'portrait'
  },
  forest_lime: {
    id: 'forest_lime',
    name: 'Forest Slate & Citrus Lime',
    subtitle: 'Deep Forest Pine/Slate (#142826) & Neon Lime (#CCF32F), Curved Star Vector & Timeline Week Circles',
    badge: 'Marketing',
    fontHeadline: "'Plus Jakarta Sans', 'Space Grotesk', sans-serif",
    fontBody: "'Plus Jakarta Sans', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    defaultRatio: 'portrait'
  }
};

/**
 * Escapes HTML helper
 */
function escape(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Formats text by escaping HTML while converting newlines (\n) and typed <br> tags
 * into explicit <br/> elements so users can change lines easily in the editor.
 */
function formatText(str) {
  if (!str) return '';
  let text = escape(str);
  text = text.replace(/&lt;br\s*\/?&gt;/gi, '<br/>');
  text = text.replace(/\r?\n/g, '<br/>');
  return text;
}

/**
 * Highlights a target word or phrase in the headline with a custom highlight style,
 * and preserves multi-line line breaks from textarea inputs or <br> tags.
 */
function formatHeadlineWithHighlight(headline, highlight, highlightStyle) {
  if (!headline) return '';
  let text = escape(headline);
  if (highlight) {
    const escapedWord = escape(highlight);
    const regex = new RegExp(`(${escapedWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    text = text.replace(regex, `<span style="${highlightStyle}">$1</span>`);
  }
  text = text.replace(/&lt;br\s*\/?&gt;/gi, '<br/>');
  text = text.replace(/\r?\n/g, '<br/>');
  return text;
}

/**
 * Generates horizontal progress indicators at bottom
 */
function renderProgressDots(currentIndex, totalCount, activeColor, inactiveColor) {
  let html = `<div style="display:flex;gap:12px;align-items:center;">`;
  for (let i = 0; i < totalCount; i++) {
    const isActive = i === currentIndex;
    const width = isActive ? '48px' : '14px';
    const color = isActive ? activeColor : inactiveColor;
    html += `<div style="width:${width};height:8px;background:${color};border-radius:4px;transition:all 0.2s ease;"></div>`;
  }
  html += `</div>`;
  return html;
}

// =========================================================================
// 1. KILN NEOBRUTALIST GOLD (ALL-CREAM PAPER, NO BLACK BG)
// =========================================================================
function renderKilnNeobrutalist(slide, theme, w, h, currentIndex, totalCount, handle) {
  const stepNum = slide.stepNumber || String(currentIndex + 1).padStart(2, '0');
  const isLastSlide = (currentIndex === totalCount - 1) || (slide.type === 'cta');
  let inner = '';

  if (slide.type === 'hook') {
    const formattedTitle = formatHeadlineWithHighlight(
      slide.headline,
      slide.highlight_word || 'rewriting',
      'background:#E8B923;padding:2px 14px;border:3px solid #111;display:inline;box-decoration-break:clone;-webkit-box-decoration-break:clone;box-shadow:4px 4px 0 #111;'
    );
    inner = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="background:#E8B923;border:4px solid #111;box-shadow:6px 6px 0 #111;padding:12px 28px;font-size:24px;font-weight:700;color:#111;text-transform:uppercase;letter-spacing:1px;">
          ${escape(slide.badge || 'VERIFIED RESEARCH')}
        </div>
        <div style="font-family:${theme.fontMono};font-size:22px;font-weight:700;color:#555;">
          01 / ${String(totalCount).padStart(2, '0')}
        </div>
      </div>
      <div style="margin:auto 0;">
        <div style="font-size:74px;font-weight:800;color:#111;line-height:1.15;letter-spacing:-1.5px;margin-bottom:32px;word-break:break-word;overflow-wrap:break-word;">
          ${formattedTitle}
        </div>
        <div style="font-size:32px;color:#333;line-height:1.45;font-weight:500;border-left:8px solid #E8B923;padding-left:24px;background:#FFF;padding:24px 28px;border:4px solid #111;box-shadow:8px 8px 0 #111;word-break:break-word;overflow-wrap:break-word;">
          ${formatText(slide.body || 'Autonomous 4-Agent consensus loop fact-checked across multiple independent publishers.')}
        </div>
      </div>
    `;
  } else if (slide.type === 'step') {
    inner = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="border:4px solid #111;background:#E8B923;box-shadow:5px 5px 0 #111;padding:10px 26px;font-size:22px;font-weight:700;color:#111;text-transform:uppercase;letter-spacing:1px;">
          ${formatText(slide.badge || 'TAKEAWAY ' + stepNum)}
        </div>
        <div style="font-family:${theme.fontMono};font-size:22px;color:#555;font-weight:700;">
          STEP ${stepNum}
        </div>
      </div>
      <div style="margin:auto 0;">
        <div style="font-size:66px;font-weight:800;color:#111;line-height:1.2;margin-bottom:28px;word-break:break-word;overflow-wrap:break-word;">
          ${formatText(slide.headline)}
        </div>
        <div style="background:#FFFFFF;border:4px solid #111;box-shadow:10px 10px 0 #111;padding:36px;font-size:32px;color:#222;line-height:1.5;font-weight:500;word-break:break-word;overflow-wrap:break-word;">
          ${formatText(slide.body || "Coordinated specialized agents accomplish complex reasoning in fewer turns.")}
        </div>
      </div>
    `;
  } else if (slide.type === 'source') {
    inner = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="background:#111;color:#E8B923;padding:10px 24px;font-size:22px;font-weight:700;letter-spacing:1.5px;border:3px solid #111;">
          ${formatText(slide.badge || 'PRIMARY EVIDENCE')}
        </div>
        <div style="font-size:22px;font-family:${theme.fontMono};color:#555;font-weight:700;">
          ${stepNum} / ${String(totalCount).padStart(2, '0')}
        </div>
      </div>
      <div style="margin:auto 0;">
        <div style="font-size:56px;font-weight:800;color:#111;line-height:1.2;margin-bottom:32px;word-break:break-word;overflow-wrap:break-word;">
          ${formatText(slide.headline)}
        </div>
        <div style="background:#FFFFFF;border:4px solid #111;box-shadow:12px 12px 0 #111;padding:36px;margin-bottom:32px;">
          <div style="font-family:${theme.fontMono};font-size:22px;color:#2F5C2A;font-weight:800;margin-bottom:14px;background:#DDE9D8;display:inline-block;padding:4px 14px;border:2px solid #2F5C2A;">
            ● ${escape(slide.domain || 'theeconomictimes.com')}
          </div>
          <div style="font-size:32px;color:#111;line-height:1.45;font-weight:600;font-style:italic;word-break:break-word;overflow-wrap:break-word;">
            ${formatText(slide.quote || '"Astra prices 30% below Claude Fable 5.1 per 1K tokens"')}
          </div>
        </div>
        <div style="display:inline-flex;align-items:center;gap:12px;font-size:22px;font-weight:700;color:#111;background:#E8B923;border:3px solid #111;box-shadow:5px 5px 0 #111;padding:12px 24px;">
          <span>✓</span> ${formatText(slide.verificationNote || 'cross-checked across 2 independent outlets')}
        </div>
      </div>
    `;
  } else if (slide.type === 'metric') {
    inner = `
      <div style="width:100%;display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:24px;font-weight:800;color:#111;background:#E8B923;border:3px solid #111;box-shadow:5px 5px 0 #111;padding:10px 24px;letter-spacing:1px;">
          ${formatText(slide.badge || 'KEY BENCHMARK')}
        </div>
        <div style="font-family:${theme.fontMono};font-size:22px;color:#555;font-weight:700;">
          ${stepNum}
        </div>
      </div>
      <div style="margin:auto 0;display:flex;flex-direction:column;align-items:center;text-align:center;">
        <div style="font-size:160px;font-weight:900;color:#111;line-height:0.95;letter-spacing:-4px;text-shadow:6px 6px 0 #E8B923;">
          ${escape(slide.metricValue || '19')}
        </div>
        <div style="font-size:32px;font-weight:900;color:#111;letter-spacing:4px;margin-top:16px;background:#E8B923;padding:6px 24px;border:3px solid #111;box-shadow:5px 5px 0 #111;word-break:break-word;overflow-wrap:break-word;">
          ${formatText(slide.metricLabel || 'POINT REASONING GAP')}
        </div>
        <div style="width:120px;height:8px;background:#111;margin:36px 0;"></div>
        <div style="font-size:42px;font-weight:700;color:#111;line-height:1.35;max-width:850px;word-break:break-word;overflow-wrap:break-word;">
          ${formatText(slide.headline)}
        </div>
      </div>
    `;
  } else {
    // CTA slide
    inner = `
      <div style="display:flex;flex-direction:column;align-items:center;text-align:center;margin:auto 0;max-width:850px;">
        <div style="width:100px;height:100px;border-radius:50%;background:#E8B923;border:4px solid #111;box-shadow:8px 8px 0 #111;display:flex;align-items:center;justify-content:center;margin-bottom:36px;">
          <span style="color:#111;font-size:48px;">💡</span>
        </div>
        <div style="font-size:58px;font-weight:900;color:#111;line-height:1.2;margin-bottom:24px;word-break:break-word;overflow-wrap:break-word;">
          ${formatText(slide.headline || 'Never publish unverified AI hype again')}
        </div>
        <div style="font-size:32px;color:#444;line-height:1.5;margin-bottom:44px;font-weight:500;word-break:break-word;overflow-wrap:break-word;">
          ${formatText(slide.body || 'Turn raw research into fact-checked, high-converting social assets with KILN Studio.')}
        </div>
        <div style="background:#111;color:#F9F6EE;border:4px solid #111;box-shadow:8px 8px 0 #E8B923;padding:18px 48px;font-size:30px;font-weight:700;margin-bottom:18px;">
          ${escape(handle)}
        </div>
        <div style="font-size:24px;font-weight:800;color:#111;letter-spacing:1px;font-family:${theme.fontMono};">
          kiln-studioai.vercel.app
        </div>
      </div>
    `;
  }

  return `
    <div style="width:${w}px;height:${h}px;background:#F9F6EE;border:12px solid #111111;box-shadow:20px 20px 0 #111111;padding:80px;box-sizing:border-box;font-family:${theme.fontHeadline};display:flex;flex-direction:column;justify-content:space-between;position:relative;">
      ${inner}
      <div style="width:100%;display:flex;justify-content:space-between;align-items:center;padding-top:36px;border-top:4px solid #111;">
        ${renderProgressDots(currentIndex, totalCount, '#111111', '#D8D3C4')}
        <div style="display:flex;align-items:center;gap:18px;">
          <span style="font-size:26px;font-weight:800;color:#111;">${escape(handle)}</span>
          ${isLastSlide ? `<span style="font-size:20px;font-weight:800;color:#111;background:#E8B923;border:2px solid #111;padding:4px 14px;box-shadow:3px 3px 0 #111;letter-spacing:0.5px;">kiln-studioai.vercel.app</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

// =========================================================================
// 2. AURA GLOW & GLASS (from Screenshot 2026-09-10 131833.png)
// =========================================================================
function renderAuraGlass(slide, theme, w, h, currentIndex, totalCount, handle) {
  const isLastSlide = (currentIndex === totalCount - 1) || (slide.type === 'cta');

  if (slide.type === 'hook') {
    const hookLen = (slide.headline || '').length;
    const hookSize = hookLen > 55 ? '68px' : hookLen > 35 ? '76px' : '84px';
    return `
      <div style="width:${w}px;height:${h}px;background:#09090D;background-image:radial-gradient(circle at 80% 25%, rgba(240,85,25,0.70) 0%, transparent 55%), radial-gradient(circle at 15% 85%, rgba(180,50,15,0.40) 0%, transparent 50%);padding:84px;box-sizing:border-box;font-family:${theme.fontHeadline};display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;border:1px solid #1E1E28;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:22px;font-weight:700;color:#FFFFFF;letter-spacing:1px;">${escape(handle.replace('@',''))}</div>
            <div style="font-size:16px;color:#8E8E9E;">Founder / Creator</div>
          </div>
          <div style="font-size:28px;color:#8E8E9E;">↗</div>
        </div>

        <div style="margin:auto 0;max-width:920px;">
          <div style="font-size:${hookSize};font-weight:700;color:#FFFFFF;line-height:1.18;letter-spacing:-1px;word-break:break-word;overflow-wrap:break-word;">
            ${formatHeadlineWithHighlight(
              slide.headline,
              slide.highlight_word || 'Weak',
              'display:inline;padding:4px 20px;border-radius:16px;background:rgba(255,255,255,0.18);border:2px solid rgba(255,255,255,0.35);color:#FFF;box-decoration-break:clone;-webkit-box-decoration-break:clone;'
            )}
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="display:inline-flex;align-items:center;gap:18px;background:#FF5722;color:#FFFFFF;padding:18px 44px;border-radius:999px;font-size:32px;font-weight:700;box-shadow:0 16px 36px rgba(255,87,34,0.45);">
            <span>${formatText(slide.badge || 'Fix it Like this')}</span>
            <div style="width:44px;height:44px;border-radius:50%;background:#FFFFFF;color:#FF5722;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;">→</div>
          </div>
          ${isLastSlide ? `<div style="font-size:22px;color:#FF7A3D;font-weight:700;font-family:${theme.fontMono};">kiln-studioai.vercel.app</div>` : ''}
        </div>
      </div>
    `;
  } else if (slide.type === 'statement') {
    const headlineLen = (slide.headline || '').length;
    const headlineSize = headlineLen > 55 ? '56px' : headlineLen > 35 ? '64px' : '72px';
    return `
      <div style="width:${w}px;height:${h}px;background:#F9F7F4;background-image:radial-gradient(circle at 10% 85%, rgba(240,110,50,0.35) 0%, transparent 55%), radial-gradient(circle at 85% 15%, rgba(240,140,80,0.15) 0%, transparent 45%);padding:84px;box-sizing:border-box;font-family:${theme.fontHeadline};display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;border:1px solid #EBE4DA;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:22px;font-weight:700;color:#222;letter-spacing:1px;">${escape(handle.replace('@',''))}</div>
            <div style="font-size:16px;color:#888;">Founder / Creator</div>
          </div>
          <div style="font-size:28px;color:#888;">↗</div>
        </div>

        <div style="margin:auto 0;max-width:880px;">
          <div style="font-size:${headlineSize};font-weight:600;color:#18181B;line-height:1.2;letter-spacing:-1px;word-break:break-word;overflow-wrap:break-word;">
            ${formatHeadlineWithHighlight(
              slide.headline,
              slide.highlight_word || 'product',
              'font-style:italic;color:#E65100;'
            )}
          </div>
          ${slide.body ? `<div style="font-size:32px;color:#555;line-height:1.55;margin-top:32px;font-weight:400;word-break:break-word;overflow-wrap:break-word;">${formatText(slide.body)}</div>` : ''}
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid #E2D9CC;padding-top:28px;">
          <div style="display:flex;align-items:center;gap:16px;">
            <div style="font-size:22px;color:#777;font-weight:600;">${escape(handle)}</div>
            ${isLastSlide ? `<div style="font-size:20px;color:#E65100;font-weight:700;">kiln-studioai.vercel.app</div>` : ''}
          </div>
          <div style="font-size:22px;color:#999;">${currentIndex + 1} / ${totalCount}</div>
        </div>
      </div>
    `;
  } else if (slide.type === 'cta') {
    return `
      <div style="width:${w}px;height:${h}px;background:#FFFFFF;background-image:radial-gradient(circle at 50% 85%, rgba(240,110,50,0.45) 0%, transparent 60%);padding:84px;box-sizing:border-box;font-family:${theme.fontHeadline};display:flex;flex-direction:column;justify-content:space-between;align-items:center;text-align:center;position:relative;overflow:hidden;border:1px solid #EAEAEA;">
        <div style="width:100%;display:flex;justify-content:space-between;align-items:center;">
          <div style="text-align:left;">
            <div style="font-size:22px;font-weight:700;color:#222;">${escape(handle.replace('@',''))}</div>
            <div style="font-size:16px;color:#888;">Founder / Creator</div>
          </div>
          <div style="font-size:28px;color:#888;">↗</div>
        </div>

        <div style="margin:auto 0;display:flex;flex-direction:column;align-items:center;">
          <div style="font-size:36px;font-weight:600;color:#444;margin-bottom:12px;letter-spacing:1px;">
            ${formatText(slide.badge || 'DM')}
          </div>
          <div style="font-size:130px;font-weight:900;color:#111111;line-height:0.95;letter-spacing:-3px;margin-bottom:28px;word-break:break-word;overflow-wrap:break-word;">
            ${formatText(slide.headline || 'OFFER')}
          </div>
          <div style="font-size:34px;color:#333333;line-height:1.45;font-weight:500;max-width:720px;margin-bottom:24px;word-break:break-word;overflow-wrap:break-word;">
            ${formatText(slide.body || "and I'll send you my free offer framework")}
          </div>

          <div style="display:inline-block;background:#111;color:#FFF;padding:12px 32px;border-radius:999px;font-size:22px;font-weight:700;margin-bottom:32px;letter-spacing:0.5px;">
            kiln-studioai.vercel.app
          </div>

          <div style="width:54px;height:54px;border-radius:50%;border:2px solid #222;display:flex;align-items:center;justify-content:center;">
            <div style="width:18px;height:18px;border-radius:50%;background:#111;"></div>
          </div>
        </div>

        <div style="width:100%;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #EBEBEB;padding-top:24px;">
          <div style="display:flex;align-items:center;gap:16px;">
            <div style="font-size:22px;color:#777;">${escape(handle)}</div>
            <div style="font-size:20px;color:#FF5722;font-weight:700;">kiln-studioai.vercel.app</div>
          </div>
          <div style="font-size:22px;color:#999;">${currentIndex + 1} / ${totalCount}</div>
        </div>
      </div>
    `;
  } else {
    // Frosted Glass Folder Tab Card with Genuine Glassmorphism & Responsive Text Fitting
    const headlineLen = (slide.headline || '').length;
    const headlineSize = headlineLen > 65 ? '46px' : headlineLen > 40 ? '54px' : '62px';
    const formattedHeadline = slide.highlight_word ? formatHeadlineWithHighlight(
      slide.headline,
      slide.highlight_word,
      'display:inline;padding:2px 14px;border-radius:12px;background:rgba(255,255,255,0.18);border:1.5px solid rgba(255,255,255,0.35);color:#FFF;box-decoration-break:clone;-webkit-box-decoration-break:clone;'
    ) : formatText(slide.headline);

    return `
      <div style="width:${w}px;height:${h}px;background:#09090D;background-image:radial-gradient(circle at 85% 18%, rgba(240,90,30,0.72) 0%, transparent 60%), radial-gradient(circle at 15% 82%, rgba(190,60,20,0.40) 0%, transparent 55%);padding:84px;box-sizing:border-box;font-family:${theme.fontHeadline};display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;border:1px solid #1E1E28;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:22px;font-weight:700;color:#FFFFFF;letter-spacing:1px;">${escape(handle.replace('@',''))}</div>
            <div style="font-size:16px;color:#8E8E9E;">Founder / Creator</div>
          </div>
          <div style="font-size:28px;color:#8E8E9E;">↗</div>
        </div>

        <div style="margin:auto 0;display:flex;flex-direction:column;align-items:flex-start;width:100%;">
          <!-- Frosted Glass Folder Tab -->
          <div style="display:inline-block;background:linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 100%), rgba(28,28,38,0.55);backdrop-filter:blur(28px) saturate(180%);-webkit-backdrop-filter:blur(28px) saturate(180%);border:1.5px solid rgba(255,255,255,0.22);border-bottom:none;border-radius:24px 24px 0 0;padding:12px 34px;color:#FF7A3D;font-size:22px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:-1.5px;z-index:2;position:relative;box-shadow:inset 0 1px 0 rgba(255,255,255,0.35);">
            ${formatText(slide.badge || 'STEP 0' + (currentIndex + 1))}
          </div>

          <!-- Frosted Glass Card Body -->
          <div style="width:100%;box-sizing:border-box;background:linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 100%), rgba(18,18,26,0.48);backdrop-filter:blur(32px) saturate(190%);-webkit-backdrop-filter:blur(32px) saturate(190%);border:1.5px solid rgba(255,255,255,0.18);border-radius:0 32px 32px 32px;padding:48px 46px;box-shadow:0 30px 60px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 0 24px rgba(255,255,255,0.02);">
            <div style="font-size:${headlineSize};font-weight:700;color:#FFFFFF;line-height:1.24;margin-bottom:24px;letter-spacing:-0.5px;word-break:break-word;overflow-wrap:break-word;">
              ${formattedHeadline}
            </div>

            <div style="font-size:28px;color:#D4D6E4;line-height:1.55;font-weight:400;word-break:break-word;overflow-wrap:break-word;">
              ${formatText(slide.body || 'Solve painful problem clearly. Make it sound like a no-brainer.')}
            </div>
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,0.15);padding-top:28px;">
          <div style="font-size:24px;color:#FF7A3D;font-weight:700;">${isLastSlide ? 'kiln-studioai.vercel.app' : 'Fix it Like this →'}</div>
          <div style="font-size:22px;color:#8E8E9E;">${currentIndex + 1} / ${totalCount}</div>
        </div>
      </div>
    `;
  }
}

// =========================================================================
// 3. LINKEDIN AUTHORITY (100% ENGLISH, RED BRACKETS, SHADOW CARDS)
// =========================================================================
function renderLinkedInAuthority(slide, theme, w, h, currentIndex, totalCount, handle) {
  const stepNum = slide.stepNumber || String(currentIndex + 1);
  const watermarkText = escape(slide.watermark || (currentIndex % 2 === 0 ? 'RESULTS' : 'AUTHORITY'));
  const isLastSlide = (currentIndex === totalCount - 1) || (slide.type === 'cta');

  if (slide.type === 'hook') {
    return `
      <div style="width:${w}px;height:${h}px;background:#FFFFFF;padding:84px;box-sizing:border-box;font-family:${theme.fontHeadline};display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;border:1px solid #ECECEC;">
        <!-- Left Notebook Perforation notches -->
        <div style="position:absolute;left:0;top:0;bottom:0;width:24px;background-image:radial-gradient(#D6D6D6 32%, transparent 35%);background-position:-12px 24px;background-size:24px 44px;background-repeat:repeat-y;"></div>

        <div style="display:flex;align-items:center;gap:16px;margin-left:16px;">
          <div style="width:52px;height:52px;background:#0077B5;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#FFFFFF;font-size:32px;font-weight:900;">
            in
          </div>
        </div>

        <div style="margin:auto 0;margin-left:16px;max-width:920px;">
          <div style="font-size:86px;font-weight:900;color:#E53935;line-height:1.05;margin-bottom:18px;text-transform:uppercase;letter-spacing:-1px;">
            ${escape(slide.badge || '9 MISTAKES')}
          </div>
          <div style="font-size:62px;font-weight:900;color:#111111;line-height:1.15;text-transform:uppercase;letter-spacing:-1px;margin-bottom:32px;">
            ${escape(slide.headline || 'THAT BLOCK YOUR LINKEDIN PROFILE FROM B2B SALES')}
          </div>
          <div style="font-size:42px;color:#E53935;font-weight:900;">→</div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-left:16px;border-top:2px solid #F0F0F0;padding-top:28px;">
          <div style="display:flex;align-items:center;gap:16px;">
            <div style="width:48px;height:48px;border-radius:50%;background:#E53935;color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:22px;">
              K
            </div>
            <div style="font-size:24px;font-weight:700;color:#111;">${escape(handle)}</div>
          </div>
          ${isLastSlide ? `<div style="font-size:20px;font-weight:800;color:#E53935;">kiln-studioai.vercel.app</div>` : ''}
        </div>
      </div>
    `;
  }

  if (slide.type === 'question_cards' || slide.type === 'cards') {
    return `
      <div style="width:${w}px;height:${h}px;background:#FFFFFF;padding:84px;box-sizing:border-box;font-family:${theme.fontHeadline};display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;border:1px solid #ECECEC;">
        <!-- Tilted pink stamp behind cards -->
        <div style="position:absolute;top:60px;right:60px;transform:rotate(12deg);background:#FCE4EC;color:#E53935;padding:8px 28px;border-radius:999px;font-size:24px;font-weight:800;letter-spacing:1px;opacity:0.9;">
          ${escape(slide.stamp || 'VALUE')}
        </div>

        <div style="text-align:center;">
          <div style="font-size:52px;font-weight:900;color:#E53935;letter-spacing:1px;">
            [${stepNum}]
          </div>
        </div>

        <div style="margin:auto 0;text-align:center;display:flex;flex-direction:column;align-items:center;">
          <div style="font-size:56px;font-weight:900;color:#111111;line-height:1.15;text-transform:uppercase;max-width:880px;margin-bottom:20px;">
            ${escape(slide.headline)}
          </div>

          <div style="font-size:28px;font-weight:700;color:#E53935;margin-bottom:44px;">
            ${escape(slide.subline || 'Doesn’t answer key buyer questions:')}
          </div>

          <div style="display:flex;gap:28px;width:100%;max-width:920px;justify-content:center;">
            <div style="flex:1;background:#FFFFFF;border:1.5px solid #EBEBEB;box-shadow:0 16px 36px rgba(0,0,0,0.07);border-radius:18px;padding:36px 28px;font-size:28px;font-weight:700;color:#111;line-height:1.35;text-align:center;">
              ${escape(slide.card1 || '«Why should I reach out to you specifically?»')}
            </div>
            <div style="flex:1;background:#FFFFFF;border:1.5px solid #EBEBEB;box-shadow:0 16px 36px rgba(0,0,0,0.07);border-radius:18px;padding:36px 28px;font-size:28px;font-weight:700;color:#111;line-height:1.35;text-align:center;">
              ${escape(slide.card2 || '«What exact business problem do you solve?»')}
            </div>
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;border-top:2px solid #F0F0F0;padding-top:24px;">
          <div style="display:flex;align-items:center;gap:16px;">
            <div style="font-size:22px;color:#777;font-weight:600;">${escape(handle)}</div>
            ${isLastSlide ? `<div style="font-size:20px;color:#E53935;font-weight:700;">kiln-studioai.vercel.app</div>` : ''}
          </div>
          <div style="font-size:22px;color:#E53935;font-weight:800;">${currentIndex + 1} / ${totalCount}</div>
        </div>
      </div>
    `;
  }

  // Standard LinkedIn Step with Giant Watermark
  return `
    <div style="width:${w}px;height:${h}px;background:#FFFFFF;padding:84px;box-sizing:border-box;font-family:${theme.fontHeadline};display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;border:1px solid #ECECEC;">
      <!-- Giant Background Watermark Text -->
      <div style="position:absolute;bottom:100px;left:-20px;right:-20px;text-align:center;font-size:160px;font-weight:900;color:rgba(0,0,0,0.035);letter-spacing:6px;pointer-events:none;user-select:none;">
        ${watermarkText}
      </div>

      <div>
        <div style="font-size:52px;font-weight:900;color:#E53935;letter-spacing:1px;margin-bottom:16px;">
          [${stepNum}]
        </div>
      </div>

      <div style="margin:auto 0;position:relative;max-width:920px;">
        <div style="font-size:58px;font-weight:900;color:#111111;line-height:1.15;text-transform:uppercase;letter-spacing:-0.5px;margin-bottom:24px;">
          ${escape(slide.headline)}
        </div>

        ${slide.highlight_word ? `
          <div style="background:#E53935;color:#FFFFFF;padding:12px 28px;border-radius:4px;font-size:28px;font-weight:800;display:inline-block;margin-bottom:28px;">
            ${escape(slide.highlight_word)}
          </div>
        ` : ''}

        <div style="background:#FFFFFF;border:1.5px solid #ECECEC;box-shadow:0 16px 36px rgba(0,0,0,0.06);border-radius:18px;padding:36px;margin-top:16px;">
          <div style="font-size:32px;color:#2B2B2B;line-height:1.5;font-weight:500;">
            ${escape(slide.body || 'Add tangible proof metrics and client case studies to anchor credibility.')}
          </div>
        </div>
      </div>

      <div style="position:relative;display:flex;justify-content:space-between;align-items:center;border-top:2px solid #F0F0F0;padding-top:28px;">
        <div style="display:flex;align-items:center;gap:14px;">
          <div style="width:40px;height:40px;border-radius:50%;background:#E53935;color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:20px;">
            K
          </div>
          <span style="font-size:22px;font-weight:700;color:#111;">${escape(handle)}</span>
        </div>
        <div style="font-size:22px;font-weight:800;color:#E53935;display:flex;align-items:center;gap:8px;">
          ${isLastSlide ? '<span>kiln-studioai.vercel.app</span>' : '<span>SWIPE</span> <span>→</span>'}
        </div>
      </div>
    </div>
  `;
}

// =========================================================================
// 4. BOLD KINETIC CONDENSED VIRAL (from Screenshot 2026-09-10 131707.png)
// =========================================================================
function renderBoldCondensed(slide, theme, w, h, currentIndex, totalCount, handle) {
  const isLastSlide = (currentIndex === totalCount - 1) || (slide.type === 'cta');
  const words = (slide.headline || 'WHAT I LEARNED FROM GOING VIRAL').split(' ');
  const styledWords = words.map((word, idx) => {
    const color = idx % 2 === 0 ? '#FF80AB' : '#FFFFFF';
    return `<span style="color:${color};">${escape(word)}</span>`;
  }).join(' ');

  return `
    <div style="width:${w}px;height:${h}px;background:#35315C;padding:84px;box-sizing:border-box;font-family:${theme.fontHeadline};display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid rgba(255,255,255,0.15);padding-bottom:24px;">
        <div style="font-family:${theme.fontBody};font-size:22px;font-weight:700;color:#FF80AB;letter-spacing:2px;text-transform:uppercase;">
          ${escape(handle.replace('@',''))}
        </div>
        <div style="font-family:${theme.fontMono};font-size:24px;font-weight:700;color:#FFFFFF;">
          ${currentIndex + 1}/${totalCount}
        </div>
      </div>

      <div style="margin:auto 0;max-width:940px;">
        <div style="font-size:96px;font-weight:900;line-height:1.02;text-transform:uppercase;letter-spacing:-1px;margin-bottom:36px;">
          ${styledWords}
        </div>

        <div style="font-family:${theme.fontBody};font-size:36px;color:#E0DDF0;line-height:1.5;font-weight:500;">
          ${escape(slide.body || "Posts don't go viral just for having cool designs. Rigorous cited claims drive real retention.")}
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;border-top:3px solid #FF80AB;padding-top:28px;">
        <div style="font-family:${theme.fontBody};font-size:26px;font-weight:700;color:#FFFFFF;">
          ${escape(handle)}
        </div>
        <div style="font-size:28px;color:#FF80AB;font-weight:900;letter-spacing:0.5px;">
          ${isLastSlide ? 'kiln-studioai.vercel.app' : 'SWIPE ➔'}
        </div>
      </div>
    </div>
  `;
}

// =========================================================================
// 5. RETRO PLAYFUL PILL STACK & CHAT (from Screenshot 2026-09-10 131649.png)
// =========================================================================
function renderRetroPillStack(slide, theme, w, h, currentIndex, totalCount, handle) {
  const isLastSlide = (currentIndex === totalCount - 1) || (slide.type === 'cta');

  if (slide.type === 'hook' || slide.type === 'pill_stack') {
    return `
      <div style="width:${w}px;height:${h}px;background:#FF4B26;padding:84px;box-sizing:border-box;font-family:${theme.fontHeadline};display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
        <div style="position:absolute;top:-60px;right:-60px;width:320px;height:320px;border-radius:50%;border:36px solid #FF7B5E;opacity:0.4;"></div>

        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:24px;font-weight:800;color:#FFFFFF;letter-spacing:1px;text-transform:uppercase;">
            ${escape(handle)}
          </div>
          <div style="font-family:${theme.fontMono};font-size:24px;font-weight:700;color:#FFE3DC;">
            01 / ${String(totalCount).padStart(2, '0')}
          </div>
        </div>

        <div style="margin:auto 0;display:flex;flex-direction:column;align-items:flex-start;gap:18px;">
          <div style="background:#FFFFFF;color:#FF4B26;font-size:52px;font-weight:900;padding:14px 44px;border-radius:999px;box-shadow:0 12px 24px rgba(0,0,0,0.18);transform:rotate(-2deg);">
            Mistakes I
          </div>
          <div style="background:#FFFFFF;color:#FF4B26;font-size:52px;font-weight:900;padding:14px 44px;border-radius:999px;box-shadow:0 12px 24px rgba(0,0,0,0.18);transform:rotate(1.5deg);">
            made in my
          </div>
          <div style="background:#FFFFFF;color:#111111;font-size:52px;font-weight:900;padding:14px 44px;border-radius:999px;box-shadow:0 12px 24px rgba(0,0,0,0.18);transform:rotate(-1deg);">
            [${escape(slide.headline || 'prompt engineering')}]
          </div>
          <div style="background:#FFFFFF;color:#FF4B26;font-size:52px;font-weight:900;padding:14px 44px;border-radius:999px;box-shadow:0 12px 24px rgba(0,0,0,0.18);transform:rotate(2deg);">
            but you don't
          </div>
          <div style="background:#FFFFFF;color:#FF4B26;font-size:52px;font-weight:900;padding:14px 44px;border-radius:999px;box-shadow:0 12px 24px rgba(0,0,0,0.18);transform:rotate(-1.5deg);">
            have to
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;border-top:2px solid rgba(255,255,255,0.3);padding-top:24px;color:#FFFFFF;font-size:24px;font-weight:700;">
          <span>START SWIPING →</span>
          <span>kiln-studioai.vercel.app</span>
        </div>
      </div>
    `;
  }

  if (slide.type === 'chat' || slide.type === 'chat_mockup') {
    return `
      <div style="width:${w}px;height:${h}px;background:#DDF3F8;padding:84px;box-sizing:border-box;font-family:${theme.fontHeadline};display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:24px;font-weight:800;color:#0F4A5A;">
            ${escape(handle)}
          </div>
          <div style="font-family:${theme.fontMono};font-size:22px;color:#3B7C8C;font-weight:700;">
            ${currentIndex + 1} / ${totalCount}
          </div>
        </div>

        <div style="margin:auto 0;display:flex;flex-direction:column;gap:24px;max-width:880px;">
          <div style="display:flex;align-items:flex-start;gap:16px;">
            <div style="width:48px;height:48px;border-radius:50%;background:#FF8A73;display:flex;align-items:center;justify-content:center;color:#FFF;font-weight:800;font-size:20px;">S</div>
            <div style="background:#FFFFFF;border-radius:24px 24px 24px 4px;padding:24px 32px;box-shadow:0 8px 20px rgba(0,0,0,0.06);max-width:700px;">
              <div style="font-size:18px;color:#888;margin-bottom:6px;font-weight:600;">Selina M. • 11:00 am</div>
              <div style="font-size:28px;font-weight:700;color:#111;">
                ${escape(slide.headline || 'How do I stop my LLM from hallucinating claims?')}
              </div>
            </div>
          </div>

          <div style="display:flex;align-items:flex-start;gap:16px;justify-content:flex-end;">
            <div style="background:#FFFFFF;border-radius:24px 24px 4px 24px;padding:28px 36px;box-shadow:0 8px 20px rgba(0,0,0,0.06);max-width:740px;">
              <div style="font-size:18px;color:#FF5722;margin-bottom:6px;font-weight:700;">Your answer @kilnstudio</div>
              <div style="font-size:28px;font-weight:500;color:#222;line-height:1.45;">
                ${escape(slide.body || 'Enforce multi-agent cross-verification before publishing. Never rely on a single unverified model response.')}
              </div>
            </div>
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid #C4E5EC;padding-top:24px;color:#2A6775;font-size:22px;font-weight:700;">
          <span>${isLastSlide ? 'Visit for full playbook' : 'Swipe for strategy breakdown'}</span>
          <span>kiln-studioai.vercel.app</span>
        </div>
      </div>
    `;
  }

  // Rainbow Retro Stripe Card
  return `
    <div style="width:${w}px;height:${h}px;background:#FAF8F5;padding:84px;box-sizing:border-box;font-family:${theme.fontHeadline};display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
      <div style="position:absolute;left:-40px;top:0;bottom:0;width:120px;display:flex;">
        <div style="width:24px;height:100%;background:#FF8A73;"></div>
        <div style="width:24px;height:100%;background:#7B61FF;"></div>
        <div style="width:24px;height:100%;background:#FF5B22;"></div>
        <div style="width:24px;height:100%;background:#E53935;"></div>
      </div>

      <div style="margin-left:80px;display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:24px;font-weight:800;color:#222;">${escape(handle)}</div>
        <div style="font-family:${theme.fontMono};font-size:22px;color:#888;">${currentIndex + 1} / ${totalCount}</div>
      </div>

      <div style="margin:auto 0;margin-left:80px;background:#FFFFFF;border:2px solid #EBE4D8;border-radius:24px;padding:52px;box-shadow:0 16px 36px rgba(0,0,0,0.06);max-width:820px;">
        <div style="font-size:48px;font-weight:800;color:#FF4B26;line-height:1.2;margin-bottom:28px;">
          ${escape(slide.headline)}
        </div>
        <div style="font-size:30px;color:#444;line-height:1.55;font-weight:500;">
          ${escape(slide.body || 'Always cross-verify quotes, facts, and quantitative data before publishing.')}
        </div>
      </div>

      <div style="margin-left:80px;display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid #E2D9CC;padding-top:24px;font-size:22px;color:#777;font-weight:600;">
        <span>${isLastSlide ? 'Get started today' : 'Swipe for next tip'}</span>
        <span>kiln-studioai.vercel.app</span>
      </div>
    </div>
  `;
}

// =========================================================================
// 6. BOHO ROADMAP (PER-SLIDE AUTHENTIC FLOW ARROWS FROM CANVA TEMPLATE)
// =========================================================================
function renderBohoRoadmap(slide, theme, w, h, currentIndex, totalCount, handle) {
  const stepNum = slide.stepNumber || String(currentIndex + 1);
  const isLastSlide = (currentIndex === totalCount - 1) || (slide.type === 'cta');

  // Per-slide authentic arrow graphic matching Instagram_LinkedIn Carousel _ Canva Template.jpeg
  let arrowSvg = '';

  if (currentIndex === 0) {
    // Slide 1 (Cover): No arrow. Red scribble underline under URL.
    arrowSvg = '';
  } else if (currentIndex === 1) {
    // Slide 2 (Intro): Giant looping U-turn curved line starting from headline and plunging downwards
    arrowSvg = `
      <svg style="position:absolute;top:280px;left:50%;transform:translateX(-50%);width:280px;height:520px;pointer-events:none;" viewBox="0 0 280 520" fill="none">
        <path d="M140 20 C 140 160, 240 280, 240 400 C 240 480, 40 480, 40 380 C 40 280, 140 200, 140 120" stroke="#1B1A19" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <path d="M125 140 L 140 120 L 155 140" stroke="#1B1A19" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  } else if (currentIndex === 2) {
    // Slide 3 (Step 1): Horizontal loop arrow in upper-left corner
    arrowSvg = `
      <svg style="position:absolute;top:160px;left:70px;width:240px;height:140px;pointer-events:none;" viewBox="0 0 240 140" fill="none">
        <path d="M15 70 C 15 15, 95 15, 95 70 C 95 125, 215 125, 215 70" stroke="#1B1A19" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <path d="M195 55 L 215 70 L 195 85" stroke="#1B1A19" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  } else if (currentIndex === 3) {
    // Slide 4 (Step 2): Flow arrow crossing across the bottom-left of card
    arrowSvg = `
      <svg style="position:absolute;bottom:140px;left:60px;width:180px;height:120px;pointer-events:none;" viewBox="0 0 180 120" fill="none">
        <path d="M15 105 Q 90 20 165 40" stroke="#1B1A19" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <path d="M145 30 L 165 40 L 155 60" stroke="#1B1A19" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  } else if (currentIndex === 4) {
    // Slide 5 (Step 3): Arrow tail entering from lower-left edge pointing up-right
    arrowSvg = `
      <svg style="position:absolute;bottom:180px;left:-5px;width:110px;height:90px;pointer-events:none;" viewBox="0 0 110 90" fill="none">
        <path d="M0 80 Q 50 45 95 25" stroke="#1B1A19" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      </svg>
    `;
  } else if (currentIndex === 5) {
    // Slide 6 (Step 4): Curved loop arrow starting in the middle and exiting the UPPER-RIGHT edge
    arrowSvg = `
      <svg style="position:absolute;top:280px;right:-15px;width:200px;height:130px;pointer-events:none;" viewBox="0 0 200 130" fill="none">
        <path d="M10 45 C 70 0, 125 110, 195 45" stroke="#1B1A19" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <path d="M175 35 L 195 45 L 185 62" stroke="#1B1A19" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  } else if (currentIndex === 6) {
    // Slide 7 (Step 5): Arrowhead entering horizontally from the left edge pointing right
    arrowSvg = `
      <svg style="position:absolute;top:280px;left:-5px;width:130px;height:40px;pointer-events:none;" viewBox="0 0 130 40" fill="none">
        <path d="M0 20 L 75 20" stroke="#1B1A19" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <path d="M60 8 L 75 20 L 60 32" stroke="#1B1A19" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }

  // Check slide content type
  if (slide.type === 'hook') {
    return `
      <div style="width:${w}px;height:${h}px;background:#F7F4EE;padding:84px;box-sizing:border-box;font-family:${theme.fontHeadline};display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;border:1px solid #EBE4D8;">
        <div style="font-family:${theme.fontBody};font-size:24px;font-weight:700;color:#E06D53;">
          ${escape(handle.replace('@',''))}
        </div>

        <div style="margin:auto 0;max-width:880px;">
          <div style="font-size:84px;font-weight:700;color:#1B1A19;line-height:1.15;letter-spacing:-1px;margin-bottom:24px;">
            ${escape(slide.headline || 'Step by Step Career Pivot')}
          </div>
          <div style="font-family:${theme.fontBody};font-size:32px;color:#6E685E;font-weight:400;line-height:1.5;">
            ${escape(slide.body || 'How to Successfully Switch Roles and Land High-Impact Opportunities')}
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid #E5DFD3;padding-top:24px;">
          <div style="font-family:${theme.fontBody};font-size:20px;color:#E06D53;font-weight:600;">kiln-studioai.vercel.app</div>
          <div style="font-family:${theme.fontBody};font-size:20px;color:#8E887E;">1 / ${totalCount}</div>
        </div>
      </div>
    `;
  }

  if (slide.type === 'insight' || slide.type === 'breakthrough') {
    return `
      <div style="width:${w}px;height:${h}px;background:#F7F4EE;padding:84px;box-sizing:border-box;font-family:${theme.fontHeadline};display:flex;flex-direction:column;justify-content:space-between;align-items:center;text-align:center;position:relative;overflow:hidden;border:1px solid #EBE4D8;">
        <div style="width:100%;text-align:left;font-family:${theme.fontBody};font-size:24px;font-weight:700;color:#E06D53;">
          ${escape(handle.replace('@',''))}
        </div>

        <div style="margin:auto 0;display:flex;flex-direction:column;align-items:center;max-width:820px;">
          <!-- Hand-Drawn Radiant Coral Lightbulb -->
          <svg style="width:96px;height:96px;margin-bottom:32px;" viewBox="0 0 64 64" fill="none">
            <path d="M32 10 C 20 10, 14 20, 14 30 C 14 38, 22 44, 24 50 L 40 50 C 42 44, 50 38, 50 30 C 50 20, 44 10, 32 10 Z" stroke="#E06D53" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M26 56 L 38 56" stroke="#E06D53" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="32" y1="2" x2="32" y2="6" stroke="#E06D53" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="12" y1="12" x2="16" y2="16" stroke="#E06D53" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="52" y1="12" x2="48" y2="16" stroke="#E06D53" stroke-width="3.5" stroke-linecap="round"/>
          </svg>

          <div style="font-size:72px;font-weight:700;color:#1B1A19;line-height:1.2;margin-bottom:28px;">
            ${escape(slide.headline || 'Apply with Confidence')}
          </div>

          <div style="font-family:${theme.fontBody};font-size:32px;color:#5E574D;line-height:1.6;font-weight:400;">
            ${escape(slide.body || 'Tailor your resume for relevance. Highlight transferable skills. Showcase measurable results, not just passive responsibilities.')}
          </div>
        </div>

        <div style="width:100%;display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid #E5DFD3;padding-top:24px;">
          <div style="font-family:${theme.fontBody};font-size:20px;color:#E06D53;font-weight:600;">kiln-studioai.vercel.app</div>
          <div style="font-family:${theme.fontBody};font-size:20px;color:#8E887E;">${currentIndex + 1} / ${totalCount}</div>
        </div>
      </div>
    `;
  }

  // Step Slide with unique per-slide arrow
  return `
    <div style="width:${w}px;height:${h}px;background:#F7F4EE;padding:84px;box-sizing:border-box;font-family:${theme.fontHeadline};display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;border:1px solid #EBE4D8;">
      ${arrowSvg}

      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="font-family:${theme.fontBody};font-size:24px;font-weight:700;color:#E06D53;">
          ${escape(handle.replace('@',''))}
        </div>
      </div>

      <div style="margin:auto 0;max-width:860px;">
        <div style="font-size:56px;font-weight:700;color:#E06D53;margin-bottom:12px;">
          ${stepNum}
        </div>

        <div style="font-size:68px;font-weight:700;color:#1B1A19;line-height:1.2;margin-bottom:28px;">
          ${escape(slide.headline)}
        </div>

        <div style="font-family:${theme.fontBody};font-size:32px;color:#5E574D;line-height:1.6;font-weight:400;max-width:780px;">
          ${escape(slide.body || 'Define why you want to switch and identify what is missing in your current role.')}
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid #E5DFD3;padding-top:24px;">
        <div style="font-family:${theme.fontBody};font-size:20px;color:#E06D53;font-weight:600;">kiln-studioai.vercel.app</div>
        <div style="font-family:${theme.fontBody};font-size:20px;color:#8E887E;">${currentIndex + 1} / ${totalCount}</div>
      </div>
    </div>
  `;
}

// =========================================================================
// 7. MINIMAL SERIF PUBLICATION
// =========================================================================
function renderMinimalEditorial(slide, theme, w, h, currentIndex, totalCount, handle) {
  const isLastSlide = (currentIndex === totalCount - 1) || (slide.type === 'cta');

  return `
    <div style="width:${w}px;height:${h}px;background:#F7F5EF;border-top:16px solid #C4634A;padding:84px;box-sizing:border-box;font-family:${theme.fontHeadline};display:flex;flex-direction:column;justify-content:space-between;position:relative;border-left:1px solid #E3DFD5;border-right:1px solid #E3DFD5;border-bottom:1px solid #E3DFD5;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <div style="font-size:28px;font-weight:700;color:#C4634A;letter-spacing:0.5px;">Kiln Studio</div>
          <div style="font-size:20px;color:#8A8578;font-style:italic;margin-top:4px;">Verified Intelligence</div>
        </div>
        <div style="font-size:24px;color:#8A8578;font-family:${theme.fontMono};">
          ${String(currentIndex + 1).padStart(2, '0')} / ${String(totalCount).padStart(2, '0')}
        </div>
      </div>

      <div style="margin:auto 0;max-width:880px;">
        <div style="font-size:84px;font-weight:700;color:#C4634A;line-height:0.9;margin-bottom:20px;">
          ${currentIndex + 1}
        </div>
        <div style="font-size:64px;color:#211D17;line-height:1.25;margin-bottom:24px;font-weight:600;">
          ${escape(slide.headline)}
        </div>
        <div style="font-size:32px;color:#726657;line-height:1.6;font-style:italic;">
          ${escape(slide.body || 'Confirmed by a 2026 cross-vendor benchmark across frontier agent models.')}
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid #E3DFD5;padding-top:28px;">
        <div style="display:flex;align-items:center;gap:16px;">
          <div style="width:36px;height:36px;border-radius:50%;background:#E8935F;"></div>
          <div style="font-size:24px;color:#726657;font-weight:500;">${escape(handle)}</div>
        </div>
        <div style="font-size:24px;color:#C4634A;font-weight:600;">kiln-studioai.vercel.app</div>
      </div>
    </div>
  `;
}

// =========================================================================
// 8. ELECTRIC COBALT & ACID LIME (from user: high-energy SaaS growth)
// =========================================================================
function renderAcidCobalt(slide, theme, w, h, currentIndex, totalCount, handle) {
  const stepNum = slide.stepNumber || String(currentIndex + 1);
  const isLastSlide = (currentIndex === totalCount - 1) || (slide.type === 'cta');

  return `
    <div style="width:${w}px;height:${h}px;background:#0B1A3D;background-image:radial-gradient(circle at 85% 85%, rgba(226,249,82,0.18) 0%, transparent 55%), radial-gradient(circle at 15% 15%, rgba(0,102,255,0.25) 0%, transparent 50%);padding:84px;box-sizing:border-box;font-family:${theme.fontHeadline};display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;border:1px solid #182C5E;">
      <!-- Top Brand Strip -->
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="background:#E2F952;color:#0B1A3D;padding:8px 24px;font-weight:900;font-size:22px;letter-spacing:1px;text-transform:uppercase;">
          ${escape(slide.badge || 'GROWTH LEVER 0' + stepNum)}
        </div>
        <div style="font-size:28px;font-weight:900;color:#E2F952;">
          ${currentIndex + 1} / ${totalCount}
        </div>
      </div>

      <!-- Main Headline & White Card -->
      <div style="margin:auto 0;max-width:920px;">
        <div style="font-size:78px;font-weight:900;color:#FFFFFF;line-height:1.1;letter-spacing:-1px;margin-bottom:32px;text-transform:uppercase;">
          ${formatHeadlineWithHighlight(
            slide.headline,
            slide.highlight_word || '$10M',
            'background:#E2F952;color:#0B1A3D;padding:2px 14px;display:inline;box-decoration-break:clone;-webkit-box-decoration-break:clone;'
          )}
        </div>

        <div style="background:#FFFFFF;border-radius:18px;padding:44px;box-shadow:0 24px 48px rgba(0,0,0,0.35);">
          <div style="font-family:${theme.fontBody};font-size:32px;color:#0B1A3D;line-height:1.55;font-weight:600;">
            ${escape(slide.body || 'High-converting B2B funnels replace generic promises with verifiable data benchmarks.')}
          </div>
        </div>
      </div>

      <!-- High-Voltage Bottom Banner -->
      <div style="display:flex;justify-content:space-between;align-items:center;border-top:2px solid rgba(226,249,82,0.3);padding-top:28px;">
        <div style="font-family:${theme.fontBody};font-size:24px;font-weight:800;color:#FFFFFF;">
          ${escape(handle)}
        </div>
        <div style="background:#E2F952;color:#0B1A3D;font-weight:900;font-size:22px;padding:10px 28px;border-radius:999px;">
          ${isLastSlide ? 'kiln-studioai.vercel.app' : 'SWIPE FOR BLUEPRINT ➔'}
        </div>
      </div>
    </div>
  `;
}

// =========================================================================
// 9. KLOWT PUNCH PURPLE (from uploaded Image 1: "99% of people don't post on linkedin. do you?")
// =========================================================================
function renderKlowtPurple(slide, theme, w, h, currentIndex, totalCount, handle) {
  const stepNum = slide.stepNumber || String(currentIndex + 1);
  const isLastSlide = (currentIndex === totalCount - 1) || (slide.type === 'cta');

  return `
    <div style="width:${w}px;height:${h}px;background:#F8F9FD;background-image:radial-gradient(circle at 50% 60%, rgba(135,115,245,0.08) 0%, transparent 70%);padding:90px 80px;box-sizing:border-box;font-family:${theme.fontHeadline};display:flex;flex-direction:column;justify-content:space-between;position:relative;">
      
      <!-- Top Indicator -->
      <div style="display:flex;justify-content:flex-end;">
        <div style="font-family:${theme.fontMono};font-size:24px;font-weight:700;color:#949AB0;">
          0${currentIndex + 1} / 0${totalCount}
        </div>
      </div>

      <!-- Main Central Heavy Hook & Punchbox -->
      <div style="margin:auto 0;max-width:920px;">
        <div style="font-size:104px;font-weight:900;color:#0B0B0E;line-height:1.02;letter-spacing:-3.5px;margin-bottom:28px;">
          ${escape(slide.headline || "99% of people don't post on linkedin.")}
        </div>

        <!-- Tilted Violet/Purple Punchbox with Crisp Dark Border -->
        <div style="display:inline-block;transform:rotate(-1.8deg);background:#8B77EB;border:4px solid #0B0B0E;box-shadow:4px 6px 0 rgba(11,11,14,0.15);padding:14px 44px;margin-top:6px;">
          <span style="font-size:86px;font-weight:900;color:#FFFFFF;line-height:1;letter-spacing:-2px;display:inline-block;">
            ${escape(slide.highlight_word || slide.badge || 'do you?')}
          </span>
        </div>

        ${slide.body ? `
          <div style="margin-top:40px;font-family:${theme.fontBody};font-size:32px;color:#4A4E69;line-height:1.45;font-weight:500;max-width:800px;">
            ${escape(slide.body)}
          </div>
        ` : ''}
      </div>

      <!-- Bottom Triple Social Handle Bar (TikTok, Instagram, LinkedIn) -->
      <div style="display:flex;align-items:center;gap:36px;padding-top:32px;border-top:2px solid #E2E4EC;">
        <!-- TikTok pill -->
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:36px;height:36px;border-radius:50%;background:#FF004F;display:flex;align-items:center;justify-content:center;color:#FFF;font-size:18px;font-weight:900;">
            ♪
          </div>
          <span style="font-size:24px;font-weight:700;color:#18191F;">${escape(handle)}</span>
        </div>

        <!-- Instagram pill -->
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(45deg, #F09433, #E6683C, #DC2743, #CC2366, #BC1888);display:flex;align-items:center;justify-content:center;color:#FFF;font-size:18px;font-weight:900;">
            📷
          </div>
          <span style="font-size:24px;font-weight:700;color:#18191F;">${escape(handle)}</span>
        </div>

        <!-- LinkedIn pill -->
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:36px;height:36px;border-radius:8px;background:#0A66C2;display:flex;align-items:center;justify-content:center;color:#FFF;font-size:18px;font-weight:900;">
            in
          </div>
          <span style="font-size:24px;font-weight:700;color:#18191F;">${escape(handle.replace('@',''))}</span>
        </div>

        ${isLastSlide ? `<span style="margin-left:auto;font-size:22px;font-weight:800;color:#8B77EB;">kiln-studioai.vercel.app</span>` : ''}
      </div>

    </div>
  `;
}

// =========================================================================
// 10. MONOCHROME EDITORIAL & ASTERISK (from uploaded Image 2)
// =========================================================================
function renderMonochromeEditorial(slide, theme, w, h, currentIndex, totalCount, handle) {
  const isDark = (currentIndex % 2 === 1);
  const bg = isDark ? '#111113' : '#E8EAE6';
  const textColor = isDark ? '#FFFFFF' : '#111113';
  const subtextColor = isDark ? '#8A8D95' : '#6A6E75';
  const pillBorder = isDark ? 'rgba(255,255,255,0.25)' : '#111113';
  const pillBg = isDark ? 'rgba(255,255,255,0.06)' : '#E8EAE6';
  const isLastSlide = (currentIndex === totalCount - 1) || (slide.type === 'cta');

  return `
    <div style="width:${w}px;height:${h}px;background:${bg};padding:80px;box-sizing:border-box;font-family:${theme.fontHeadline};display:flex;flex-direction:column;justify-content:space-between;position:relative;">
      
      <!-- Top Brand Header: Logo * LogoName & Arrow Icon Button -->
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:32px;font-weight:900;color:${textColor};line-height:1;">✱</span>
          <span style="font-size:22px;font-weight:700;letter-spacing:1px;color:${textColor};text-transform:uppercase;">
            ${escape(handle.replace('@',''))}
          </span>
        </div>
        <div style="width:52px;height:52px;border-radius:50%;border:2px solid ${pillBorder};display:flex;align-items:center;justify-content:center;color:${textColor};font-size:24px;">
          ↙
        </div>
      </div>

      <!-- Center Dynamic Editorial Content -->
      <div style="margin:auto 0;max-width:920px;">
        ${currentIndex === 0 ? `
          <!-- Slide 1: Giant Asterisk + Let us be your compass -->
          <div style="font-size:160px;font-weight:900;color:${textColor};line-height:0.8;margin-bottom:36px;">
            ✱
          </div>
          <div style="font-size:80px;font-weight:500;color:${textColor};line-height:1.15;letter-spacing:-1.5px;margin-bottom:20px;">
            ${escape(slide.headline)}
          </div>
          <div style="font-size:44px;font-style:italic;color:${subtextColor};font-weight:400;">
            ${escape(slide.body || 'we create them')}
          </div>
        ` : currentIndex === 1 ? `
          <!-- Slide 2: Minimal Pill + Giant Stat Number 01 -->
          <div style="display:inline-block;padding:8px 24px;border-radius:999px;border:1.5px solid ${pillBorder};font-size:20px;font-weight:700;color:${textColor};margin-bottom:32px;letter-spacing:1px;">
            ${escape(slide.badge || 'AI & AUTOMATION')}
          </div>
          <div style="font-size:74px;font-weight:600;color:${textColor};line-height:1.15;letter-spacing:-1px;margin-bottom:48px;">
            ${escape(slide.headline)}
          </div>
          <div style="font-size:180px;font-weight:900;color:${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(17,17,19,0.12)'};line-height:0.8;margin-top:20px;">
            01
          </div>
        ` : `
          <!-- Generic Step Slide: Headline with Faded Ghost Secondary Line -->
          <div style="display:inline-block;padding:8px 24px;border-radius:999px;border:1.5px solid ${pillBorder};font-size:20px;font-weight:700;color:${textColor};margin-bottom:32px;letter-spacing:1px;">
            ${escape(slide.badge || 'GET TO KNOW US')}
          </div>
          <div style="font-size:72px;font-weight:600;color:${textColor};line-height:1.2;letter-spacing:-1px;margin-bottom:24px;">
            ${escape(slide.headline)}
          </div>
          ${slide.body ? `
            <div style="font-size:36px;color:${subtextColor};line-height:1.5;font-weight:400;">
              ${escape(slide.body)}
            </div>
          ` : ''}
        `}
      </div>

      <!-- Bottom Pill Footer -->
      <div style="display:flex;justify-content:space-between;align-items:center;padding-top:28px;">
        <div style="display:inline-block;padding:12px 32px;border-radius:999px;border:2px solid ${pillBorder};background:${pillBg};font-size:20px;font-weight:800;color:${textColor};letter-spacing:1.5px;text-transform:uppercase;">
          ${isLastSlide ? 'kiln-studioai.vercel.app' : 'GET TO KNOW US'}
        </div>
        <div style="font-family:${theme.fontMono};font-size:22px;color:${subtextColor};font-weight:700;">
          ${currentIndex + 1} / ${totalCount}
        </div>
      </div>

    </div>
  `;
}

// =========================================================================
// 11. FOREST SLATE & CITRUS LIME (from uploaded Image 3)
// =========================================================================
function renderForestLime(slide, theme, w, h, currentIndex, totalCount, handle) {
  const stepNum = slide.stepNumber || String(currentIndex + 1).padStart(2, '0');
  const isLastSlide = (currentIndex === totalCount - 1) || (slide.type === 'cta');

  return `
    <div style="width:${w}px;height:${h}px;background:#132523;padding:84px;box-sizing:border-box;font-family:${theme.fontHeadline};display:flex;flex-direction:column;justify-content:space-between;position:relative;border:1px solid #1E3835;">
      
      <!-- Top Step Header: Huge Step Number (01) & Check Circle -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div style="font-size:110px;font-weight:900;color:#CCF32F;line-height:0.9;letter-spacing:-2px;">
          ${stepNum}
        </div>
        <div style="width:56px;height:56px;border-radius:50%;border:2px solid rgba(204,243,47,0.4);display:flex;align-items:center;justify-content:center;color:#CCF32F;font-size:26px;">
          ✓
        </div>
      </div>

      <!-- Central Punchy Copy & Underline Accents -->
      <div style="margin:auto 0;max-width:900px;">
        ${currentIndex === 0 ? `
          <!-- Hook Slide with Star & Arc -->
          <div style="font-size:80px;font-weight:800;color:#FFFFFF;line-height:1.15;letter-spacing:-1px;margin-bottom:24px;">
            The future of marketing is <span style="color:#CCF32F;">human</span>
          </div>
          <!-- Decorative Hand-Drawn Arc with Star -->
          <div style="margin:36px 0;">
            <svg width="400" height="70" viewBox="0 0 400 70" fill="none">
              <path d="M10 60 Q 200 65 360 20" stroke="#CCF32F" stroke-width="3" stroke-linecap="round" fill="none" />
              <polygon points="360,20 375,18 365,28" fill="#CCF32F" />
            </svg>
          </div>
          <div style="font-size:32px;color:#8FA8A3;line-height:1.5;font-weight:500;">
            ${escape(slide.body || 'We are moving from clicks to real connection. From impressions to impact.')}
          </div>
        ` : `
          <!-- Step Slide -->
          <div style="font-size:74px;font-weight:800;color:#FFFFFF;line-height:1.15;letter-spacing:-1px;margin-bottom:28px;">
            ${escape(slide.headline)}
          </div>
          <div style="font-size:34px;color:#8FA8A3;line-height:1.55;font-weight:400;">
            ${escape(slide.body || 'We create experiences worth remembering. Not just another algorithm chase.')}
          </div>
        `}
      </div>

      <!-- Bottom Progress Ticks -->
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div style="display:flex;gap:12px;align-items:center;">
          <div style="width:80px;height:4px;background:#CCF32F;border-radius:2px;"></div>
          <div style="width:80px;height:4px;background:rgba(204,243,47,0.3);border-radius:2px;"></div>
          <div style="width:80px;height:4px;background:rgba(204,243,47,0.3);border-radius:2px;"></div>
          <div style="width:80px;height:4px;background:rgba(204,243,47,0.3);border-radius:2px;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="display:flex;align-items:center;gap:18px;">
            <div style="font-size:22px;color:#8FA8A3;font-weight:600;">${escape(handle)}</div>
            ${isLastSlide ? `<div style="font-size:20px;color:#CCF32F;font-weight:700;letter-spacing:0.5px;">kiln-studioai.vercel.app</div>` : ''}
          </div>
          <div style="font-size:20px;color:#CCF32F;font-weight:700;letter-spacing:1px;">0${currentIndex + 1} / 0${totalCount}</div>
        </div>
      </div>

    </div>
  `;
}
// =========================================================================
// PRE-MADE REFERENCE DECKS
// =========================================================================

// 1. GPT-6 Astra Breakdown (KILN Neobrutalist Gold - ALL CREAM)
export const DEFAULT_SLIDES = [
  {
    id: 's1',
    type: 'hook',
    badge: '4 VERIFIED TAKEAWAYS',
    headline: 'GPT-6 Astra is silently rewriting agent economics',
    highlight_word: 'rewriting',
    body: 'Autonomous 4-Agent consensus loop fact-checked across multiple independent publishers.',
    stepNumber: '01'
  },
  {
    id: 's2',
    type: 'step',
    badge: 'TAKEAWAY 01',
    headline: 'Multi-agent orchestration drops token costs by 42%',
    body: 'Coordinated specialized agents accomplish complex reasoning in fewer turns than monolithic models.',
    stepNumber: '02'
  },
  {
    id: 's3',
    type: 'source',
    badge: 'PRIMARY EVIDENCE',
    headline: 'Frontier model pricing verified across publishers',
    domain: 'theeconomictimes.com',
    quote: '"Astra pricing lands 30% below Claude Fable 5.1 per 1K output tokens across enterprise deployments."',
    verificationNote: 'cross-checked against 2 independent tech outlets',
    stepNumber: '03'
  },
  {
    id: 's4',
    type: 'metric',
    badge: 'KEY BENCHMARK',
    metricValue: '19',
    metricLabel: 'POINT REASONING GAP',
    headline: 'Astra leads GSM8K multi-step reasoning benchmarks over prior flagship generations',
    stepNumber: '04'
  },
  {
    id: 's5',
    type: 'cta',
    badge: 'BUILD WITH KILN',
    headline: 'Never publish unverified AI hype again',
    body: 'Turn raw research into fact-checked, high-converting social assets with KILN Autonomous Studio.',
    handle: '@kilnstudio',
    stepNumber: '05'
  }
];

// 2. Aura Offer Blueprint (from Screenshot 2026-09-10 131833.png)
export const AURA_OFFER_SLIDES = [
  {
    id: 'aura-1',
    type: 'hook',
    badge: 'Fix it Like this',
    headline: 'Your Offer is too Weak',
    highlight_word: 'Weak',
    body: 'Solve painful problems clearly. Verified multi-agent consensus before publication.',
    stepNumber: '01'
  },
  {
    id: 'aura-2',
    type: 'statement',
    badge: 'CORE SHIFT',
    headline: "Most people don't have a product problem — they have an offer problem",
    highlight_word: 'product',
    body: 'When your value proposition is vague, even a world-class product fails to sell.',
    stepNumber: '02'
  },
  {
    id: 'aura-3',
    type: 'step',
    badge: 'Step 01',
    headline: 'Solve painful problem clearly',
    body: 'Vague promises kill conversion. Name the exact bottleneck keeping your client awake at 2 AM.',
    stepNumber: '03'
  },
  {
    id: 'aura-4',
    type: 'step',
    badge: 'Step 02',
    headline: 'Promise a real result (with timeline)',
    body: 'Give clients a tangible milestone date. Uncertainty breeds hesitation and lost deals.',
    stepNumber: '04'
  },
  {
    id: 'aura-5',
    type: 'step',
    badge: 'Step 03',
    headline: 'Add urgency (scarcity, bonus, deadline)',
    body: 'Without a deadline to act, next week turns into never. Give them a compelling reason to decide today.',
    stepNumber: '05'
  },
  {
    id: 'aura-6',
    type: 'cta',
    badge: 'DM',
    headline: 'OFFER',
    body: "and I'll send you my free offer framework",
    stepNumber: '06'
  }
];

// 3. LinkedIn 9 Mistakes Deck (100% English from Carousel design.jpeg)
export const LINKEDIN_MISTAKES_SLIDES = [
  {
    id: 'li-1',
    type: 'hook',
    badge: '9 MISTAKES',
    headline: 'THAT BLOCK YOUR LINKEDIN PROFILE FROM B2B SALES',
    highlight_word: 'B2B SALES',
    body: 'How to transform your personal profile into an inbound deal engine.',
    stepNumber: '01'
  },
  {
    id: 'li-2',
    type: 'question_cards',
    badge: 'VALUE',
    stamp: 'VALUE',
    stepNumber: '2',
    headline: 'LACK OF SPECIFIC VALUE IN YOUR HEADLINE',
    subline: 'Doesn’t answer key buyer questions:',
    card1: '«Why should I work with you specifically?»',
    card2: '«What exact business problem do you solve?»'
  },
  {
    id: 'li-3',
    type: 'step',
    watermark: 'AUTHORITY',
    stepNumber: '3',
    headline: 'PROFILE LOOKS LIKE A RESUME, NOT AN EXPERT HUB',
    highlight_word: 'RESUME TRAP',
    body: 'LinkedIn is not a job board — it is where commercial authority and high-value partnerships are built.'
  },
  {
    id: 'li-4',
    type: 'step',
    watermark: 'RESULTS',
    stepNumber: '6',
    headline: 'ZERO CASE STUDIES OR VERIFIED WORK EXAMPLES',
    highlight_word: 'SHOW EVIDENCE',
    body: 'You claim expertise — prove it with tangible client metrics, screenshots, and concrete outcomes.'
  },
  {
    id: 'li-5',
    type: 'step',
    watermark: 'ACTIVITY',
    stepNumber: '7',
    headline: 'ZERO CONSISTENT CONTENT OR FEED ACTIVITY',
    highlight_word: 'BE VISIBLE',
    body: 'If you never appear in the feed, you simply do not exist to high-intent buyers in your niche.'
  },
  {
    id: 'li-6',
    type: 'step',
    watermark: 'TRUST',
    stepNumber: '9',
    headline: 'ZERO RECOMMENDATIONS OR CLIENT SOCIAL PROOF',
    highlight_word: 'People trust others’ words 10x more than your pitch',
    body: 'Client reviews and colleague endorsements provide decisive credibility before the first sales call.'
  }
];

// 4. Viral Kinetic Mindset (from Screenshot 2026-09-10 131707.png)
export const VIRAL_KINETIC_SLIDES = [
  {
    id: 'viral-1',
    type: 'hook',
    badge: 'GROWTH BLUEPRINT',
    headline: 'WHAT I LEARNED FROM GOING VIRAL',
    body: "The raw truth behind 500k+ impressions: what works, what falls flat, and what actually builds buyers.",
    stepNumber: '01'
  },
  {
    id: 'viral-2',
    type: 'step',
    headline: 'POSTS DONT GO VIRAL JUST FOR COOL DESIGNS',
    body: 'Have you ever spent hours creating content only for it to get 12 likes? Design grabs attention, but cited insight earns saves.',
    stepNumber: '02'
  },
  {
    id: 'viral-3',
    type: 'step',
    headline: 'CLARITY BEATS COMPLEXITY EVERY SINGLE TIME',
    body: 'If a buyer cannot understand your core thesis in 3 seconds, they swipe past to your competitor.',
    stepNumber: '03'
  },
  {
    id: 'viral-4',
    type: 'step',
    headline: 'RETENTION REQUIRES MULTI-DOMAIN CITATIONS',
    body: 'When your claims are backed by verifiable sources, your content transforms from opinion into industry benchmark.',
    stepNumber: '04'
  },
  {
    id: 'viral-5',
    type: 'step',
    headline: 'FOLLOW FOR MORE VERIFIED FRAMEWORKS',
    body: 'We publish fact-checked AI and creator breakdowns twice weekly. Tap follow to stay ahead.',
    stepNumber: '05'
  }
];

// 5. Retro Prompt Mistakes & Chat (from Screenshot 2026-09-10 131649.png)
export const RETRO_PILL_CHAT_SLIDES = [
  {
    id: 'retro-1',
    type: 'hook',
    headline: 'AI prompt design',
    body: 'Autonomous agent loops catch hallucinations before they reach your audience.',
    stepNumber: '01'
  },
  {
    id: 'retro-2',
    type: 'chat',
    headline: 'How do I stop my LLM from hallucinating claims?',
    body: 'Enforce multi-agent cross-verification before publishing. Never rely on a single unverified model response.',
    stepNumber: '02'
  },
  {
    id: 'retro-3',
    type: 'step',
    headline: 'Never ask an LLM to fact-check its own output',
    body: 'Without external ground truth, models produce confident hallucinations. Always feed primary URLs or RSS sources.',
    stepNumber: '03'
  },
  {
    id: 'retro-4',
    type: 'step',
    headline: 'Separate creative drafting from factual corroboration',
    body: 'When one agent drafts and an independent verifier audits, quality jumps by over 60%.',
    stepNumber: '04'
  },
  {
    id: 'retro-5',
    type: 'cta',
    headline: 'Save this guide and upgrade your workflow',
    body: 'Try the Autonomous Creator Studio and Carousel Forge at kiln-studioai.vercel.app',
    stepNumber: '05'
  }
];

// 6. Boho Career Pivot Roadmap (with per-slide authentic arrows from Canva Template.jpeg)
export const BOHO_ROADMAP_SLIDES = [
  {
    id: 'boho-1',
    type: 'hook',
    badge: 'CAREER GUIDE',
    headline: 'Step by Step Career Pivot',
    body: 'How to Successfully Switch Roles and Land High-Impact Opportunities',
    stepNumber: '01'
  },
  {
    id: 'boho-2',
    type: 'step',
    stepNumber: '1',
    headline: 'Acknowledge the Starting Point',
    body: 'Every pivot starts with clarity. Define why you want to switch and identify what is missing in your current role.'
  },
  {
    id: 'boho-3',
    type: 'step',
    stepNumber: '2',
    headline: 'Skill Discovery & Gap Analysis',
    body: 'List the skills your target role requires. Mark what you already possess, and highlight the exact gaps you need to bridge.'
  },
  {
    id: 'boho-4',
    type: 'step',
    stepNumber: '3',
    headline: 'Learn & Build in Public',
    body: 'Take targeted short sprints. Practice on real-world proof projects and document your progress publicly.'
  },
  {
    id: 'boho-5',
    type: 'step',
    stepNumber: '4',
    headline: 'Network & High-Signal Visibility',
    body: 'Opportunities come from people. Connect with peers in your target field and share your learning journey online.'
  },
  {
    id: 'boho-6',
    type: 'insight',
    stepNumber: '5',
    headline: 'Apply with Confidence',
    body: 'Tailor your resume for relevance. Highlight transferable skills. Showcase measurable results, not just passive responsibilities.'
  },
  {
    id: 'boho-7',
    type: 'cta',
    badge: 'SAVE ROADMAP',
    headline: 'Save This Roadmap',
    body: "If you're considering a career pivot this quarter, keep this guide handy. Share it with a friend making the jump.",
    stepNumber: '07'
  }
];

// 7. Minimal Publication (Editorial)
export const MINIMAL_EDITORIAL_SLIDES = [
  {
    id: 'edit-1',
    type: 'step',
    headline: 'The Sovereign AI Stack of 2026',
    body: 'How enterprise intelligence transitioned from single models to multi-agent consensus pipelines.',
    stepNumber: '01'
  },
  {
    id: 'edit-2',
    type: 'step',
    headline: 'Why Speculative Content Loses Search Visibility',
    body: 'Major discovery engines now downrank speculative claims lacking verifiable primary publisher citations.',
    stepNumber: '02'
  },
  {
    id: 'edit-3',
    type: 'step',
    headline: 'Corroboration Across Independent Web Outlets',
    body: 'Cross-verifying every factual assertion ensures your editorial authority remains rock-solid.',
    stepNumber: '03'
  },
  {
    id: 'edit-4',
    type: 'cta',
    headline: 'Read the full research paper on KILN Studio',
    body: 'Visit kiln-studioai.vercel.app for complete interactive benchmark charts and raw consensus logs.',
    stepNumber: '04'
  }
];

// 8. NEW: Cyber Emerald & Terminal Deck
export const CYBER_EMERALD_SLIDES = [
  {
    id: 'cyber-1',
    type: 'hook',
    badge: 'AI ENGINEERING 2026',
    headline: 'The 4 Architecture Levers Behind Zero-Hallucination LLMs',
    highlight_word: 'Zero-Hallucination',
    body: 'How production AI systems eliminate confabulation using consensus loops and semantic grounding.',
    stepNumber: '01'
  },
  {
    id: 'cyber-2',
    type: 'step',
    badge: 'LEVER 01: GROUNDING',
    headline: 'Real-time Vector Search Over Curated Primary Docs',
    body: 'Never allow model generation without injecting live, timestamped chunk embeddings from authenticated endpoints.',
    stepNumber: '02'
  },
  {
    id: 'cyber-3',
    type: 'step',
    badge: 'LEVER 02: CROSS-VERIFY',
    headline: 'Independent Verifier Corroboration Engine',
    body: 'Drafts are parsed into atomic factual statements and dispatched to a secondary evaluator with strict citation rubrics.',
    stepNumber: '03'
  },
  {
    id: 'cyber-4',
    type: 'step',
    badge: 'LEVER 03: LATENCY',
    headline: 'Sub-500ms Multi-Turn Streaming Pipeline',
    body: 'Speculative decoding and parallel agent execution keep end-to-end consensus time under half a second.',
    stepNumber: '04'
  },
  {
    id: 'cyber-5',
    type: 'cta',
    badge: 'DEPLOY WITH KILN',
    headline: 'Build Verifiable AI Applications Today',
    body: 'Explore the full multi-agent consensus orchestrator at kiln-studioai.vercel.app',
    stepNumber: '05'
  }
];

// 8. NEW: Electric Cobalt & Acid Lime Deck
export const ACID_COBALT_SLIDES = [
  {
    id: 'acid-1',
    type: 'hook',
    badge: 'PLAYBOOK 2026',
    headline: 'How Top B2B Startups Scale From $1M to $10M ARR',
    highlight_word: '$10M',
    body: 'The exact high-velocity distribution flywheel that beats paid ads every quarter.',
    stepNumber: '01'
  },
  {
    id: 'acid-2',
    type: 'step',
    badge: 'RULE 01',
    headline: 'Positioning Around High-Cost Enterprise Pain',
    body: 'Stop pitching features. Quantify the exact revenue leak your customer experiences every month without your solution.',
    stepNumber: '02'
  },
  {
    id: 'acid-3',
    type: 'step',
    badge: 'RULE 02',
    headline: 'Organic Authority Content As An Inbound Funnel',
    body: 'Publishing fact-checked breakdowns turns cold lurkers into warm discovery calls without outbound spam.',
    stepNumber: '03'
  },
  {
    id: 'acid-4',
    type: 'step',
    badge: 'RULE 03',
    headline: 'Proof Stacking Across Every Touchpoint',
    body: 'When your claims cite real data and multi-domain benchmarks, closing cycles shorten from months to days.',
    stepNumber: '04'
  },
  {
    id: 'acid-5',
    type: 'cta',
    badge: 'GET THE PLAYBOOK',
    headline: 'Swipe Up To Download The Full B2B Growth Blueprint',
    body: 'Follow @kilnstudio for weekly high-signal venture and B2B growth breakdowns.',
    stepNumber: '05'
  }
];

// 9. NEW: Klowt Punch Purple Deck (from Image 1)
export const KLOWT_PURPLE_SLIDES = [
  {
    id: 'klowt-1',
    type: 'hook',
    badge: 'do you?',
    headline: "99% of people don't post on linkedin.",
    highlight_word: 'do you?',
    body: 'Over 1 billion professionals read the feed, but fewer than 1% create content consistently. Here is how you win in 2026.',
    stepNumber: '01'
  },
  {
    id: 'klowt-2',
    type: 'step',
    badge: 'THE BOTTLENECK',
    headline: 'Most founders overcomplicate their first post.',
    highlight_word: 'overcomplicate',
    body: 'You do not need a 10-page whitepaper. You just need one clear, verified insight from your daily work.',
    stepNumber: '02'
  },
  {
    id: 'klowt-3',
    type: 'step',
    badge: 'THE ADVANTAGE',
    headline: 'Consistency outperforms pure talent every single week.',
    highlight_word: 'Consistency',
    body: 'Posting 3x weekly with evidence-backed takeaways builds compounding authority in 90 days.',
    stepNumber: '03'
  },
  {
    id: 'klowt-4',
    type: 'cta',
    badge: 'FOLLOW US',
    headline: 'Ready to build your personal distribution engine?',
    highlight_word: 'Start Today',
    body: 'Follow for daily high-converting creator blueprints and verified frameworks.',
    stepNumber: '04'
  }
];

// 10. NEW: Monochrome Editorial & Asterisk Deck (from Image 2)
export const MONOCHROME_EDITORIAL_SLIDES = [
  {
    id: 'mono-1',
    type: 'hook',
    badge: 'GET TO KNOW US',
    headline: 'Let us be your compass',
    body: 'We don’t follow trends, we create them.',
    stepNumber: '01'
  },
  {
    id: 'mono-2',
    type: 'step',
    badge: 'AI & AUTOMATION',
    headline: 'AI isn’t replacing jobs. It’s creating smarter businesses.',
    body: 'We turn insights into action and action into impact.',
    stepNumber: '02'
  },
  {
    id: 'mono-3',
    type: 'step',
    badge: 'POSITIONING',
    headline: 'If your brand doesn’t stand out, it blends in. Let’s change that.',
    body: 'We are here to keep you ahead. The best founders are problem-solvers, not just dreamers.',
    stepNumber: '03'
  },
  {
    id: 'mono-4',
    type: 'cta',
    badge: 'TAKE ACTION',
    headline: 'Forget overnight success. Let’s build something that lasts a lifetime.',
    body: 'Innovating new solutions. Standing still is the fastest way to fall behind.',
    stepNumber: '04'
  }
];

// 11. NEW: Forest Slate & Citrus Lime Deck (from Image 3)
export const FOREST_LIME_SLIDES = [
  {
    id: 'forest-1',
    type: 'hook',
    stepNumber: '01',
    headline: 'The future of marketing is human',
    body: 'We don’t chase algorithms. We understand people. Moving from clicks to connection, from impressions to impact.'
  },
  {
    id: 'forest-2',
    type: 'step',
    stepNumber: '02',
    headline: 'We don’t just create ads. We create experiences worth remembering.',
    body: 'When your marketing resonates emotionally, prospects convert into lifelong brand champions.'
  },
  {
    id: 'forest-3',
    type: 'step',
    stepNumber: '03',
    headline: 'We don’t talk at audiences. We talk with them.',
    body: 'Marketing evolves fast. Empathy is timeless.'
  },
  {
    id: 'forest-4',
    type: 'cta',
    stepNumber: '04',
    headline: 'Ready to elevate your marketing strategy?',
    body: 'Your brand can be clear, unique, and recognizable — all it needs is the right direction. Start with a solid strategy.'
  }
];

/**
 * Pre-configured presets dictionary for 1-click loading in Forge
 */
export const PRESET_DECKS = {
  gpt6_astra: {
    id: 'gpt6_astra',
    theme: 'kiln_neobrutalist',
    ratio: 'portrait',
    name: 'GPT-6 Astra Breakdown',
    badge: 'FLAGSHIP GOLD',
    icon: '🏆',
    description: 'Signature cream paper, intense gold (#E8B923) & brutalist ink shadows (all cream, no black BG)',
    slides: DEFAULT_SLIDES
  },
  aura_offer: {
    id: 'aura_offer',
    theme: 'aura_glass',
    ratio: 'portrait',
    name: 'Aura Offer Blueprint',
    badge: 'HIGH-CONVERTING',
    icon: '🔥',
    description: 'Dark mesh aura, frosted folder tab cards & flame pill buttons (Screenshot 2026-09-10 131833.png)',
    slides: AURA_OFFER_SLIDES
  },
  linkedin_mistakes: {
    id: 'linkedin_mistakes',
    theme: 'linkedin_authority',
    ratio: 'portrait',
    name: 'LinkedIn 9 B2B Mistakes',
    badge: 'AUTHORITY',
    icon: '💼',
    description: 'Pure white, red brackets [2], shadow cards, pink stamp & faint watermarks (100% English)',
    slides: LINKEDIN_MISTAKES_SLIDES
  },
  viral_kinetic: {
    id: 'viral_kinetic',
    theme: 'bold_condensed',
    ratio: 'square',
    name: 'Viral Kinetic Mindset',
    badge: 'VIRAL',
    icon: '⚡',
    description: 'Deep indigo, massive Anton caps & alternating neon pink/white words (Screenshot 2026-09-10 131707.png)',
    slides: VIRAL_KINETIC_SLIDES
  },
  retro_pill_chat: {
    id: 'retro_pill_chat',
    theme: 'retro_pill_stack',
    ratio: 'square',
    name: 'Retro Pill Stack & Chat',
    badge: 'PLAYFUL',
    icon: '💬',
    description: 'Flame orange tilted pills, iMessage chat bubbles & rainbow cards (Screenshot 2026-09-10 131649.png)',
    slides: RETRO_PILL_CHAT_SLIDES
  },
  boho_roadmap: {
    id: 'boho_roadmap',
    theme: 'boho_roadmap',
    ratio: 'portrait',
    name: 'Boho Career Pivot',
    badge: 'CANVA BOHO',
    icon: '🌿',
    description: 'Warm eggshell sand, Playfair Display serif & authentic per-slide flow arrows (Canva Template.jpeg)',
    slides: BOHO_ROADMAP_SLIDES
  },
  minimal_editorial: {
    id: 'minimal_editorial',
    theme: 'minimal_editorial',
    ratio: 'portrait',
    name: 'State of AI Publication',
    badge: 'PRESTIGE',
    icon: '📰',
    description: 'Refined Newsreader serif with brick terracotta top accent bar',
    slides: MINIMAL_EDITORIAL_SLIDES
  },
  acid_cobalt: {
    id: 'acid_cobalt',
    theme: 'acid_cobalt',
    ratio: 'portrait',
    name: '$10M B2B Playbook',
    badge: 'GROWTH SAAS',
    icon: '🚀',
    description: 'Deep electric cobalt blue (#0B1A3D), high-voltage acid lime (#E2F952) & high-energy punch',
    slides: ACID_COBALT_SLIDES
  },
  klowt_purple: {
    id: 'klowt_purple',
    theme: 'klowt_purple',
    ratio: 'portrait',
    name: 'Klowt 99% LinkedIn Hook',
    badge: 'VIRAL HOOK',
    icon: '🟣',
    description: 'Minimal soft white, massive heavy sans, tilted purple punchbox & multi-platform handle bar',
    slides: KLOWT_PURPLE_SLIDES
  },
  monochrome_editorial: {
    id: 'monochrome_editorial',
    theme: 'monochrome_editorial',
    ratio: 'portrait',
    name: 'Monochrome Asterisk',
    badge: 'EDITORIAL',
    icon: '✱',
    description: 'Warm fog white & obsidian (#111), giant asterisk (*), diagonal diamond frame & pill badges',
    slides: MONOCHROME_EDITORIAL_SLIDES
  },
  forest_lime: {
    id: 'forest_lime',
    theme: 'forest_lime',
    ratio: 'portrait',
    name: 'Forest Slate & Citrus Lime',
    badge: 'MARKETING',
    icon: '🍃',
    description: 'Deep forest pine (#132523), neon lime (#CCF32F), hand-drawn star vector & step ticks',
    slides: FOREST_LIME_SLIDES
  }
};

/**
 * MAIN RENDER DISPATCHER
 * Generates an exact 1080x1350px or 1080x1080px HTML string
 */
export function renderSlideHTML(slide, themeId = 'kiln_neobrutalist', options = {}) {
  const theme = TEMPLATE_THEMES[themeId] || TEMPLATE_THEMES.kiln_neobrutalist;
  const aspectRatio = options.aspectRatio || theme.defaultRatio || 'portrait';
  const canvasSize = CANVAS_SIZES[aspectRatio] || CANVAS_SIZES.portrait;
  const currentIndex = options.currentIndex || 0;
  const totalCount = options.totalCount || 6;
  const handle = options.handle || '@kilnstudio';

  const w = canvasSize.width;
  const h = canvasSize.height;

  switch (theme.id) {
    case 'kiln_neobrutalist':
      return renderKilnNeobrutalist(slide, theme, w, h, currentIndex, totalCount, handle);
    case 'aura_glass':
      return renderAuraGlass(slide, theme, w, h, currentIndex, totalCount, handle);
    case 'linkedin_authority':
      return renderLinkedInAuthority(slide, theme, w, h, currentIndex, totalCount, handle);
    case 'bold_condensed':
      return renderBoldCondensed(slide, theme, w, h, currentIndex, totalCount, handle);
    case 'retro_pill_stack':
      return renderRetroPillStack(slide, theme, w, h, currentIndex, totalCount, handle);
    case 'boho_roadmap':
      return renderBohoRoadmap(slide, theme, w, h, currentIndex, totalCount, handle);
    case 'minimal_editorial':
      return renderMinimalEditorial(slide, theme, w, h, currentIndex, totalCount, handle);
    case 'acid_cobalt':
      return renderAcidCobalt(slide, theme, w, h, currentIndex, totalCount, handle);
    case 'klowt_purple':
      return renderKlowtPurple(slide, theme, w, h, currentIndex, totalCount, handle);
    case 'monochrome_editorial':
      return renderMonochromeEditorial(slide, theme, w, h, currentIndex, totalCount, handle);
    case 'forest_lime':
      return renderForestLime(slide, theme, w, h, currentIndex, totalCount, handle);
    default:
      return renderKilnNeobrutalist(slide, theme, w, h, currentIndex, totalCount, handle);
  }
}
