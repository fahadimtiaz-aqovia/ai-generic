/* Foresight — Executive Command Centre (desktop).
   Every screen reads the active industry from FX.ind(); nothing below is
   industry-specific, so switching industry re-skins the whole story. */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const app = $('#app');
const m = v => FX.money(v);
const pc = v => Math.round(v) + '%';
const esc = Charts.esc;

const S = { page: 'home', stage: 0, levels: {}, stress: 0, journeyStart: null, twinSel: null, procView: 'current', chat: [], lastSources: [], reviewed: false, explainId: null };

const TITLES = {
  home: 'Home', command: '01 · Business Performance Intelligence', risk: '02 · Predictive Risk Engine', explain: '03 · Explainable AI Engine',
  recommend: '04 · AI Recommendation Engine', simulate: '05 · What-If Simulation Engine', assistant: '06 · AI Enterprise Assistant',
  process: '07 · Process Optimisation', twin: '08 · Digital Twin', governance: '09 · Governance & Responsible AI',
  decision: 'Executive Decision Journey', architecture: 'Data & AI Architecture', config: 'Industry Configuration'
};
const GROUPS = { insights: ['command', 'risk', 'explain'], decide: ['recommend', 'simulate', 'assistant', 'decision'], operate: ['process', 'twin'], trust: ['governance', 'architecture', 'config'] };
/* The nine generic platform modules, as shown on the Home hub. */
const MODULES = [
  ['command', '01', 'Business Performance Intelligence', 'How is my business performing today?', '📊', '#4f46e5'],
  ['risk', '02', 'Predictive Risk Engine', 'What problems are likely to happen next?', '⚠️', '#d23c3c'],
  ['explain', '03', 'Explainable AI Engine', 'Why is it happening, and what data says so?', '🔍', '#7c3aed'],
  ['recommend', '04', 'AI Recommendation Engine', 'Which action should we take?', '✦', '#0e9f8f'],
  ['simulate', '05', 'What-If Simulation Engine', 'What happens if I…?', '🎛️', '#c77a0a'],
  ['assistant', '06', 'AI Enterprise Assistant', 'Ask the business anything, with citations', '💬', '#2563eb'],
  ['process', '07', 'Process Optimisation', 'Where is time lost, and how do we fix it?', '⇢', '#0891b2'],
  ['twin', '08', 'Digital Twin', 'What is happening in operations right now?', '▦', '#138a5b'],
  ['governance', '09', 'Governance & Responsible AI', 'Can we trust it? AI recommends, humans decide.', '🛡', '#475569']
];
const STEPS = [['Alert', 'Impact detected'], ['Understand', 'Why it is happening'], ['Options', 'AI recommendations'], ['Simulate', 'What-if analysis'], ['Approve', 'Human decision'], ['Monitor', 'Track the outcome']];

/* ================= helpers ================= */
const probCls = p => p < 70 ? 'risk' : p < 82 ? 'warn' : 'ok';
const probColor = p => p < 70 ? 'var(--risk)' : p < 82 ? 'var(--attn)' : 'var(--ok)';
const sevChip = s => `<span class="chip ${s}">${s === 'high' ? 'High' : s === 'med' ? 'Medium' : 'Low'}</span>`;
const ph = (eyebrow, title, sub, acts = '') => `<div class="ph"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div>${acts ? `<div class="acts">${acts}</div>` : ''}</div>`;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2800); }
function modal(html) { $('#modal').innerHTML = html; $('#modalBg').classList.add('open'); }
function closeModal() { $('#modalBg').classList.remove('open'); }
const approved = () => FX.store.ind().approved;
const canSee = p => { const r = FX.ROLES[FX.role()]; return r.pages === '*' || r.pages.includes(p); };
function resetScenario() { const rec = FX.recommend(FX.ind().flagship); S.levels = { ...rec.levels }; S.stress = 0; }
const planLabel = lv => FX.ind().flagship.options.filter(o => lv[o.id]).map(o => o.id + (lv[o.id] < 1 ? ` (${Math.round(lv[o.id] * 100)}%)` : '')).join(' + ') || 'No action';

/* ================= shell ================= */
function initShell() {
  const cfg = FX.cfg();
  $('#brandName').textContent = cfg.platform.name;
  document.title = `${cfg.platform.name} · ${cfg.platform.product}`;
  $('#roleSel').innerHTML = Object.entries(FX.ROLES).map(([k, r]) => `<option value="${k}">👤 ${r.name}</option>`).join('');
  $('#roleSel').value = FX.role();
  $('#roleSel').onchange = e => { FX.store.set({ role: e.target.value }); FX.audit('Role switched', `Now viewing as ${FX.roleName()}`); if (!canSee(S.page)) S.page = 'home'; render(); toast(`Viewing as ${FX.roleName()}. Navigation and approval rights updated.`); };
  $('#indBtn').onclick = e => { e.stopPropagation(); closeMenus(); $('#indMenu').classList.toggle('open'); };
  // Top navigation: grouped dropdowns (click to open), collapsible menu on small screens.
  const closeMenus = () => $$('.dd').forEach(d => d.classList.remove('open'));
  $$('.mi[data-group]').forEach(b => b.onclick = e => { e.stopPropagation(); const d = b.parentElement, was = d.classList.contains('open'); closeMenus(); $('#indMenu').classList.remove('open'); if (!was) d.classList.add('open'); });
  $$('.nav').forEach(b => b.onclick = () => { closeMenus(); $('#menu').classList.remove('open'); go(b.dataset.page); });
  $('#menuBtn').onclick = e => { e.stopPropagation(); $('#menu').classList.toggle('open'); };
  document.addEventListener('click', e => {
    if (!e.target.closest('.ind-pick')) $('#indMenu').classList.remove('open');
    if (!e.target.closest('.dd')) closeMenus();
    if (!e.target.closest('#menu') && !e.target.closest('#menuBtn')) $('#menu').classList.remove('open');
  });
  if (location.protocol === 'file:') { $('#mobileLink').href = 'mobile/index.html'; }
  $('#storyBtn').onclick = () => showPush();
  $('#themeBtn').onclick = () => { const d = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = d; try { localStorage.setItem('foresight-theme', d); } catch {} render(); };
  $('#resetBtn').onclick = () => { FX.store.reset(); S.chat = []; S.stage = 0; S.journeyStart = null; S.reviewed = false; resetScenario(); render(); toast('Demo reset: approvals and audit entries cleared.'); };
  $('#modalBg').onclick = e => { if (e.target.id === 'modalBg') closeModal(); };
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  // Global delegated actions
  document.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) closeModal();
    const g = e.target.closest('[data-go]');
    if (g) { e.preventDefault(); go(g.dataset.go, g.dataset.stage != null ? +g.dataset.stage : null); return; }
    const a = e.target.closest('[data-ask]');
    if (a) { e.preventDefault(); go('assistant'); ask(a.dataset.ask); return; }
    const ind = e.target.closest('[data-ind]');
    if (ind) { switchIndustry(ind.dataset.ind); return; }
  });
  window.addEventListener('hashchange', fromHash);
  window.addEventListener('storage', () => render()); // mobile approvals appear live
  setInterval(tick, 2500);
}

function renderIndustryPicker() {
  const ind = FX.ind();
  $('#indIco').textContent = ind.icon; $('#indName').textContent = ind.name;
  $('#indMenu').innerHTML = FX.cfg().industries.map(i => `<button data-ind="${i.id}" class="${i.id === ind.id ? 'on' : ''}" role="option"><span>${i.icon}</span>${i.name}</button>`).join('');
}

function switchIndustry(id) {
  FX.setIndustry(id);
  $('#indMenu').classList.remove('open');
  S.chat = []; S.stage = 0; S.twinSel = null; S.journeyStart = null; S.reviewed = false; resetScenario();
  render();
  toast(`${FX.ind().icon} ${FX.ind().name}: terminology, KPIs, risks and scenarios loaded from industry-config.js`);
}

function go(page, stage = null) {
  if (!TITLES[page]) page = 'home';
  if (!canSee(page)) { toast(`${FX.roleName()} doesn't have access to ${TITLES[page]} (role-based access).`); return; }
  S.page = page;
  if (stage != null) S.stage = stage;
  if (page === 'decision' && !S.journeyStart) S.journeyStart = Date.now();
  const h = '#' + page + (page === 'decision' ? '/' + S.stage : '');
  if (location.hash !== h) history.replaceState(null, '', h);
  render();
  window.scrollTo(0, 0);
}
function fromHash() {
  const [p, st] = location.hash.slice(1).split('/');
  if (p && TITLES[p]) { S.page = canSee(p) ? p : 'home'; if (st != null && !isNaN(+st)) S.stage = Math.max(0, Math.min(5, +st)); render(); }
}

function render() {
  const ind = FX.ind();
  renderIndustryPicker();
  $$('.nav').forEach(b => { b.classList.toggle('on', b.dataset.page === S.page); b.hidden = !canSee(b.dataset.page); });
  $$('.mi[data-group]').forEach(b => { const pages = GROUPS[b.dataset.group]; b.classList.toggle('on', pages.includes(S.page)); b.parentElement.hidden = !pages.some(canSee); });
  const n = ind.portfolio.filter(p => p.prob < 80).length - (approved() ? 1 : 0);
  $('#riskBadge').textContent = n > 0 ? n : '';
  $('#crumbInd').textContent = `${ind.icon} ${ind.name}`;
  $('#crumbPage').textContent = TITLES[S.page];
  app.innerHTML = PAGES[S.page]();
  BIND[S.page]?.();
}

function tick() {
  if (S.page === 'twin') jitterTwin();
  if (S.page === 'decision' && S.stage === 5 && approved()) { const el = $('#monBody'); if (el) { el.innerHTML = monitorBody(); } }
}

/* ================= push / story ================= */
function showPush() {
  const f = FX.ind().flagship, p = $('#push');
  p.innerHTML = `<div class="app">F</div><div style="flex:1"><small><span>${FX.cfg().platform.name.toUpperCase()} · ${FX.ind().name}</span><span>now</span></small><b>⚠ Potential business impact detected</b><p>${esc(f.alert)}</p></div>`;
  p.classList.add('show');
  p.onclick = () => { p.classList.remove('show'); S.journeyStart = Date.now(); S.reviewed = false; resetScenario(); go('decision', 0); };
  clearTimeout(p._h); p._h = setTimeout(() => p.classList.remove('show'), 9000);
}

