/* Dependency-free SVG charts. Colours come from CSS custom properties via
   style="" (SVG presentation attributes do not resolve var()). */
const Charts = (() => {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function ring(pct, { size = 132, stroke = 12, color = 'var(--accent)', label = '', sub = '' } = {}) {
    const r = (size - stroke) / 2, c = 2 * Math.PI * r, off = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
    return `<svg class="ring" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="${esc(label || pct + '%')}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" style="stroke:var(--track)" stroke-width="${stroke}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" style="stroke:${color};transition:stroke-dashoffset .6s" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${off}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
      <text x="50%" y="${sub ? '47%' : '53%'}" text-anchor="middle" dominant-baseline="middle" class="ring-v" style="font-size:${size * 0.24}px">${esc(label || Math.round(pct) + '%')}</text>
      ${sub ? `<text x="50%" y="66%" text-anchor="middle" class="ring-s" style="font-size:${Math.max(9, size * 0.085)}px">${esc(sub)}</text>` : ''}
    </svg>`;
  }

  function scale(vals, h, pad) {
    const min = Math.min(...vals), max = Math.max(...vals), span = max - min || 1;
    return v => pad + (h - pad * 2) * (1 - (v - min) / span);
  }

  // Area chart with optional dashed forecast tail and target line.
  function area(vals, { forecast = [], target = null, w = 560, h = 180, color = 'var(--accent)', labels = [] } = {}) {
    const all = [...vals, ...forecast, ...(target != null ? [target] : [])];
    const y = scale(all, h, 16), n = vals.length + forecast.length, x = i => 8 + (w - 16) * i / (n - 1);
    const pts = vals.map((v, i) => `${x(i)},${y(v)}`).join(' ');
    const fpts = forecast.length ? [vals.length - 1, ...forecast.map((_, i) => vals.length + i)].map((i, k) => `${x(i)},${y(k === 0 ? vals[vals.length - 1] : forecast[k - 1])}`).join(' ') : '';
    const id = 'g' + Math.random().toString(36).slice(2, 7);
    return `<svg class="chart" viewBox="0 0 ${w} ${h + (labels.length ? 16 : 0)}" preserveAspectRatio="none" role="img">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:${color};stop-opacity:.28"/><stop offset="1" style="stop-color:${color};stop-opacity:0"/></linearGradient></defs>
      ${target != null ? `<line x1="8" x2="${w - 8}" y1="${y(target)}" y2="${y(target)}" style="stroke:var(--muted)" stroke-dasharray="4 4" stroke-width="1"/><text x="${w - 10}" y="${y(target) - 5}" text-anchor="end" class="ax">target ${target}</text>` : ''}
      <polygon points="${x(0)},${h} ${pts} ${x(vals.length - 1)},${h}" fill="url(#${id})"/>
      <polyline points="${pts}" fill="none" style="stroke:${color}" stroke-width="2.4" stroke-linejoin="round"/>
      ${fpts ? `<polyline points="${fpts}" fill="none" style="stroke:var(--risk)" stroke-width="2.4" stroke-dasharray="6 5"/><text x="${w - 10}" y="${y(forecast[forecast.length - 1]) + 16}" text-anchor="end" class="ax" style="fill:var(--risk)">AI forecast ${forecast[forecast.length - 1]}</text>` : ''}
      <circle cx="${x(vals.length - 1)}" cy="${y(vals[vals.length - 1])}" r="4" style="fill:${color}"/>
      ${labels.map((l, i) => `<text x="${x(i)}" y="${h + 13}" text-anchor="middle" class="ax">${esc(l)}</text>`).join('')}
    </svg>`;
  }

  function bars(vals, { labels = [], w = 560, h = 170, hi = -1, color = 'var(--accent)', fmt = v => v } = {}) {
    const max = Math.max(...vals) * 1.12, n = vals.length, bw = (w - 16) / n;
    return `<svg class="chart" viewBox="0 0 ${w} ${h + 18}" preserveAspectRatio="none" role="img">
      ${vals.map((v, i) => { const bh = (h - 18) * v / max, X = 8 + i * bw + bw * 0.18; return `<rect x="${X}" y="${h - bh}" width="${bw * 0.64}" height="${bh}" rx="4" style="fill:${i === hi ? 'var(--accent-2)' : color};opacity:${i === hi ? 1 : 0.78}"><title>${esc(labels[i] || '')} ${fmt(v)}</title></rect>${i === hi ? `<text x="${X + bw * 0.32}" y="${h - bh - 5}" text-anchor="middle" class="ax strong">${fmt(v)}</text>` : ''}`; }).join('')}
      ${labels.map((l, i) => `<text x="${8 + i * bw + bw / 2}" y="${h + 13}" text-anchor="middle" class="ax">${esc(l)}</text>`).join('')}
    </svg>`;
  }

  // Expected vs actual (monitoring).
  function dual(points, { w = 560, h = 190, lo = null, hi = null } = {}) {
    const vals = points.flatMap(p => [p.expected, p.actual]).filter(v => v != null);
    const min = lo ?? Math.min(...vals) - 4, max = hi ?? Math.min(100, Math.max(...vals) + 4);
    const y = v => 14 + (h - 28) * (1 - (v - min) / (max - min)), x = i => 30 + (w - 44) * i / (points.length - 1);
    const line = key => points.map((p, i) => p[key] == null ? null : `${x(i)},${y(p[key])}`).filter(Boolean).join(' ');
    const grid = [min, (min + max) / 2, max].map(v => `<line x1="30" x2="${w - 14}" y1="${y(v)}" y2="${y(v)}" style="stroke:var(--line)"/><text x="24" y="${y(v) + 3}" text-anchor="end" class="ax">${Math.round(v)}%</text>`).join('');
    return `<svg class="chart" viewBox="0 0 ${w} ${h + 16}" preserveAspectRatio="none" role="img">${grid}
      <polyline points="${line('expected')}" fill="none" style="stroke:var(--muted)" stroke-width="2" stroke-dasharray="5 5"/>
      <polyline points="${line('actual')}" fill="none" style="stroke:var(--accent)" stroke-width="2.6"/>
      ${points.map((p, i) => p.actual == null ? '' : `<circle cx="${x(i)}" cy="${y(p.actual)}" r="3.5" style="fill:var(--accent)"/>`).join('')}
      ${points.map((p, i) => `<text x="${x(i)}" y="${h + 12}" text-anchor="middle" class="ax">${esc(p.label)}</text>`).join('')}
    </svg>`;
  }

  function spark(vals, { w = 90, h = 28, color = 'var(--accent)' } = {}) {
    const y = scale(vals, h, 3), x = i => 2 + (w - 4) * i / (vals.length - 1);
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" class="spark"><polyline points="${vals.map((v, i) => `${x(i)},${y(v)}`).join(' ')}" fill="none" style="stroke:${color}" stroke-width="1.8"/></svg>`;
  }

  return { ring, area, bars, dual, spark, esc };
})();
