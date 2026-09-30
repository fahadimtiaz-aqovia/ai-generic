/* Foresight decision engine — industry-agnostic.
   Everything here works on the shape of config/industry-config.js, never on
   industry-specific names, so a new industry is a config change only. */
const FX = (() => {
  const logit = p => Math.log(p / (1 - p));
  const sig = x => 1 / (1 + Math.exp(-x));
  const clampP = p => Math.min(99.5, Math.max(0.5, p));
  const OVERLAP = [1, 0.8, 0.65, 0.5]; // diminishing returns when levers stack

  let CFG = null, IND = null;

  // Config comes from config/industry-config.js via a plain <script> tag:
  // no fetch, no server, no build step — the app runs as static files.
  function load() {
    if (!window.FORESIGHT_CONFIG) throw new Error('config/industry-config.js is missing or has a syntax error');
    CFG = window.FORESIGHT_CONFIG;
    return CFG;
  }
  const cfg = () => CFG;
  const ind = () => IND;
  function setIndustry(id) {
    IND = CFG.industries.find(i => i.id === id) || CFG.industries.find(i => i.id === CFG.platform.defaultIndustry) || CFG.industries[0];
    store.set({ industry: IND.id });
    return IND;
  }
  const t = key => (IND && IND.terms[key]) || key;
  // Lower-case a label for mid-sentence use without mangling acronyms (QC, HPLC, API).
  const lc = s => /^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s;

  function money(v, opts = {}) {
    const s = (IND && IND.currency.symbol) || '$';
    const a = Math.abs(v), sign = v < 0 ? '−' : '';
    if (a >= 1e6) return `${sign}${s}${(a / 1e6).toFixed(a >= 1e7 ? 1 : 2).replace(/\.?0+$/, '')}M`;
    if (a >= 1e3) return `${sign}${s}${Math.round(a / 1e3)}K`;
    return `${sign}${s}${Math.round(a)}`;
  }

  /* ---- Explainable AI: decompose the log-odds gap exactly ---- */
  function explain(f) {
    const healthy = CFG.platform.healthyBaseline;
    const lH = logit(healthy / 100), lB = logit(f.base / 100), gap = lH - lB;
    const tot = f.drivers.reduce((s, d) => s + d.impact, 0);
    const drivers = f.drivers.map(d => {
      const share = d.impact / tot;
      return { ...d, share, logodds: gap * share, pts: (healthy - f.base) * share };
    });
    return { healthy, base: f.base, lH, lB, gap, drivers };
  }

  /* ---- Recommendation engine ---- */
  const lift = (f, o) => logit(clampP(f.base + o.uplift) / 100) - logit(f.base / 100);

  function simulate(f, levels = {}, stress = 0) {
    const lifts = f.options.map(o => lift(f, o) * (levels[o.id] || 0)).sort((a, b) => b - a);
    const combined = lifts.reduce((s, l, i) => s + l * (OVERLAP[i] ?? 0.4), 0);
    const st = f.stress || { perUnit: 0, costPerUnit: 0 };
    const x = logit(f.base / 100) + combined - stress * st.perUnit;
    const prob = clampP(sig(x) * 100);
    const leverCost = f.options.reduce((s, o) => s + o.cost * (levels[o.id] || 0), 0);
    const stressCost = stress * (st.costPerUnit || 0);
    const cost = leverCost + stressCost;
    const protectedV = f.value * (prob - f.base) / 100;
    return {
      prob, cost, leverCost, stressCost,
      protected: protectedV, net: protectedV - leverCost,
      atRisk: f.value * (1 - prob / 100), baseAtRisk: f.value * (1 - f.base / 100),
      roi: leverCost ? protectedV / leverCost : 0
    };
  }

  function optionImpact(f, o) { return simulate(f, { [o.id]: 1 }); }

  /* Search lever combinations (0 / 50% / 100%): best net value that meets the target. */
  function recommend(f) {
    const steps = [0, 0.5, 1], ids = f.options.map(o => o.id), target = CFG.platform.recommendTarget;
    let best = null, bestAny = null;
    const walk = (i, lv) => {
      if (i === ids.length) {
        const r = simulate(f, lv);
        const cand = { levels: { ...lv }, ...r };
        if (!bestAny || r.net > bestAny.net) bestAny = cand;
        if (r.prob >= target && (!best || r.net > best.net)) best = cand;
        return;
      }
      for (const s of steps) { lv[ids[i]] = s; walk(i + 1, lv); }
    };
    walk(0, {});
    return best || bestAny;
  }

  /* Outcome monitoring: expected ramp vs "actual" measured (deterministic jitter). */
  function monitor(f, approved) {
    const n = 7, out = [];
    const elapsed = Math.min(n - 1, 2 + Math.floor((Date.now() - approved.at) / 20000)); // advances as the demo runs
    for (let i = 0; i < n; i++) {
      const k = i / (n - 1), ease = 1 - Math.pow(1 - k, 2);
      const exp = f.base + (approved.prob - f.base) * ease;
      const noise = [0, -2.1, -1.2, 0.8, -0.6, 0.4, 0.9][i];
      out.push({ label: i === 0 ? 'Approved' : `Day ${i}`, expected: exp, actual: i <= elapsed ? Math.min(99, exp + noise) : null });
    }
    return out;
  }

  /* ---- Portfolio & value rollups ---- */
  function rollup() {
    const f = IND.flagship, rec = recommend(f);
    const atRisk = IND.portfolio.filter(p => p.prob < 80);
    const valueAtRisk = IND.portfolio.reduce((s, p) => s + p.value * (1 - p.prob / 100), 0);
    // Other at-risk items assume the same recovery ratio as the flagship plan.
    const ratio = rec.protected / (f.value * (1 - f.base / 100));
    const protectable = atRisk.reduce((s, p) => s + p.value * (1 - p.prob / 100) * ratio, 0);
    const costRatio = rec.leverCost / rec.protected;
    const cost = protectable * costRatio;
    return { valueAtRisk, protectable, cost, net: protectable - cost, atRiskCount: atRisk.length, rec };
  }

  /* ---- Shared state (desktop + mobile share one origin) ---- */
  const KEY = 'foresight-v1';
  const store = {
    all() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } },
    set(patch) { try { localStorage.setItem(KEY, JSON.stringify({ ...store.all(), ...patch })); } catch {} },
    ind(id = IND.id) { return (store.all().byInd || {})[id] || { approved: null, audit: [] }; },
    setInd(patch, id = IND.id) {
      const a = store.all(), byInd = a.byInd || {};
      byInd[id] = { ...store.ind(id), ...patch };
      store.set({ byInd });
    },
    reset() { try { const a = store.all(); localStorage.setItem(KEY, JSON.stringify({ industry: a.industry, role: a.role })); } catch {} }
  };

  function audit(action, detail, who) {
    const s = store.ind();
    s.audit = [{ at: Date.now(), who: who || roleName(), action, detail }, ...(s.audit || [])].slice(0, 40);
    store.setInd({ audit: s.audit });
  }

  function approve(levels, stress, channel) {
    const f = IND.flagship, r = simulate(f, levels, stress);
    const approved = { at: Date.now(), levels, stress, prob: r.prob, cost: r.leverCost, net: r.net, protected: r.protected, by: roleName(), channel };
    store.setInd({ approved });
    const chosen = f.options.filter(o => levels[o.id]).map(o => `${o.id}${levels[o.id] < 1 ? ' (50%)' : ''}`).join(' + ') || 'none';
    audit('Approved recovery plan', `${f.id}: options ${chosen} · ${f.base}% → ${Math.round(r.prob)}% · cost ${money(r.leverCost)} · net ${money(r.net)} · via ${channel}`);
    return approved;
  }

  /* ---- Roles (RBAC) ---- */
  const ROLES = {
    ceo: { name: 'CEO', canApprove: true, scope: 'All business data', pages: '*' },
    ops: { name: 'Operations Director', canApprove: true, scope: 'Operations, production, quality', pages: ['home', 'command', 'risk', 'explain', 'recommend', 'simulate', 'decision', 'process', 'twin', 'assistant', 'governance'] },
    proc: { name: 'Procurement Manager', canApprove: false, scope: 'Suppliers, purchasing, spend', pages: ['home', 'command', 'risk', 'explain', 'recommend', 'simulate', 'decision', 'assistant', 'governance'] },
    data: { name: 'Data & AI Team', canApprove: false, scope: 'Models, pipelines, metadata', pages: ['home', 'command', 'risk', 'explain', 'assistant', 'governance', 'architecture', 'config'] }
  };
  const role = () => ROLES[store.all().role] ? store.all().role : 'ceo';
  const roleName = () => ROLES[role()].name;

  return { load, cfg, ind, setIndustry, t, lc, money, explain, lift, simulate, optionImpact, recommend, monitor, rollup, store, audit, approve, ROLES, role, roleName, logit, sig };
})();