/* ================= Home hub ================= */
function home() {
  const cfg = FX.cfg(), ind = FX.ind(), f = ind.flagship, T = ind.terms, R = FX.rollup(), rec = R.rec, ap = approved();
  const w = ind.workflow, cur = w.stages.reduce((s, x) => s + x.current, 0), fut = w.stages.reduce((s, x) => s + x.optimised, 0);
  const riskAssets = ind.twin.zones.flatMap(z => z.assets).filter(a => a.status === 'risk').length;
  const hr = new Date().getHours(), greet = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
  const metric = {
    command: [`${ind.health.score}/100`, 'business health score'],
    risk: [String(ind.predictions.length), `risks predicted · ${R.atRiskCount} ${FX.lc(T.entityPlural)} at risk`],
    explain: [String(f.drivers.length), `root causes explained for ${f.id}`],
    recommend: [`+${m(rec.net)}`, 'net benefit of the best plan'],
    simulate: [`${f.base}% → ${pc(rec.prob)}`, FX.lc(f.metric)],
    assistant: [String(ind.knowledge.length + cfg.platformDocs.length + ind.systems.length), 'grounded sources, all cited'],
    process: [`−${Math.round((1 - fut / cur) * 100)}%`, 'lead time with AI changes'],
    twin: [String(riskAssets), `${FX.lc(T.assetPlural)} / resources at risk now`],
    governance: ['100%', 'of decisions human-approved']
  };
  return `<div class="hub-hero">
      <div class="brief"><div class="eyebrow">${greet}, ${esc(FX.roleName())} · ${ind.icon} ${ind.name}</div>
        <h2>${ap ? `Decision on ${f.id} approved. ${R.atRiskCount - 1} more need attention.` : `${R.atRiskCount} decisions need you today. ${m(R.protectable)} of value can still be protected.`}</h2>
        <p>${esc(cfg.platform.product)}: a secure AI layer on top of ${ind.systems.slice(0, 3).map(s => s.name).join(', ')} and your other systems. It predicts risks, explains root causes, recommends actions and lets you simulate decisions before you act.</p>
        <div class="flowline">${['Alert', 'Understand', 'Options', 'Simulate', 'Approve', 'Monitor'].map((s, i) => `${i ? '<i>→</i>' : ''}<span>${s}</span>`).join('')}</div>
        <div class="row"><button class="btn pri" data-go="decision" data-stage="${ap ? 5 : 0}">${ap ? 'Monitor the outcome →' : '▶ Start the executive journey'}</button><button class="btn sec" data-ask="What should management focus on today?">💬 Ask the AI</button></div>
      </div>
      <div class="stat-col">
        <button class="stat" data-go="risk"><span class="ic" style="background:var(--risk-soft)">⚠️</span><div><div class="v neg">${m(R.valueAtRisk)}</div><div class="l">value at risk across ${ind.portfolio.length} ${FX.lc(T.entityPlural)}</div></div></button>
        <button class="stat" data-go="recommend"><span class="ic" style="background:var(--ok-soft)">✦</span><div><div class="v pos">+${m(R.net)}</div><div class="l">net impact if AI recommendations are approved</div></div></button>
        <button class="stat" data-go="decision" data-stage="${ap ? 5 : 1}"><span class="ic" style="background:var(--accent-soft)">◎</span><div><div class="v" style="color:${probColor(ap ? ap.prob : f.base)}">${pc(ap ? ap.prob : f.base)}</div><div class="l">${f.id} · ${FX.lc(f.metric)}${ap ? ' (recovering)' : ''}</div></div></button>
      </div>
    </div>
    <div class="sec-h"><h2>AI modules</h2><p>Nine reusable engines. The same platform for every industry: configured, not coded.</p></div>
    <div class="tiles">${MODULES.map(([k, n, name, q, ic, c]) => `<button class="tile" data-go="${k}" style="--tc:${c}"${canSee(k) ? '' : ' title="Not available for this role"'}><div class="tn"><span class="n">${n}</span><span class="ic">${ic}</span></div><h3>${name}</h3><div class="q">${q}</div><div class="metric"><b>${metric[k][0]}</b><span>${metric[k][1]}</span></div><span class="go">→</span></button>`).join('')}</div>
    <div class="sec-h" style="margin-top:26px"><h2>Platform</h2><p>How it connects, how it adapts, where executives use it</p></div>
    <div class="plat">
      <button class="tile" data-go="architecture" style="--tc:#475569"><span class="ic">⧉</span><div><h3>Data &amp; AI Architecture</h3><div class="note">Sits on ${ind.systems.length} existing systems; nothing is replaced</div></div></button>
      <button class="tile" data-go="config" style="--tc:#7c3aed"><span class="ic">⚙</span><div><h3>Industry Configuration</h3><div class="note">${cfg.industries.length} industries from one config file</div></div></button>
      <a class="tile" href="mobile/index.html" target="_blank" rel="noopener" style="--tc:#0e9f8f;text-decoration:none;color:inherit"><span class="ic">📱</span><div><h3>Mobile Decision App</h3><div class="note">Alert → approve in under a minute</div></div></a>
    </div>
    <div class="promise"><div style="font-size:30px">◆</div><div><b>${esc(cfg.platform.promise)}</b><div class="muted" style="margin-top:4px">${esc(cfg.platform.principle)} Every recommendation is explained, approved by a person and audited.</div></div></div>`;
}

/* ================= 03. Explainable AI Engine ================= */
function explain() {
  const ind = FX.ind(), f = ind.flagship, T = ind.terms;
  const feats = [[`${T.supplier} / material readiness`, 31], [`${T.asset} capacity headroom`, 24], ['Quality signal', 14], ['Schedule buffer', 13], [`${T.supplier} reliability history`, 10], [`Historical ${FX.lc(T.successMetric)}`, 8]];
  const others = ind.portfolio.filter(p => p.id !== f.id);
  return ph('03 · Explainable AI Engine', 'Why is this happening?', 'The AI doesn\'t just predict. It shows which factors contributed, which data influenced the result and the exact maths, so every number can be checked.', `<button class="btn sec" data-ask="Show me the maths">💬 Ask how it's calculated</button>`)
  + `<div class="sub" style="margin:0 0 10px"><b>Local explanation</b> for one prediction: <b>${f.id}</b> · ${esc(f.customer)}</div>`
  + stUnderstand()
  + `<div class="g g2 mt">
    <div class="card"><div class="ch"><div><h3>Global explanation: what drives the model</h3><div class="sub">Average contribution of each feature across all ${FX.lc(T.entityPlural)} (last 12 months)</div></div><span class="chip ai r">Model-level</span></div>
      <div class="imp">${feats.map(([l, v]) => `<div class="r"><span>${esc(l)}</span><div class="bar"><i style="width:${v / 31 * 100}%;background:#7c3aed"></i></div><b>${v}%</b></div>`).join('')}</div>
      <div class="note" style="margin-top:10px">Used to check the model behaves sensibly: supply and capacity should dominate, and they do.</div></div>
    <div class="card"><h3>Explanations for other ${FX.lc(T.entityPlural)}</h3><div class="sub">Every score comes with its main driver</div>
      <table class="t"><thead><tr><th>${T.entity}</th><th>Prob.</th><th>Why (top driver)</th></tr></thead><tbody>${others.map(p => `<tr><td><b>${p.id}</b><div class="note">${esc(p.customer)}</div></td><td><b style="color:${probColor(p.prob)}">${p.prob}%</b></td><td>${p.prob >= 85 ? '<span class="chip ok">No material risk</span>' : `<b>${esc(p.driver)}</b> is the largest contributor`}</td></tr>`).join('')}</tbody></table></div>
  </div>`;
}

/* ================= 04. AI Recommendation Engine ================= */
function recommend() {
  const ind = FX.ind(), f = ind.flagship, rec = FX.recommend(f);
  const queue = [
    ['High', `${f.id}: ${planLabel(rec.levels)} (recovery plan)`, ind.terms.successMetric, rec.net, f.options[0].owner, true],
    ...ind.anomalies.slice(0, 2).map(a => ['Medium', `Hold payment and review ${a.id} with ${a.supplier} (+${a.variance}% vs contract)`, 'Procurement', 0, 'Procurement', false]),
    ...ind.workflow.recommendations.slice(0, 2).map(r => ['Medium', r.text, `Process: ${r.stage}`, 0, 'Process owner', false]),
    ...ind.predictions.filter(p => /Machine|Equipment|Asset|Fleet/.test(p.area)).slice(0, 1).map(p => ['Low', `Schedule preventive maintenance: ${p.title}`, p.area, p.impact, 'Maintenance', false])
  ];
  return ph('04 · AI Recommendation Engine', 'Which action should we take?', 'Turns insights into specific, costed actions. Each option shows its effect on the outcome, cost, value protected and owner, so leaders can compare before they decide.')
  + stOptions()
  + `<div class="card mt"><div class="ch"><div><h3>Next-best-action queue</h3><div class="sub">Recommendations across the business, ranked by value</div></div></div>
    <table class="t"><thead><tr><th>Priority</th><th>Recommended action</th><th>Area</th><th>Value</th><th>Owner</th><th></th></tr></thead><tbody>${queue.map(q => `<tr><td><span class="chip ${q[0] === 'High' ? 'high' : q[0] === 'Medium' ? 'med' : 'low'}">${q[0]}</span></td><td>${esc(q[1])}</td><td class="muted">${esc(q[2])}</td><td>${q[3] ? m(q[3]) : '—'}</td><td>${esc(q[4])}</td><td>${q[5] ? '<button class="btn ghost" data-go="decision" data-stage="4">Approve →</button>' : '<button class="btn ghost" data-assign>Assign</button>'}</td></tr>`).join('')}</tbody></table></div>
  <div class="foot"><span class="sp"></span><button class="btn sec" data-go="simulate">Test it in the What-If Simulator →</button><button class="btn pri" data-go="decision" data-stage="4">Take the plan to approval →</button></div>`;
}

/* ================= 05. What-If Simulation Engine ================= */
function simulate() {
  const f = FX.ind().flagship, st = f.stress, top = [...f.options].sort((a, b) => b.uplift - a.uplift)[0];
  const lib = [['half', `What if ${FX.lc(st.label)} is +${Math.round(st.max / 2)} ${st.unit}?`], ['stress', `What if ${FX.lc(st.label)} reaches +${st.max} ${st.unit}?`], ['top', `What if we only do "${top.label}"?`], ['none', 'What if we do nothing?'], ['all', 'What if we do everything?'], ['rec', 'Reset to the AI recommended plan']];
  return ph('05 · What-If Simulation Engine', 'What happens if I…?', 'Change assumptions and actions to see the new probability and the financial impact instantly, before committing any money.')
  + `<div class="card" style="margin-bottom:16px"><h3>Scenario library</h3><div class="sub">Common questions for ${FX.ind().name}. Click one to run it.</div><div class="presets">${lib.map(([k, q]) => `<button data-pre="${k}">${esc(q)}</button>`).join('')}</div>
    <div class="note">Or ask in plain language: <a href="#" data-ask="What if we spend 20k on expediting?">"What if we spend 20k on expediting?"</a> · <a href="#" data-ask="${esc(FX.ind().prompts[3])}">"${esc(FX.ind().prompts[3])}"</a></div></div>`
  + stSimulate()
  + `<div class="foot"><span class="sp"></span><button class="btn pri" data-go="decision" data-stage="4">Take this scenario to approval →</button></div>`;
}

/* ================= 01. Business Performance Intelligence ================= */
function command() {
  const ind = FX.ind(), f = ind.flagship, T = ind.terms, R = FX.rollup(), ap = approved();
  const tr = ind.trend, last = tr.values[tr.values.length - 1], fc = tr.forecast[tr.forecast.length - 1];
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const sv = [...ind.savings].sort((a, b) => b.value - a.value), svMax = sv[0].value;
  return ph(`01 · Business Performance Intelligence · ${ind.name}`, 'How is the business performing today?', `One view across ${ind.systems.map(s => s.name).join(', ')}, with AI predictions on top.`)
  + `<div class="hero">
      <div class="brief"><div class="eyebrow">AI daily brief</div>
        <h2>${R.atRiskCount} ${FX.lc(T.entityPlural)} need attention. ${m(R.protectable)} of value can still be protected.</h2>
        <p>${tr.label} is forecast to fall from <b>${last}</b> to <b>${fc}</b> over the next 4 weeks unless action is taken. The largest exposure is <b>${f.id}</b> (${esc(f.customer)}), driven mainly by ${FX.lc(f.drivers[0].label)}.</p>
        <div class="row"><button class="btn pri" data-go="decision" data-stage="0">Review top decision →</button><button class="btn sec" data-go="risk">See all predicted risks</button><button class="btn sec" data-ask="Where can AI save the most money?">Ask: where can AI save money?</button></div>
      </div>
      <div class="card alert-hero">${Charts.ring(ap ? ap.prob : f.base, { size: 108, color: probColor(ap ? ap.prob : f.base), sub: ap ? 'recovered' : 'on-time' })}
        <div class="txt"><div class="tag">${ap ? '✓ Decision approved · monitoring' : '⚠ Potential business impact detected'}</div><h3>${f.id} · ${esc(f.title)}</h3>
        <div class="muted" style="font-size:13px">${ap ? `Recovery plan approved by ${esc(ap.by)}. ${f.metric} ${f.base}% → ${pc(ap.prob)}, net ${m(ap.net)} protected.` : esc(f.alert)}</div>
        <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">${ap ? `<button class="btn sec" data-go="decision" data-stage="5">Track outcome →</button>` : `<button class="btn pri" data-go="decision" data-stage="1">Understand why →</button>`}</div></div>
      </div>
    </div>
    <div class="vband">
      <div><div class="l">Total value at risk</div><div class="v neg">${m(R.valueAtRisk)}</div><div class="s">across ${ind.portfolio.length} active ${FX.lc(T.entityPlural)}</div></div>
      <div><div class="l">Value AI can protect</div><div class="v">${m(R.protectable)}</div><div class="s">with recommended actions</div></div>
      <div><div class="l">Cost to act</div><div class="v">${m(R.cost)}</div><div class="s">expediting, capacity, overtime</div></div>
      <div class="net"><div class="l">Net business impact</div><div class="v pos">+${m(R.net)}</div><div class="s">${(R.protectable / R.cost).toFixed(1)}× return · illustrative</div></div>
    </div>
    <div class="g g4">${ind.kpis.map((k, i) => `<div class="card kpi"><div class="l">${k.label}</div><div class="v">${k.value}</div><div class="d ${k.bad ? 'neg' : 'pos'}">${k.bad ? '▼' : '▲'} ${k.delta}</div></div>`).join('')}</div>
    <div class="g g-21 mt">
      <div class="card"><div class="ch"><div><h3>${tr.label}: actual and AI forecast</h3><div class="sub">Last 12 weeks, plus a 4-week forecast if nothing changes</div></div><span class="chip ai r">✦ AI forecast</span></div>
        ${Charts.area(tr.values, { forecast: tr.forecast, target: tr.target, h: 190 })}
        <div class="ai-box mt"><b class="lbl">AI interpretation</b>${tr.label} is trending down and is forecast to reach <b>${fc}</b>, below the ${tr.target} target. The main causes are ${f.drivers.slice(0, 2).map(d => FX.lc(d.label)).join(' and ')}.</div></div>
      <div class="card"><h3>Business health score</h3><div class="sub">Composite of five operational dimensions</div>
        <div class="health">${Charts.ring(ind.health.score, { size: 120, color: probColor(ind.health.score + 8), label: String(ind.health.score), sub: '/ 100' })}
        <div class="parts">${ind.health.parts.map(([l, v]) => `<div class="hp"><span>${l}</span><div class="bar ${probCls(v + 8)}"><i style="width:${v}%"></i></div><b>${v}</b></div>`).join('')}</div></div></div>
    </div>
    <div class="g g3 mt">
      <div class="card"><h3>${ind.revenue.label}</h3><div class="sub">Millions (${ind.currency.code}), last 12 months</div>${Charts.bars(ind.revenue.values, { labels: months, hi: 11, fmt: v => ind.currency.symbol + v + 'M', h: 150 })}</div>
      <div class="card"><div class="ch"><div><h3>Needs attention</h3><div class="sub">AI alerts across modules</div></div></div><div class="alist">${ind.alerts.map((a, i) => `<button class="arow" ${i === 0 ? 'data-go="decision" data-stage="0"' : 'data-go="risk"'}><span class="sev ${a.sev}"></span><div><b>${esc(a.title)}</b><span>${esc(a.detail)}</span></div></button>`).join('')}</div></div>
      <div class="card"><h3>Where AI creates value</h3><div class="sub">Estimated annual value, illustrative</div>${sv.map(s => `<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:12.5px"><span>${s.area}</span><b>${m(s.value)}</b></div><div class="bar"><i style="width:${s.value / svMax * 100}%;background:var(--accent-2)"></i></div></div>`).join('')}<div class="note">Total ${m(sv.reduce((a, b) => a + b.value, 0))} per year</div></div>
    </div>`;
}

/* ================= 2. Predictive Risk Engine ================= */
const MODEL_BY_AREA = a => ({ Delivery: 'Outcome-risk model (logistic)', Service: 'Outcome-risk model (logistic)', Release: 'Outcome-risk model (logistic)', Flow: 'Outcome-risk model (logistic)', Availability: 'Outcome-risk model (logistic)', Machine: 'Asset failure model (survival)', Equipment: 'Asset failure model (survival)', Asset: 'Asset failure model (survival)', Fleet: 'Asset failure model (survival)', Quality: 'Quality defect model (gradient boosting)', Supply: 'Supply & inventory forecast (time series)', Cost: 'Cost anomaly detector (isolation forest)', Fraud: 'Anomaly detector (isolation forest)', Energy: 'Energy anomaly detector', Patient: 'Patient risk model (clinical early warning)' }[a] || 'Forecast model (time series)');
function risk() {
  const ind = FX.ind(), f = ind.flagship, T = ind.terms;
  const preds = [...ind.predictions].sort((a, b) => b.impact - a.impact);
  const port = [...ind.portfolio].sort((a, b) => a.prob - b.prob);
  return ph('02 · Predictive Risk Engine', 'What problems are likely to happen next?', `Models score every ${FX.lc(T.entity)}, asset and ${FX.lc(T.supplier)} continuously, so issues surface days before they show up in reports.`)
  + `<div class="g g3">${preds.map((p, i) => { const isF = p.title.includes(f.id); return `<div class="card pred">
      <div class="top-r"><span class="chip">${p.area}</span><span class="note">${p.horizon}</span></div>
      <h4>${esc(p.title)}</h4>
      <div class="pv"><b>${p.prob}%</b><span class="muted" style="font-size:12px">probability${isF ? ' · flagship' : ''}</span></div>
      <div class="bar ${p.prob > 65 || isF ? 'risk' : p.prob > 45 ? 'warn' : 'ok'}"><i style="width:${p.prob}%"></i></div>
      <div class="meta"><span>${p.impact ? 'Impact ' + m(p.impact) : 'Safety / compliance'}</span><button class="btn ghost" style="padding:0" ${isF ? 'data-go="decision" data-stage="1"' : `data-pred="${ind.predictions.indexOf(p)}"`}>Explain →</button></div></div>`; }).join('')}</div>
    <div class="card mt"><div class="ch"><div><h3>${T.entityPlural} scored by the risk model</h3><div class="sub">${T.successMetric} probability for each open ${FX.lc(T.entity)}. Click a row to see the explanation.</div></div><span class="chip src r">Sources: ${ind.systems.slice(0, 3).map(s => s.name).join(' · ')}</span></div>
      <table class="t"><thead><tr><th>${T.entity}</th><th>${T.customer}</th><th>Value</th><th style="width:22%">${T.successMetric} probability</th><th>Value at risk</th><th>Main driver</th><th>Due</th></tr></thead><tbody>
      ${port.map(p => { const isF = p.id === f.id, ap = isF && approved(), pr = ap ? approved().prob : p.prob; return `<tr class="click" ${isF ? 'data-go="decision" data-stage="1"' : `data-port="${p.id}"`}><td><b>${p.id}</b>${isF ? ' <span class="chip ai">flagship</span>' : ''}</td><td>${esc(p.customer)}</td><td>${m(p.value)}</td><td><div style="display:flex;gap:8px;align-items:center"><div class="bar ${probCls(pr)}" style="flex:1"><i style="width:${pr}%"></i></div><b>${pc(pr)}</b></div></td><td class="${pr < 80 ? 'neg' : ''}">${m(p.value * (1 - pr / 100))}</td><td>${ap ? '<span class="chip ok">Plan approved</span>' : esc(p.driver)}</td><td>${p.due}</td></tr>`; }).join('')}
      </tbody></table></div>`;
}
BIND_RISK = () => {
  const ind = FX.ind();
  $$('[data-pred]').forEach(b => b.onclick = () => predModal(ind.predictions[+b.dataset.pred]));
  $$('[data-port]').forEach(r => r.onclick = () => { const p = ind.portfolio.find(x => x.id === r.dataset.port); predModal({ area: ind.terms.successMetric, title: `${p.id} · ${p.customer}`, prob: p.prob, horizon: p.due, impact: p.value * (1 - p.prob / 100), driver: p.driver, success: true }); });
};
function predModal(p) {
  const ind = FX.ind();
  modal(`<div style="display:flex;gap:16px;align-items:center">${Charts.ring(p.prob, { size: 96, color: p.success ? probColor(p.prob) : 'var(--risk)', sub: p.success ? 'success' : 'probability' })}<div><span class="chip">${p.area}</span><h3 style="margin-top:6px">${esc(p.title)}</h3><div class="muted" style="font-size:13px">Horizon ${p.horizon} · ${p.impact ? 'impact ' + m(p.impact) : 'compliance item'}</div></div></div>
    <div class="ai-box mt"><b class="lbl">Why the model flagged this</b>${p.driver ? `The main driver is <b>${esc(FX.lc(p.driver))}</b>, based on current signals from ${ind.systems[0].name} and ${ind.systems[1].name}.` : `The model sees an abnormal pattern in recent signals from ${ind.systems[1].name} and ${ind.systems[0].name} compared with the last 12 months of history.`}</div>
    <table class="t mt"><tr><td class="muted">Model</td><td>${MODEL_BY_AREA(p.area)}</td></tr><tr><td class="muted">Data sources</td><td>${ind.systems.slice(0, 3).map(s => `<span class="chip src">${s.name}</span>`).join(' ')}</td></tr><tr><td class="muted">Confidence</td><td>High (model accuracy 86–91% on back-test)</td></tr></table>
    <div class="foot"><button class="btn sec" data-close>Close</button><span class="sp"></span><button class="btn pri" id="assignBtn">Assign to owner for review</button></div>`);
  $('#assignBtn').onclick = () => { FX.audit('Prediction assigned for review', p.title); closeModal(); toast('Assigned. The owner is notified and the action is logged in the audit trail.'); };
}

/* ================= Executive Decision Journey: Alert → Understand → Options → Simulate → Approve → Monitor ================= */
function decision() {
  const ind = FX.ind(), f = ind.flagship, ap = approved();
  const body = [stAlert, stUnderstand, stOptions, stSimulate, stApprove, stMonitor][S.stage]();
  const next = ['Understand why →', 'See recovery options →', 'Simulate the decision →', 'Proceed to approval →', null, null][S.stage];
  return ph(`Executive Decision Journey · ${f.id}`, esc(f.title), `${esc(f.customer)} · ${f.qty} · value ${m(f.value)} · due ${f.due}`, `<button class="btn sec" data-ask="Why is ${f.id} at risk?">💬 Ask AI about this</button>`)
  + `<div class="stepper">${STEPS.map((s, i) => `<button class="step ${i === S.stage ? 'on' : ''} ${i < S.stage || (ap && i <= 4) ? 'done' : ''}" data-go="decision" data-stage="${i}"><span class="n">${i < S.stage || (ap && i <= 4) ? '✓' : i + 1}</span><span><b>${s[0]}</b><small>${s[1]}</small></span></button>`).join('')}</div>`
  + body
  + `<div class="foot">${S.stage > 0 ? `<button class="btn sec" data-go="decision" data-stage="${S.stage - 1}">← Back</button>` : ''}<span class="sp"></span>${next ? `<button class="btn pri" data-go="decision" data-stage="${S.stage + 1}">${next}</button>` : ''}</div>`;
}

function stAlert() {
  const ind = FX.ind(), f = ind.flagship, r = FX.simulate(f, {});
  return `<div class="g g-21">
    <div class="card"><h3>Step 1 · The alert</h3><div class="sub">What the executive receives on their phone and in the command centre</div>
      <div class="push-demo"><div class="app">F</div><div><small>${FX.cfg().platform.name.toUpperCase()} · now</small><div style="font-weight:700">⚠ Potential business impact detected</div><p>${esc(f.alert)}</p></div></div>
      <div class="facts mt">
        <div class="fact"><div class="l">${ind.terms.customer}</div><div class="v">${esc(f.customer)}</div></div>
        <div class="fact"><div class="l">Scope</div><div class="v">${f.qty}</div></div>
        <div class="fact"><div class="l">Value</div><div class="v">${m(f.value)}</div></div>
        <div class="fact"><div class="l">Committed</div><div class="v">${f.due}</div></div>
        <div class="fact"><div class="l">AI predicted</div><div class="v neg">${f.predicted}</div></div>
        <div class="fact"><div class="l">Value at risk</div><div class="v neg">${m(r.baseAtRisk)}</div></div>
      </div>
      <div class="ai-box mt"><b class="lbl">Why this matters</b>Traditional reporting shows this problem only after the ${FX.lc(ind.terms.successMetric)} target has been missed. Foresight predicted it from live signals in ${ind.systems.slice(0, 3).map(s => s.name).join(', ')}, while there is still time to act.</div>
    </div>
    <div class="card" style="text-align:center"><h3>${f.metric}</h3><div class="sub">Calibrated prediction, refreshed every 15 minutes</div>
      ${Charts.ring(f.base, { size: 170, color: 'var(--risk)', sub: 'probability' })}
      <div style="margin-top:10px"><span class="chip high">${esc(f.risk)}</span></div>
      <p class="muted" style="font-size:13px">A healthy ${FX.lc(ind.terms.entity)} normally scores <b>${FX.cfg().platform.healthyBaseline}%</b>. Three drivers explain the gap.</p>
      <div class="lineage" style="justify-content:center">${ind.systems.map(s => `<span class="chip src">${s.name}</span>`).join('')}</div>
    </div></div>`;
}

function stUnderstand() {
  const ind = FX.ind(), f = ind.flagship, ex = FX.explain(f);
  const d = ex.drivers;
  const narrative = `${f.metric} dropped to <b>${f.base}%</b> because ${d.map((x, i) => `${i === d.length - 1 ? 'and ' : ''}<b>${FX.lc(x.label)}</b> (${Math.round(x.share * 100)}% of the risk)`).join(', ')}. ${d[0].evidence}`;
  return `<div class="g g-21">
    <div class="card"><div class="ch"><div><h3>${S.page === 'decision' ? 'Step 2 · ' : ''}Why is this happening?</h3><div class="sub">Explainable AI: each driver's contribution, with the evidence behind it</div></div><span class="chip ai r">✦ Explainable AI</span></div>
      <div class="ai-box"><b class="lbl">AI explanation</b>${narrative}</div>
      ${d.map(x => `<div class="drv"><div class="h"><b>${esc(x.label)}</b><span class="chip src">${x.source}</span><span class="pct">−${x.pts.toFixed(1)} pts</span></div>
        <div class="bar risk"><i style="width:${x.share * 100}%"></i></div><p>${esc(x.evidence)}</p></div>`).join('')}
      <details class="maths"><summary>🧮 Show the maths</summary>
        <p style="font-size:13px">The model is a calibrated logistic regression. The gap between a healthy ${ex.healthy}% and today's ${f.base}% is split across the drivers in <i>log-odds</i>, so the contributions add up exactly to the prediction.</p>
        <div class="eq">logit(p) = ln(p / (1 − p))<br>logit(${ex.healthy}%) = <b>${ex.lH.toFixed(3)}</b><br>${d.map(x => `− ${x.logodds.toFixed(3)} &nbsp;<span class="muted">(${esc(x.label)})</span>`).join('<br>')}<br>= <b>${ex.lB.toFixed(3)}</b> → p = 1 / (1 + e<sup>−(${ex.lB.toFixed(3)})</sup>) = <b>${f.base}%</b></div>
        <table class="t"><thead><tr><th>Driver</th><th>Weight</th><th>Log-odds</th><th>Points</th><th>Source</th></tr></thead><tbody>${d.map(x => `<tr><td>${esc(x.label)}</td><td>${Math.round(x.share * 100)}%</td><td class="mono">−${x.logodds.toFixed(3)}</td><td class="neg">−${x.pts.toFixed(1)}</td><td>${x.source}</td></tr>`).join('')}<tr><td><b>Total</b></td><td>100%</td><td class="mono"><b>−${ex.gap.toFixed(3)}</b></td><td class="neg"><b>−${(ex.healthy - f.base).toFixed(1)}</b></td><td></td></tr></tbody></table>
      </details>
    </div>
    <div class="card"><h3>What data influenced this?</h3><div class="sub">Lineage from source system to explanation</div>
      <div style="display:grid;gap:8px">${[['Systems of record', ind.systems.slice(0, 3).map(s => s.name).join(' · ')], ['Canonical data model', `${ind.terms.entity} · ${ind.terms.asset} · Material · ${ind.terms.supplier} · ${ind.terms.customer}`], ['Feature layer', 'material_readiness · capacity_headroom · quality_signal · schedule_buffer'], ['Risk model', 'Logistic v3.2 · back-test accuracy 87% · calibrated'], ['Explanation', 'Log-odds decomposition + evidence links']].map((x, i) => `<div class="box"><span>${i + 1}. ${x[0]}</span><b>${x[1]}</b></div>`).join('<div class="down" style="padding:0"></div>')}</div>
      <div class="ai-box mt" style="font-size:12.5px"><b class="lbl">Confidence</b>High. All inputs were refreshed in the last 15 minutes and none of the features is outside its training range.</div>
    </div></div>`;
}

function optCard(o) {
  const f = FX.ind().flagship, r = FX.optionImpact(f, o), sel = (S.levels[o.id] || 0) > 0;
  return `<div class="card opt ${sel ? 'sel' : ''}" data-opt="${o.id}" role="button" tabindex="0" aria-pressed="${sel}"><span class="check">${sel ? '✓' : ''}</span>
    <div style="display:flex;gap:10px;align-items:center"><span class="oid">${o.id}</span><span class="chip">${o.owner}</span></div>
    <h4>${esc(o.label)}</h4>
    <div><span class="up">+${Math.round(r.prob - f.base)}%</span> <span class="muted" style="font-size:12.5px">confidence → ${pc(r.prob)}</span></div>
    <div class="kv"><span>Addresses</span><b>${esc(f.drivers[o.targets].label)}</b><span>Cost</span><b>${m(o.cost)}</b><span>Value protected</span><b>${m(r.protected)}</b><span>Net benefit</span><b class="pos">${m(r.net)}</b><span>Return</span><b>${r.roi.toFixed(1)}×</b><span>Time to effect</span><b>${o.time}</b></div></div>`;
}
function stOptions() {
  const f = FX.ind().flagship, rec = FX.recommend(f), mine = FX.simulate(f, S.levels);
  const rows = [['Do nothing', {}], ...f.options.map(o => [`${o.id} only · ${o.label}`, { [o.id]: 1 }]), ['All options', Object.fromEntries(f.options.map(o => [o.id, 1]))]];
  return `<div class="sub" style="margin:0 0 10px">${S.page === 'decision' ? 'Step 3 · ' : ''}The AI turns the diagnosis into specific actions and prices each one. Select options to compare them.</div>
    <div class="g g3">${f.options.map(optCard).join('')}</div>
    <div class="rec-strip mt"><div style="font-size:26px">✦</div><div style="flex:1"><div class="note" style="font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--ok)">AI recommended plan</div><b>${planLabel(rec.levels)}</b> → ${FX.lc(f.metric)} <b>${f.base}% → ${pc(rec.prob)}</b> for ${m(rec.leverCost)}. This is the highest net benefit that still reaches the ${FX.cfg().platform.recommendTarget}% target.</div><div class="big">+${m(rec.net)}</div><button class="btn ok" id="useRec">Use this plan</button></div>
    <div class="card mt"><h3>Compare options</h3><div class="sub">Options overlap, so combined uplift has diminishing returns and is less than the sum.</div>
      <table class="t"><thead><tr><th>Scenario</th><th>${f.metric}</th><th>Cost</th><th>Value protected</th><th>Net benefit</th><th>Return</th></tr></thead><tbody>
      ${[...rows.map(([l, lv]) => [l, FX.simulate(f, lv), false]), ['Your selection · ' + planLabel(S.levels), mine, 'mine'], ['✦ AI recommended · ' + planLabel(rec.levels), rec, 'rec']].map(([l, r, k]) => `<tr style="${k === 'rec' ? 'background:var(--ok-soft)' : k === 'mine' ? 'background:var(--accent-soft)' : ''}"><td><b>${esc(l)}</b></td><td><b style="color:${probColor(r.prob)}">${pc(r.prob)}</b></td><td>${m(r.leverCost)}</td><td>${m(r.protected)}</td><td class="${r.net > 0 ? 'pos' : ''}"><b>${m(r.net)}</b></td><td>${r.leverCost ? r.roi.toFixed(1) + '×' : '—'}</td></tr>`).join('')}
      </tbody></table></div>`;
}
function bindOptions() {
  $$('[data-opt]').forEach(c => {
    const toggle = () => { const id = c.dataset.opt; S.levels[id] = (S.levels[id] || 0) > 0 ? 0 : 1; render(); };
    c.onclick = toggle; c.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } };
  });
  $('#useRec') && ($('#useRec').onclick = () => { S.levels = { ...FX.recommend(FX.ind().flagship).levels }; render(); toast('AI recommended plan selected.'); });
}

function stSimulate() {
  const f = FX.ind().flagship, st = f.stress;
  return `<div class="g g-12">
    <div class="card"><div class="ch"><div><h3>${S.page === 'decision' ? 'Step 4 · What happens if…' : 'Assumptions and actions'}</h3><div class="sub">Change the assumptions and the prediction and financials recalculate instantly</div></div></div>
      <div class="presets"><button data-pre="rec">✦ AI plan</button><button data-pre="none">Do nothing</button><button data-pre="all">Everything</button><button data-pre="stress">Worst-case ${esc(FX.lc(st.label))}</button></div>
      ${f.options.map(o => `<div class="lever"><div class="h"><b>${o.id} · ${esc(o.label)}</b><span id="lv-${o.id}">${Math.round((S.levels[o.id] || 0) * 100)}% · ${m(o.cost * (S.levels[o.id] || 0))}</span></div><input type="range" min="0" max="100" step="25" value="${Math.round((S.levels[o.id] || 0) * 100)}" data-lever="${o.id}" aria-label="${esc(o.label)}"></div>`).join('')}
      <div class="lever stress"><div class="h"><b>⚠ Stress test: ${esc(st.label)}</b><span id="lv-stress">+${S.stress} ${st.unit}</span></div><input type="range" min="0" max="${st.max}" step="1" value="${S.stress}" id="stressIn" aria-label="${esc(st.label)}"></div>
      <div class="note" style="margin-top:10px">Try: <a href="#" data-ask="What if we spend 20k on expediting?">"What if we spend 20k on expediting?"</a> in the AI Assistant.</div>
    </div>
    <div class="card" id="simOut">${simOut()}</div></div>`;
}
function simOut() {
  const f = FX.ind().flagship, r = FX.simulate(f, S.levels, S.stress), stressed = S.stress > 0 ? FX.simulate(f, {}, S.stress) : null;
  const verdict = r.prob >= FX.cfg().platform.recommendTarget ? `This plan meets the ${FX.cfg().platform.recommendTarget}% target` : r.prob > f.base ? 'This improves the outlook but misses the target' : 'This does not recover the position';
  return `<h3>Before and after</h3><div class="sub">${esc(f.metric)}</div>
    <div class="ba"><div>${Charts.ring(stressed ? stressed.prob : f.base, { size: 130, color: 'var(--risk)', sub: stressed ? 'stressed' : 'today' })}<div class="cap">${stressed ? 'No action, under stress' : 'Current'}</div></div><div class="arrow">→</div><div>${Charts.ring(r.prob, { size: 150, color: probColor(r.prob), sub: 'after plan' })}<div class="cap">With your decision</div></div></div>
    <div class="fin">
      <div><div class="l">Value protected</div><div class="v pos">${m(r.protected)}</div></div>
      <div><div class="l">Cost of actions</div><div class="v">${m(r.leverCost)}</div></div>
      <div><div class="l">Value still at risk</div><div class="v neg">${m(r.atRisk)}</div></div>
      <div><div class="l">${r.stressCost ? 'Extra operating cost (stress)' : 'Return on spend'}</div><div class="v">${r.stressCost ? m(r.stressCost) : (r.leverCost ? r.roi.toFixed(1) + '×' : '—')}</div></div>
      <div class="net"><div class="l">Net benefit</div><div class="v ${r.net >= 0 ? 'pos' : 'neg'}">${r.net >= 0 ? '+' : ''}${m(r.net)}</div></div>
    </div>
    <div class="ai-box mt"><b class="lbl">AI interpretation</b>${verdict}: ${f.base}% → <b>${pc(r.prob)}</b> for ${m(r.leverCost)}. ${f.value && r.prob > f.base ? `${esc(f.customer)} relationship risk falls from high to ${r.prob >= 85 ? 'low' : 'medium'}.` : ''}</div>`;
}
function bindSimulate() {
  const f = FX.ind().flagship, upd = () => {
    f.options.forEach(o => { const el = $('#lv-' + o.id); if (el) el.textContent = `${Math.round((S.levels[o.id] || 0) * 100)}% · ${m(o.cost * (S.levels[o.id] || 0))}`; });
    $('#lv-stress').textContent = `+${S.stress} ${f.stress.unit}`;
    $('#simOut').innerHTML = simOut();
  };
  $$('[data-lever]').forEach(i => i.oninput = () => { S.levels[i.dataset.lever] = +i.value / 100; upd(); });
  $('#stressIn').oninput = e => { S.stress = +e.target.value; upd(); };
  $$('[data-pre]').forEach(b => b.onclick = () => {
    const p = b.dataset.pre;
    if (p === 'rec') { S.levels = { ...FX.recommend(f).levels }; S.stress = 0; }
    if (p === 'none') { S.levels = {}; S.stress = 0; }
    if (p === 'all') { S.levels = Object.fromEntries(f.options.map(o => [o.id, 1])); }
    if (p === 'stress') { S.stress = f.stress.max; }
    if (p === 'half') { S.stress = Math.round(f.stress.max / 2); }
    if (p === 'top') { const t = [...f.options].sort((a, b) => b.uplift - a.uplift)[0]; S.levels = { [t.id]: 1 }; S.stress = 0; }
    render();
  });
}

function stApprove() {
  const ind = FX.ind(), f = ind.flagship, r = FX.simulate(f, S.levels), ap = approved(), role = FX.ROLES[FX.role()];
  const chosen = f.options.filter(o => S.levels[o.id]);
  return `<div class="g g-21">
    <div class="card"><h3>Step 5 · Approve the decision</h3><div class="sub">A named person commits the plan. Nothing executes automatically.</div>
      ${chosen.length ? `<table class="t"><thead><tr><th>Action</th><th>Level</th><th>Owner</th><th>Routed to</th><th>Cost</th></tr></thead><tbody>${chosen.map(o => `<tr><td><b>${o.id}</b> · ${esc(o.label)}</td><td>${Math.round(S.levels[o.id] * 100)}%</td><td>${o.owner}</td><td><span class="chip src">${ind.systems[0].name}</span></td><td>${m(o.cost * S.levels[o.id])}</td></tr>`).join('')}<tr><td colspan="4"><b>Total</b> · ${FX.lc(f.metric)} ${f.base}% → <b>${pc(r.prob)}</b></td><td><b>${m(r.leverCost)}</b></td></tr></tbody></table>` : `<div class="empty">No actions selected. <a href="#" data-go="decision" data-stage="2">Choose options</a> first.</div>`}
      ${S.stress ? `<div class="note" style="margin-top:8px">The stress test (+${S.stress} ${f.stress.unit}) was a what-if assumption and is not part of the approved plan. Figures above assume current conditions.</div>` : ''}
      <div class="hitl mt"><span class="i">🧑‍⚖️</span><div><b>${FX.cfg().platform.principle}</b> Approved actions go to their owners as tasks in the existing systems (${ind.systems.slice(0, 2).map(s => s.name).join(', ')}). Foresight never writes to systems of record on its own.</div></div>
      ${ap ? `<div class="rec-strip mt"><div style="font-size:24px">✓</div><div style="flex:1"><b>Approved by ${esc(ap.by)}</b> via ${esc(ap.channel)} · ${new Date(ap.at).toLocaleString()}<br><span class="muted" style="font-size:12.5px">${planLabel(ap.levels)} · ${f.base}% → ${pc(ap.prob)} · net ${m(ap.net)}</span></div><button class="btn sec" data-go="decision" data-stage="5">Monitor →</button></div>`
      : `<label class="check-row"><input type="checkbox" id="reviewed" ${S.reviewed ? 'checked' : ''}> I have reviewed the explanation, the evidence and the financial impact.</label>
      <div style="display:flex;gap:10px;align-items:center">${role.canApprove ? `<button class="btn ok" id="approveBtn" ${S.reviewed && chosen.length ? '' : 'disabled'}>✓ Approve as ${role.name}</button>` : `<button class="btn pri" id="requestBtn" ${chosen.length ? '' : 'disabled'}>Request approval</button><span class="note">${role.name} can recommend but not approve. Approval rights are set by role.</span>`}<button class="btn sec" data-go="decision" data-stage="3">Adjust scenario</button></div>`}
    </div>
    <div class="card"><h3>Approval record</h3><div class="sub">Stored in the immutable audit trail</div>
      <table class="t"><tr><td class="muted">Decision</td><td>${f.id} recovery plan</td></tr><tr><td class="muted">Approver</td><td>${esc(ap ? ap.by : role.name)}</td></tr><tr><td class="muted">Evidence</td><td>3 drivers · ${ind.systems.slice(0, 3).length} source systems</td></tr><tr><td class="muted">Model</td><td>Outcome-risk v3.2 (accuracy 87%)</td></tr><tr><td class="muted">Prediction</td><td>${f.base}% → ${pc(ap ? ap.prob : r.prob)}</td></tr><tr><td class="muted">Financials</td><td>Cost ${m(ap ? ap.cost : r.leverCost)} · net ${m(ap ? ap.net : r.net)}</td></tr></table>
    </div></div>`;
}
function bindApprove() {
  const cb = $('#reviewed'); if (cb) cb.onchange = () => { S.reviewed = cb.checked; const b = $('#approveBtn'); if (b) b.disabled = !(cb.checked && Object.values(S.levels).some(v => v)); };
  const ab = $('#approveBtn'); if (ab) ab.onclick = () => {
    const f = FX.ind().flagship, a = FX.approve({ ...S.levels }, 0, 'Desktop command centre');
    const secs = S.journeyStart ? Math.max(6, Math.round((Date.now() - S.journeyStart) / 1000)) : null;
    modal(`<div class="done">✓</div><h2>Decision made${secs ? ` in ${secs < 120 ? secs + ' seconds' : Math.round(secs / 60) + ' minutes'}` : ''}</h2><p class="c">${f.id}: ${FX.lc(f.metric)} ${f.base}% → <b>${pc(a.prob)}</b>. Net value protected: <b>${m(a.net)}</b>.</p>
      <div class="fin"><div><div class="l">Traditional process</div><div class="v">3–5 days</div><div class="note">meetings, emails, spreadsheets</div></div><div><div class="l">With ${FX.cfg().platform.name}</div><div class="v pos">${secs ? (secs < 120 ? secs + ' s' : Math.round(secs / 60) + ' min') : 'Minutes'}</div><div class="note">alert → evidence → decision</div></div></div>
      <p class="c" style="font-size:12.5px;margin-top:14px">Tasks are sent to ${f.options.filter(o => a.levels[o.id]).map(o => o.owner).join(', ')}. The decision is logged in the audit trail.</p>
      <div class="foot" style="border:0"><span class="sp"></span><button class="btn pri" data-close data-go="decision" data-stage="5">Monitor the outcome →</button></div>`);
  };
  const rb = $('#requestBtn'); if (rb) rb.onclick = () => { FX.audit('Approval requested', `${FX.ind().flagship.id}: ${planLabel(S.levels)} sent to CEO / Operations Director`); toast('Approval request sent and logged. Switch role to CEO to approve.'); };
}

function stMonitor() {
  const ap = approved();
  if (!ap) return `<div class="card empty"><h3>No approved decision yet</h3><p>Approve a plan to track expected against actual improvement.</p><button class="btn pri" data-go="decision" data-stage="4">Go to approval</button></div>`;
  return `<div id="monBody">${monitorBody()}</div>`;
}
function monitorBody() {
  const ind = FX.ind(), f = ind.flagship, ap = approved(), pts = FX.monitor(f, ap);
  const lastA = [...pts].reverse().find(p => p.actual != null), idx = pts.indexOf(lastA);
  const chosen = f.options.filter(o => ap.levels[o.id]);
  const realised = f.value * (lastA.actual - f.base) / 100;
  return `<div class="g g-21">
    <div class="card"><div class="ch"><div><h3>Step 6 · Expected vs actual improvement</h3><div class="sub">The platform keeps measuring the real outcome after the decision</div></div><span class="live r"><i></i>Live</span></div>
      <div class="legend"><span><i style="background:var(--muted)"></i>Expected (model)</span><span><i style="background:var(--accent)"></i>Actual (measured)</span></div>
      ${Charts.dual(pts, { lo: Math.min(f.base - 6, 50), hi: 100 })}
      <div class="ai-box mt"><b class="lbl">AI outcome review</b>${lastA.actual >= lastA.expected - 1 ? 'The recovery is on track.' : 'The recovery is slightly behind plan, which is typical in the first days while actions take effect.'} The measured ${FX.lc(f.metric)} is <b>${pc(lastA.actual)}</b> against <b>${pc(lastA.expected)}</b> expected at ${FX.lc(lastA.label)}. Outcomes are fed back to retrain the model.</div>
    </div>
    <div class="card"><h3>Outcome tracker</h3><div class="sub">${planLabel(ap.levels)} · approved by ${esc(ap.by)}</div>
      <div class="fin" style="margin-top:0"><div><div class="l">Expected at completion</div><div class="v">${pc(ap.prob)}</div></div><div><div class="l">Measured now</div><div class="v" style="color:${probColor(lastA.actual)}">${pc(lastA.actual)}</div></div><div><div class="l">Value protected so far</div><div class="v pos">${m(Math.max(0, realised))}</div></div><div><div class="l">Target value</div><div class="v">${m(ap.protected)}</div></div></div>
      <h4 style="margin:14px 0 8px;font-size:13px">Actions</h4>
      <div class="actions-list">${chosen.map((o, i) => { const st = idx >= 2 + i * 2 ? ['Done', 'ok'] : idx >= 1 + i ? ['In progress', 'warn'] : ['Scheduled', '']; return `<div class="act"><span class="oid">${o.id}</span><div><b style="font-size:13px">${esc(o.label)}</b><div class="note">${o.owner} · ${o.time}</div></div><span class="chip ${st[1]}">${st[0]}</span></div>`; }).join('')}</div>
      <button class="btn ghost" data-go="governance" style="margin-top:8px">View audit trail →</button>
    </div></div>`;
}

/* ================= 7. Process Optimisation ================= */
function process() {
  const ind = FX.ind(), w = ind.workflow, opt = S.procView === 'future';
  const cur = w.stages.reduce((s, x) => s + x.current, 0), fut = w.stages.reduce((s, x) => s + x.optimised, 0);
  const bn = w.stages.find(s => s.status === 'bottleneck');
  const max = Math.max(...w.stages.map(s => s.current));
  return ph('07 · Process Optimisation', `End-to-end ${FX.lc(ind.terms.entity)} flow: find the bottleneck and fix it`, `Process mining on timestamps from ${ind.systems.slice(0, 3).map(s => s.name).join(', ')} shows where time is lost and what the AI would change.`, `<div class="seg"><button class="${!opt ? 'on' : ''}" data-view="current">Current state</button><button class="${opt ? 'on' : ''}" data-view="future">✦ AI-optimised future state</button></div>`)
  + `<div class="card"><div class="flow">${w.stages.map((s, i) => `${i ? '<div class="farrow">→</div>' : ''}<div class="fnode ${opt ? 'opt-state' : s.status}"><div class="st">${opt ? (s.optimised < s.current ? '✦ improved' : 'unchanged') : s.status === 'bottleneck' ? '● bottleneck' : s.status === 'warn' ? '● watch' : '● healthy'}</div><h4>${esc(s.stage)}</h4><div class="ct">${opt ? s.optimised : s.current} <small>${w.unit}</small></div>${opt && s.optimised < s.current ? `<div class="note pos">−${+(s.current - s.optimised).toFixed(1)} ${w.unit}</div>` : ''}<p>${esc(s.note)}</p></div>`).join('')}</div></div>
  <div class="g g-12 mt">
    <div class="card"><h3>End-to-end lead time</h3><div class="sub">Sum of stage cycle times</div>
      <div class="lt"><div><div class="l">Current</div><div class="v">${+cur.toFixed(1)} <small style="font-size:14px">${w.unit}</small></div></div><div style="font-size:24px;color:var(--subtle)">→</div><div><div class="l">AI-optimised</div><div class="v pos">${+fut.toFixed(1)} <small style="font-size:14px">${w.unit}</small></div></div></div>
      <div class="rec-strip mt"><div class="big">−${Math.round((1 - fut / cur) * 100)}%</div><div>faster cycle time, freeing capacity and cutting the ${FX.lc(ind.terms.successMetric)} risks this demo tracks.</div></div>
      <div style="margin-top:14px">${w.stages.map(s => `<div class="hp" style="grid-template-columns:120px 1fr 60px;margin-bottom:6px"><span style="font-size:12px">${esc(s.stage)}</span><div style="position:relative;height:14px"><div class="bar" style="height:14px;position:absolute;inset:0"><i style="width:${s.current / max * 100}%;background:${s.status === 'bottleneck' ? 'var(--risk)' : 'var(--subtle)'};opacity:.45"></i></div><div class="bar" style="height:6px;position:absolute;left:0;right:0;top:4px;background:transparent"><i style="width:${s.optimised / max * 100}%;background:var(--ok)"></i></div></div><span class="note">${s.current}→${s.optimised}</span></div>`).join('')}<div class="legend"><span><i style="background:var(--subtle)"></i>Current</span><span><i style="background:var(--ok)"></i>Optimised</span></div></div>
    </div>
    <div class="card"><div class="ch"><div><h3>AI recommendations</h3><div class="sub">Ranked by cycle-time saving</div></div><span class="chip high r">Bottleneck: ${esc(bn ? bn.stage : '—')}</span></div>
      <div class="ai-box"><b class="lbl">Diagnosis</b><b>${esc(bn.stage)}</b> takes ${bn.current} ${w.unit}, ${Math.round(bn.current / cur * 100)}% of total lead time. ${esc(bn.note)}. It is the constraint on the whole flow, so improving it has the biggest effect.</div>
      ${w.recommendations.map((r, i) => `<div class="drv"><div class="h"><span class="oid" style="width:26px;height:26px;border-radius:7px;background:var(--accent-soft);color:var(--accent-ink);display:grid;place-items:center;font-weight:800;font-size:12px">${i + 1}</span><b>${esc(r.stage)}</b><span class="pct" style="color:var(--ok)">${r.saving}</span></div><p style="margin-left:34px">${esc(r.text)}</p></div>`).join('')}
      <div class="foot" style="margin-top:8px"><button class="btn sec" data-ask="Why is ${FX.lc(ind.terms.entity)} flow behind schedule?">💬 Ask why</button><span class="sp"></span><button class="btn pri" id="pilotBtn">Propose a pilot</button></div>
    </div></div>`;
}
BIND_PROCESS = () => {
  $$('[data-view]').forEach(b => b.onclick = () => { S.procView = b.dataset.view; render(); });
  $('#pilotBtn').onclick = () => { FX.audit('Process pilot proposed', `${FX.ind().workflow.recommendations[0].stage}: ${FX.ind().workflow.recommendations[0].text}`); toast('Pilot proposal logged and sent to the process owner.'); };
};

/* ================= 8. Operations Twin ================= */
function twin() {
  const ind = FX.ind(), tw = ind.twin, all = tw.zones.flatMap(z => z.assets);
  const c = s => all.filter(a => a.status === s).length;
  const sel = all.find(a => a.id === S.twinSel) || all.find(a => a.status === 'risk') || all[0];
  S.twinSel = sel.id;
  return ph('08 · Digital Twin · Operational View', `${tw.title}: live status`, `A live model of your ${FX.lc(ind.terms.site)}, built from ${ind.systems.filter(s => /IoT|MES|WMS|TMS|Ops|Shop|Diag/.test(s.type)).map(s => s.name).join(', ') || ind.systems[1].name}. Status, risk and AI alerts in one place.`, `<span class="live"><i></i>Streaming · synced <span id="syncAgo">just now</span></span>`)
  + `<div class="counts" style="margin-bottom:14px"><span class="chip ok">● ${c('ok')} healthy</span><span class="chip warn">● ${c('warn')} watch</span><span class="chip risk">● ${c('risk')} at risk</span></div>
  <div class="g g-21"><div class="zones">${tw.zones.map(z => `<div class="card zone"><h4>${esc(z.name)}</h4><div class="assets">${z.assets.map(a => `<button class="asset ${a.status} ${a.id === sel.id ? 'sel' : ''}" data-asset="${a.id}"><span class="dot"></span><b>${a.id}</b><div class="k" data-k="${a.id}">${a.kpi}</div><div class="u">${esc(a.unit)}</div></button>`).join('')}</div></div>`).join('')}</div>
  <div class="card" id="assetPanel">${assetPanel(sel)}</div></div>`;
}
function assetPanel(a) {
  const ind = FX.ind(), f = ind.flagship;
  const linked = f.drivers.some(d => (d.evidence + d.label).includes(a.id)) || a.status === 'risk';
  return `<div class="ch"><div><span class="chip ${a.status}">${a.status === 'risk' ? 'At risk' : a.status === 'warn' ? 'Watch' : 'Healthy'}</span><h3 style="margin-top:8px;font-size:20px">${a.id}</h3><div class="sub">${esc(ind.twin.zones.find(z => z.assets.includes(a)).name)} · ${FX.lc(ind.terms.asset)} / resource</div></div></div>
    <div class="fact"><div class="l">Current reading</div><div class="v" style="font-size:24px"><span data-k="${a.id}">${a.kpi}</span> <small class="muted" style="font-size:13px">${esc(a.unit)}</small></div></div>
    ${a.alert ? `<div class="ai-box mt"><b class="lbl">✦ AI alert</b>${esc(a.alert)}.${linked ? ` This contributes to the <b>${f.id}</b> risk.` : ''}</div>` : `<div class="ai-box mt"><b class="lbl">✦ AI status</b>Operating within normal range. No anomalies in the last 24 h.</div>`}
    <div class="mt">${Charts.spark([...Array(14)].map((_, i) => a.kpi * (1 + Math.sin(i * 1.3 + a.id.length) * 0.04 - (a.status === 'risk' ? i * 0.006 : 0))), { w: 300, h: 60, color: a.status === 'risk' ? 'var(--risk)' : 'var(--accent)' })}<div class="note">Last 14 readings</div></div>
    <div class="foot">${linked ? `<button class="btn pri" data-go="decision" data-stage="1">Open ${f.id} decision →</button>` : ''}<button class="btn sec" data-ask="Why is ${a.id} flagged?">💬 Ask AI</button></div>`;
}
BIND_TWIN = () => { $$('[data-asset]').forEach(b => b.onclick = () => { S.twinSel = b.dataset.asset; render(); }); S._sync = Date.now(); };
function jitterTwin() {
  const all = FX.ind().twin.zones.flatMap(z => z.assets);
  $$('[data-k]').forEach(el => { const a = all.find(x => x.id === el.dataset.k); if (!a) return; const d = Math.abs(a.kpi) < 20 ? 0.1 : 1; const v = a.kpi + (Math.random() - 0.5) * 2 * d * (Math.abs(a.kpi) < 20 ? 3 : 1); el.textContent = Math.abs(a.kpi) < 20 ? v.toFixed(1) : Math.round(v); });
  const s = $('#syncAgo'); if (s) s.textContent = 'just now';
}

/* ================= 6. AI Enterprise Assistant ================= */
function assistant() {
  const ind = FX.ind(), role = FX.ROLES[FX.role()];
  if (!S.chat.length) { const a = Assistant.answer('hello'); S.chat.push({ r: 'a', ...a }); }
  return ph('06 · AI Enterprise Assistant', 'Ask the business anything', `Answers come from your connected systems and documents, with citations. Nothing is invented and nothing leaves your environment.`)
  + `<div class="chat-wrap"><div class="card chat"><div class="msgs" id="msgs">${S.chat.map(msgHTML).join('')}</div>
      <div class="prompts">${ind.prompts.map(p => `<button data-q="${esc(p)}">${esc(p)}</button>`).join('')}</div>
      <form class="composer" id="composer"><input id="q" placeholder="Ask about ${FX.lc(ind.terms.entityPlural)}, risks, ${FX.lc(ind.terms.supplier)}s, value, or 'what if…'" autocomplete="off"><button class="btn pri">Send</button></form></div>
    <div style="display:grid;gap:16px;align-content:start;overflow:auto">
      <div class="card"><h3>How this answer was grounded</h3><div class="sub">Retrieval-augmented generation (RAG)</div>
        <div class="rag">${[['Question', 'Intent and entities detected'], ['Retrieve', 'Vector + keyword search, scoped to your role'], ['Ground', 'Live figures from systems of record'], ['Answer', 'Private LLM composes a grounded reply'], ['Cite', 'Every claim links to a source']].map((s, i) => `<div class="s on"><span class="n">${i + 1}</span><div><b>${s[0]}</b> <span class="muted">${s[1]}</span></div></div>`).join('')}</div></div>
      <div class="card"><h3>Sources for the last answer</h3><div class="srcs" id="srcs">${srcsHTML(S.lastSources)}</div></div>
      <div class="card"><h3>Enterprise security</h3><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px"><span class="chip ok">🔒 Private LLM, in your environment</span><span class="chip ok">👤 Scoped to ${role.name}</span><span class="chip ok">🛡 PII masked</span><span class="chip ok">📜 Every query audited</span><span class="chip ok">🚫 No training on your data</span></div><div class="note" style="margin-top:8px">Data scope: ${role.scope}.</div></div>
    </div></div>`;
}
function msgHTML(x) {
  if (x.r === 'u') return `<div class="msg u">${esc(x.text)}</div>`;
  if (x.typing) return `<div class="msg a"><div class="who">✦ ${FX.cfg().platform.name} AI</div><span class="typing"><i></i><i></i><i></i></span></div>`;
  return `<div class="msg a"><div class="who">✦ ${FX.cfg().platform.name} AI ${x.intent && x.intent !== 'help' ? `<span class="chip" style="font-size:10px">${x.intent}</span>` : ''}</div>${x.html}
    ${x.sources && x.sources.length ? `<div class="cites">${x.sources.map((s, i) => `<span><b>[${i + 1}]</b> ${esc(s.title)} · ${esc(s.source)}</span>`).join('')}</div>` : ''}
    ${x.actions && x.actions.length ? `<div class="sugg">${x.actions.map(a => `<button data-q="${esc(a)}">${esc(a)}</button>`).join('')}</div>` : ''}</div>`;
}
function srcsHTML(src) {
  if (!src || !src.length) return '<div class="note">Ask a question to see the retrieved documents and data sources.</div>';
  return src.map((s, i) => `<div class="src-card"><b>[${i + 1}] ${esc(s.title)}</b><div class="m"><span>${esc(s.source)}</span><span>${s.data ? 'live data' : 'relevance ' + s.score.toFixed(2)}</span></div>${s.text ? `<div class="muted" style="margin-top:4px">${esc(s.text.slice(0, 140))}…</div>` : ''}</div>`).join('');
}
function ask(q) {
  q = (q || '').trim(); if (!q) return;
  S.chat.push({ r: 'u', text: q }, { r: 'a', typing: true });
  if (S.page === 'assistant') { $('#msgs').innerHTML = S.chat.map(msgHTML).join(''); $('#msgs').scrollTop = 1e9; }
  setTimeout(() => {
    const a = Assistant.answer(q);
    S.chat.pop(); S.chat.push({ r: 'a', ...a }); S.lastSources = a.sources;
    FX.audit('Assistant query', q);
    if (S.page === 'assistant') { $('#msgs').innerHTML = S.chat.map(msgHTML).join(''); $('#msgs').scrollTop = 1e9; $('#srcs').innerHTML = srcsHTML(a.sources); }
  }, 650);
}
BIND_ASSISTANT = () => {
  $('#msgs').scrollTop = 1e9;
  $('#composer').onsubmit = e => { e.preventDefault(); const i = $('#q'); ask(i.value); i.value = ''; };
  $('.chat').addEventListener('click', e => { const b = e.target.closest('[data-q]'); if (b) ask(b.dataset.q); });
  $('#q').focus();
};

/* ================= 9. Governance & Responsible AI ================= */
function governance() {
  const ind = FX.ind(), T = ind.terms, st = FX.store.ind(), role = FX.role();
  const seed = [
    { at: Date.now() - 86400000 * 1.2, who: 'Operations Director', action: 'Rejected AI recommendation', detail: 'Overtime on weekend: labour agreement constraint noted, feedback sent to model' },
    { at: Date.now() - 86400000 * 2.4, who: 'Data & AI Team', action: 'Model promoted', detail: 'Outcome-risk v3.2 approved after validation (accuracy 87%, calibration OK)' },
    { at: Date.now() - 86400000 * 3.1, who: 'CEO', action: 'Approved recovery plan', detail: 'Previous at-risk item: 64% → 90%, realised on time' }
  ];
  const log = [...(st.audit || []), ...seed];
  const models = [
    [`${T.successMetric} risk`, 'Logistic (calibrated)', 87, 0.04, 'Healthy'],
    ['Demand / throughput forecast', 'Time series (ESM)', 91, 0.06, 'Healthy'],
    [`${T.asset} failure prediction`, 'Survival model', 83, 0.11, 'Watch drift'],
    ['Cost & price anomaly', 'Isolation forest', 89, 0.03, 'Healthy'],
    ['Recommendation optimiser', 'Constraint search', null, null, 'Healthy'],
    ['Assistant (RAG)', 'Private LLM + retrieval', 94, null, 'Healthy']
  ];
  const pages = ['command', 'risk', 'explain', 'recommend', 'simulate', 'assistant', 'process', 'twin', 'governance', 'decision', 'architecture', 'config'];
  return ph('09 · Governance & Responsible AI', 'Can we trust the AI?', 'Human approval, audit history, explainability, data security, model monitoring and role-based access, built in from day one.') + `<div class="principle"><div style="font-size:40px">🧑‍⚖️</div><div><div class="big">${FX.cfg().platform.principle}</div><p>Every recommendation is explained, every decision is made by an accountable person, and every action is audited.</p></div></div>
  <div class="g g3">
    <div class="card gov"><h3><span class="ic">✋</span>Human approval required</h3><div class="sub">Approval authority by role</div>
      <table class="t matrix"><thead><tr><th>Role</th><th>View</th><th>Recommend</th><th>Approve</th></tr></thead><tbody>${Object.entries(FX.ROLES).map(([k, r]) => `<tr style="${k === role ? 'background:var(--accent-soft)' : ''}"><td>${r.name}</td><td class="yes">✓</td><td class="yes">✓</td><td class="${r.canApprove ? 'yes' : 'no'}">${r.canApprove ? '✓' : '—'}</td></tr>`).join('')}</tbody></table>
      <div class="note" style="margin-top:8px">Spend above policy thresholds escalates automatically, e.g. "${esc((ind.knowledge.find(k => /approv/i.test(k.text)) || ind.knowledge[0]).text.split('. ').find(s => /approv/i.test(s)) || 'Director approval required above threshold')}".</div></div>
    <div class="card gov"><h3><span class="ic">🔍</span>Explainability</h3><div class="sub">No black boxes</div>
      <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.8"><li>Every prediction is broken down into its drivers</li><li>"Show the maths" on every score</li><li>Evidence linked to source records</li><li>Model cards: purpose, data, limits, owner</li><li>Assistant answers always carry citations</li></ul>
      <button class="btn ghost" data-go="decision" data-stage="1" style="padding-left:0;margin-top:6px">See a live explanation →</button></div>
    <div class="card gov"><h3><span class="ic">🔒</span>Data security</h3><div class="sub">Your data stays yours</div>
      <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.8"><li>Deployed on-premises or in your private cloud</li><li>Read-only connectors to systems of record</li><li>SSO + role-based access control</li><li>PII masking before retrieval</li><li>Private LLM: no training on your data</li><li>Encryption in transit and at rest</li></ul></div>
  </div>
  <div class="g g-21 mt">
    <div class="card gov"><h3><span class="ic">📈</span>Model monitoring</h3><div class="sub">Accuracy, drift and status, reviewed weekly</div>
      <table class="t"><thead><tr><th>Model</th><th>Type</th><th>Accuracy</th><th>Drift (PSI)</th><th>Trend</th><th>Status</th></tr></thead><tbody>${models.map((x, i) => `<tr><td><b>${esc(x[0])}</b></td><td class="muted">${x[1]}</td><td>${x[2] ? x[2] + '%' : '—'}</td><td>${x[3] != null ? x[3].toFixed(2) : '—'}</td><td>${x[2] ? Charts.spark([...Array(10)].map((_, k) => x[2] + Math.sin(k + i) * 1.2 - (x[4] !== 'Healthy' ? k * 0.35 : 0)), { w: 80, h: 22, color: x[4] === 'Healthy' ? 'var(--ok)' : 'var(--attn)' }) : ''}</td><td><span class="chip ${x[4] === 'Healthy' ? 'ok' : 'warn'}">${x[4]}</span></td></tr>`).join('')}</tbody></table>
      <div class="note" style="margin-top:8px">PSI above 0.10 triggers a review. Retrained models are promoted only after human sign-off.</div></div>
    <div class="card gov"><h3><span class="ic">📜</span>Audit history</h3><div class="sub">Immutable log: who, what, when, and the evidence</div>
      <div class="audit">${log.map(e => `<div class="e"><time>${new Date(e.at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}<br><b style="color:var(--ink)">${esc(e.who)}</b></time><div><b>${esc(e.action)}</b><div class="muted">${esc(e.detail)}</div></div></div>`).join('')}</div></div>
  </div>
  <div class="card gov mt"><h3><span class="ic">👥</span>Role-based access</h3><div class="sub">What each role can see. Switch roles in the top bar to try it.</div>
    <table class="t matrix"><thead><tr><th>Role</th>${pages.map(p => `<th style="font-size:10px" title="${TITLES[p]}">${(TITLES[p].match(/^\d\d/) || [TITLES[p].split(' ')[0]])[0]}</th>`).join('')}<th>Data scope</th></tr></thead><tbody>${Object.entries(FX.ROLES).map(([k, r]) => `<tr style="${k === role ? 'background:var(--accent-soft)' : ''}"><td><b>${r.name}</b></td>${pages.map(p => `<td class="${r.pages === '*' || r.pages.includes(p) ? 'yes' : 'no'}">${r.pages === '*' || r.pages.includes(p) ? '✓' : '—'}</td>`).join('')}<td class="muted" style="font-size:12px">${r.scope}</td></tr>`).join('')}</tbody></table></div>`;
}

/* ================= Data & AI Architecture ================= */
function architecture() {
  const ind = FX.ind(), cfg = FX.cfg();
  const mods = [['Business Performance', 'How are we doing?'], ['Predictive Risk', 'What will go wrong?'], ['Explainable AI', 'Why?'], ['Recommendations', 'What should we do?'], ['What-If Simulation', 'What happens if…?'], ['AI Assistant (RAG)', 'Ask anything'], ['Process Optimisation', 'Where is time lost?'], ['Operations Twin', 'What is happening now?'], ['Governance', 'Can we trust it?']];
  return ph('Data & AI Platform Architecture', 'An intelligence layer on top of the systems you already have', cfg.platform.promise)
  + `<div class="g" style="gap:0">
    <div class="layer"><div class="lh"><b>① Existing systems · systems of record (unchanged)</b><span class="chip">${ind.name}</span></div><div class="boxes">${ind.systems.map(s => `<div class="box"><b>${s.name}</b><span>${s.type} · ${s.provides}</span></div>`).join('')}</div></div>
    <div class="down">read-only connectors</div>
    <div class="layer"><div class="lh"><b>② Data integration layer</b></div><div class="boxes">${[['Connectors', 'APIs · CDC · batch extracts · IoT streams'], ['Validate & reconcile', 'Quality rules, keys, timestamps'], ['Canonical model', `${ind.terms.entity} · ${ind.terms.asset} · Material · ${ind.terms.supplier} · ${ind.terms.customer}`], ['Feature store', 'Versioned, reproducible ML features'], ['Vector index', 'SOPs, contracts, policies for RAG']].map(x => `<div class="box"><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')}</div></div>
    <div class="down">governed features &amp; documents</div>
    <div class="layer platform"><div class="lh"><b>③ ${cfg.platform.name} · ${cfg.platform.product}</b><span class="chip ai">Configured by industry-config.js</span></div><div class="boxes">${mods.map(x => `<div class="box"><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')}</div>
      <div class="boxes" style="margin-top:10px">${[['ML services', 'Prediction · forecasting · anomaly · survival'], ['Decision engine', 'Optimiser · simulator · financial model'], ['Private LLM', 'On-prem or private-tenant, no data egress'], ['MLOps & monitoring', 'Model registry, drift, retraining'], ['Security', 'SSO · RBAC · PII masking · audit']].map(x => `<div class="box" style="background:transparent"><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')}</div></div>
    <div class="down">insights, alerts, decisions</div>
    <div class="layer"><div class="lh"><b>④ Channels &amp; people</b></div><div class="boxes">${[['Executives', 'Command centre · mobile approvals'], ['Managers', 'Decision studio · process & twin views'], ['Operators', 'Alerts · assistant · task lists'], ['Existing systems', 'Approved actions become tasks or workflow in the ERP/MES (optional write-back)']].map(x => `<div class="box"><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')}</div></div>
  </div>
  <div class="g g3 mt">
    <div class="card"><h3>What stays the same</h3><ul style="padding-left:18px;font-size:13px;line-height:1.8;margin:8px 0 0"><li>${ind.systems[0].name} remains the system of record</li><li>Existing processes, users and reports</li><li>No rip-and-replace, no data migration</li></ul></div>
    <div class="card"><h3>What's new</h3><ul style="padding-left:18px;font-size:13px;line-height:1.8;margin:8px 0 0"><li>Predictions days before problems happen</li><li>Explanations, recommendations and what-if</li><li>Decisions in minutes on desktop or mobile</li></ul></div>
    <div class="card"><h3>Deployment options</h3><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px"><span class="chip src">On-premises</span><span class="chip src">Private cloud (Azure / AWS / OCI)</span><span class="chip src">Hybrid</span></div><div class="note" style="margin-top:8px">Works with Oracle, SAP, Dynamics, Infor, Epic and custom systems through standard connectors.</div></div>
  </div>
  <div class="card mt"><h3>Adoption path</h3><div class="sub">From first conversation to business value</div>
    <div class="steps4">${[['Weeks 0–2', 'Discover', 'Pick 1–2 high-value decisions and map the source data.'], ['Weeks 3–8', 'Pilot', 'Connect read-only, train models, run with a small team.'], ['Weeks 9–12', 'Prove value', 'Measure expected vs actual and decision time saved.'], ['Quarter 2+', 'Scale', 'Add modules, sites and write-back workflows.']].map((x, i) => `<div><span class="n">${x[0].toUpperCase()}</span><b>${i + 1}. ${x[1]}</b><p>${x[2]}</p></div>`).join('')}</div></div>`;
}

/* ================= Industry Configuration Layer ================= */
function config() {
  const cfg = FX.cfg(), ind = FX.ind();
  const json = JSON.stringify(ind, null, 2).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
    .replace(/("(?:\\.|[^"\\])*")(\s*:)?|\b(-?\d+(?:\.\d+)?)\b/g, (x, s, colon, n) => s ? (colon ? `<span class="k">${s}</span>${colon}` : `<span class="s">${s}</span>`) : `<span class="n">${n}</span>`);
  return ph('Industry Configuration Layer', 'One platform, any industry: configuration, not code', `Terminology, KPIs, risks, workflows, scenarios, knowledge and the digital twin all come from one plain JavaScript data file, <span class="mono">config/industry-config.js</span>, with no server and no build step. Choose an industry to reconfigure the whole demo.`, `<button class="btn sec" id="dlCfg">⬇ Export as JSON</button>`)
  + `<div class="ind-grid">${cfg.industries.map(i => `<button class="ind-card ${i.id === ind.id ? 'on' : ''}" data-ind="${i.id}"><div class="ico">${i.icon}</div><b>${i.name}</b><span>${i.sector} · ${i.systems.slice(0, 2).map(s => s.name).join(', ')}</span></button>`).join('')}</div>
  <div class="card mt"><h3>Same engine, different language</h3><div class="sub">How the generic concepts map to each industry</div>
    <div style="overflow-x:auto"><table class="t"><thead><tr><th>Industry</th><th>Entity</th><th>Success metric</th><th>Typical risk</th><th>Root cause</th><th>AI action</th><th>Workflow</th></tr></thead><tbody>${cfg.industries.map(i => `<tr style="${i.id === ind.id ? 'background:var(--accent-soft)' : ''}" class="click" data-ind="${i.id}"><td><b>${i.icon} ${i.name}</b></td><td>${i.terms.entity}</td><td>${i.terms.successMetric}</td><td>${esc(i.flagship.risk)}</td><td>${esc(i.flagship.drivers[0].label)}</td><td>${esc(i.flagship.options[0].label)}</td><td class="note">${i.workflow.stages.map(s => s.stage).join(' → ')}</td></tr>`).join('')}</tbody></table></div></div>
  <div class="g g-12 mt">
    <div class="card"><h3>Add a new industry in four steps</h3><div class="steps4" style="grid-template-columns:1fr;margin-top:10px">${[['Copy', 'Duplicate an existing industry block in config/industry-config.js.'], ['Rename', 'Set the terms: entity, customer, asset, unit, success metric.'], ['Describe', 'Add KPIs, workflow stages, risks, drivers, options and the twin layout.'], ['Ground', 'Add knowledge documents (SOPs, contracts, policies) for the assistant.']].map((x, i) => `<div><span class="n">STEP ${i + 1}</span><b>${x[0]}</b><p>${x[1]}</p></div>`).join('')}</div>
      <div class="note" style="margin-top:10px">Schema: <span class="mono">id, name, icon, systems[], terms{}, kpis[], health, revenue, trend, flagship{drivers[], options[], stress}, portfolio[], predictions[], anomalies[], savings[], workflow{stages[], recommendations[]}, twin{zones[]}, alerts[], knowledge[], prompts[]</span></div></div>
    <div class="card"><div class="ch"><div><h3>${ind.icon} ${ind.name}: live configuration</h3><div class="sub">This block drives every screen you've seen</div></div></div><pre class="json">${json}</pre></div>
  </div>`;
}
BIND_CONFIG = () => {
  $('#dlCfg').onclick = () => { const b = new Blob([JSON.stringify(FX.cfg(), null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'industry-config.json'; a.click(); URL.revokeObjectURL(a.href); };
};

/* ================= registry & boot ================= */
var BIND_RISK, BIND_PROCESS, BIND_TWIN, BIND_ASSISTANT, BIND_CONFIG;
const PAGES = { home, command, risk, explain, recommend, simulate, decision, process, twin, assistant, governance, architecture, config };
const BIND = {
  risk: () => BIND_RISK(), process: () => BIND_PROCESS(), twin: () => BIND_TWIN(), assistant: () => BIND_ASSISTANT(), config: () => BIND_CONFIG(),
  recommend: () => { bindOptions(); $$('[data-assign]').forEach(b => b.onclick = () => { FX.audit('Recommendation assigned', b.closest('tr').children[1].textContent); b.textContent = '✓ Assigned'; b.disabled = true; toast('Assigned to the owner and logged in the audit trail.'); }); },
  simulate: () => bindSimulate(),
  decision: () => { if (S.stage === 2) bindOptions(); if (S.stage === 3) bindSimulate(); if (S.stage === 4) bindApprove(); }
};

(function boot() {
  try { const th = localStorage.getItem('foresight-theme'); if (th) document.documentElement.dataset.theme = th; } catch {}
  try {
    FX.load();
  } catch (e) {
    app.innerHTML = `<div class="card empty"><h3>Couldn't load the configuration</h3><p>Check that <span class="mono">config/industry-config.js</span> sits next to this page and has no syntax errors (open the browser console for details).</p></div>`;
    return;
  }
  FX.setIndustry(FX.store.all().industry || FX.cfg().platform.defaultIndustry);
  resetScenario();
  initShell();
  const [p, st] = location.hash.slice(1).split('/');
  if (p && TITLES[p] && canSee(p)) { S.page = p; if (st != null && !isNaN(+st)) S.stage = +st; }
  if (S.page === 'decision') S.journeyStart = Date.now();
  render();
})();
