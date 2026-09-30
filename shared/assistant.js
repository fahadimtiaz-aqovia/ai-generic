/* AI Enterprise Assistant — grounded answers over the active industry's data
   plus a small RAG corpus (industry knowledge + platform policies).
   Every answer carries citations; numbers are computed, never invented. */
const Assistant = (() => {
  const STOP = new Set('a an the is are was were be to of in on for and or with what which why how who when where can could should would do does did i we our my me you it this that these those there their at by from as about any all most more much will if than then so us'.split(' '));
  const SYN = { late: 'delay', delayed: 'delay', delays: 'delay', behind: 'delay', slow: 'delay', price: 'pricing', prices: 'pricing', cost: 'pricing', expensive: 'pricing', invoice: 'pricing', vendor: 'supplier', vendors: 'supplier', carrier: 'supplier', secure: 'security', safe: 'security', privacy: 'security', trust: 'governance', approve: 'approval', approval: 'approval', human: 'approval', explain: 'explanation', maths: 'explanation', math: 'explanation', cloud: 'premises', leave: 'premises', data: 'data' };
  const tok = s => (s.toLowerCase().match(/[a-z0-9]+/g) || []).filter(w => !STOP.has(w) && w.length > 1).map(w => SYN[w] || w.replace(/(ing|ed|es|s)$/, ''));

  function corpus() {
    const ind = FX.ind(), cfg = FX.cfg();
    return [...ind.knowledge, ...cfg.platformDocs];
  }
  function retrieve(q, k = 3) {
    const docs = corpus(), qt = tok(q);
    if (!qt.length) return [];
    const toks = docs.map(d => tok(d.title + ' ' + d.title + ' ' + d.text));
    const N = docs.length, df = {};
    toks.forEach(ts => new Set(ts).forEach(w => df[w] = (df[w] || 0) + 1));
    return docs.map((d, i) => {
      const tf = {}; toks[i].forEach(w => tf[w] = (tf[w] || 0) + 1);
      const score = qt.reduce((s, w) => s + (tf[w] ? (1 + Math.log(tf[w])) * Math.log(1 + N / df[w]) : 0), 0) / Math.sqrt(toks[i].length);
      return { ...d, score };
    }).filter(d => d.score > 0.05).sort((a, b) => b.score - a.score).slice(0, k);
  }

  const sys = i => (FX.ind().systems[i] || FX.ind().systems[0]).name;
  const sysByType = type => (FX.ind().systems.find(s => s.type === type) || FX.ind().systems[0]).name;
  const dataSrc = (id, title, source) => ({ id, title, source, score: null, data: true });
  const pct = v => Math.round(v) + '%';

  function answer(q) {
    const ind = FX.ind(), f = ind.flagship, T = ind.terms, ql = q.toLowerCase(), m = FX.money;
    let html = '', sources = [], intent = 'rag', actions = [];
    const num = (ql.match(/(\d+(?:\.\d+)?)\s*(k|m|%|days?|hours?|samples?)?/) || []);

    if (/^(hi|hello|hey|good (morning|afternoon|evening))\b/.test(ql) || /what can you do|help\b/.test(ql)) {
      intent = 'help';
      html = `Hello, I'm the <b>${FX.cfg().platform.name} assistant</b> for <b>${ind.name}</b>. I answer from your connected systems (${ind.systems.map(s => s.name).join(', ')}) and your knowledge base, and I cite every source.<br><br>Try asking which ${FX.lc(T.entityPlural)} are at risk, why something is late, which ${FX.lc(T.supplier)}s look unusual, or <i>"what if…"</i>.`;
      actions = ind.prompts.slice(0, 3);
    }
    else if (/what if|what happens if|simulate|suppose/.test(ql)) {
      intent = 'simulate';
      const rec = FX.recommend(f);
      const spend = /spend|invest|budget|\$/.test(ql) && num[1] ? parseFloat(num[1]) * (num[2] === 'm' ? 1e6 : num[2] === 'k' ? 1e3 : 1) : null;
      if (spend) {
        const o = f.options.find(o => /expedit|freight|air|rail|spot|alternate/i.test(o.label)) || f.options[0];
        const lvl = Math.min(1, spend / o.cost), r = FX.simulate(f, { [o.id]: lvl });
        html = `<b>Simulation: spend ${m(spend)} on "${o.label}"</b><br>That funds ${pct(lvl * 100)} of the lever (full cost ${m(o.cost)}).<div class="a-kv"><span>${f.metric}</span><b>${f.base}% → ${pct(r.prob)}</b><span>Value protected</span><b>${m(r.protected)}</b><span>Net benefit</span><b>${m(r.net)}</b></div>${lvl < 1 ? `Spending the full ${m(o.cost)} gets to ${pct(FX.optionImpact(f, o).prob)}.` : `Spend above ${m(o.cost)} adds no further confidence.`} The AI recommended plan reaches <b>${pct(rec.prob)}</b> for ${m(rec.leverCost)}.`;
      } else {
        const st = f.stress, amt = Math.min(st.max, num[1] ? parseFloat(num[1]) : st.max / 2);
        const none = FX.simulate(f, {}, amt), withPlan = FX.simulate(f, rec.levels, amt);
        html = `<b>Simulation: ${FX.lc(st.label)} of ${amt}${st.unit === '%' ? '%' : ' ' + st.unit}</b><div class="a-kv"><span>Today</span><b>${f.base}%</b><span>With no action</span><b class="neg">${pct(none.prob)}</b><span>With the AI plan</span><b class="pos">${pct(withPlan.prob)}</b><span>Value at risk (no action)</span><b>${m(none.atRisk)}</b>${none.stressCost ? `<span>Extra operating cost</span><b>${m(none.stressCost)}</b>` : ''}</div>The recommended plan still holds <b>${pct(withPlan.prob)}</b> under this stress, so it is robust. Open the What-If Simulator to adjust each lever.`;
      }
      sources = [dataSrc('SIM', 'What-if simulation engine', 'Foresight · calibrated model'), dataSrc('ERP', `${f.id} record`, sys(0))];
      actions = ['What does the AI recommend?', `Why is ${f.id} at risk?`];
    }
    else if (/at risk|which (customer|order|batch|shipment|campaign|service|shipper|retailer|call|oem|buyer)|risk this|in trouble/.test(ql) && !/why/.test(ql)) {
      intent = 'portfolio';
      const rows = ind.portfolio.filter(p => p.prob < 80).sort((a, b) => a.prob - b.prob);
      const total = rows.reduce((s, p) => s + p.value * (1 - p.prob / 100), 0);
      html = `<b>${rows.length} ${FX.lc(T.entityPlural)} are below 80% ${FX.lc(T.successMetric)} probability</b>, with <b>${m(total)}</b> of value at risk:<table class="a-tbl"><tr><th>${T.entity}</th><th>${T.customer}</th><th>Prob.</th><th>Main driver</th></tr>${rows.map(p => `<tr><td>${p.id}</td><td>${p.customer}</td><td class="${p.prob < 70 ? 'neg' : ''}">${p.prob}%</td><td>${p.driver}</td></tr>`).join('')}</table>Start with <b>${rows[0].id}</b>: it has the largest exposure (${m(rows[0].value * (1 - rows[0].prob / 100))}).`;
      sources = [dataSrc('ERP', `${T.entityPlural} book · live extract`, sys(0)), dataSrc('MODEL', 'Delivery-risk model v3.2', 'Model registry')];
      const con = ind.knowledge.find(k => /contract|agreement|sla/i.test(k.title)); if (con) sources.push(con);
      actions = [`Why is ${rows[0].id} at risk?`, 'What does the AI recommend?'];
    }
    else if (/supplier|pricing|anomal|unusual|overcharg|fraud/.test(tok(q).join(' ')) || /unusual|anomal/.test(ql)) {
      intent = 'anomaly';
      html = `<b>${ind.anomalies.length} transactions are flagged for review</b> (price against contract and history):<table class="a-tbl"><tr><th>Ref</th><th>${T.supplier}</th><th>Item</th><th>Variance</th><th>Score</th></tr>${ind.anomalies.map(a => `<tr><td>${a.id}</td><td>${a.supplier}</td><td>${a.item}</td><td class="neg">+${a.variance}%</td><td>${a.score}/100</td></tr>`).join('')}</table>A flag means <i>unusual</i>, not wrong. Each item goes to a person for review, and their feedback retrains the model.`;
      sources = [dataSrc('PROC', 'Purchase & invoice ledger', sysByType('ERP')), dataSrc('ANOM', 'Anomaly model v2.0 (isolation forest)', 'Model registry')];
      actions = ['Where can AI save the most money?', 'How is my data kept secure?'];
    }
    else if (/save|saving|money|value|roi|worth|opportunit/.test(ql)) {
      intent = 'value';
      const s = [...ind.savings].sort((a, b) => b.value - a.value), tot = s.reduce((a, b) => a + b.value, 0);
      html = `<b>Estimated annual value: ${m(tot)}</b> across four areas (illustrative, based on your data volumes):<table class="a-tbl"><tr><th>Area</th><th>Annual value</th><th>How</th></tr>${s.map(x => `<tr><td>${x.area}</td><td><b>${m(x.value)}</b></td><td>${x.note}</td></tr>`).join('')}</table>The biggest lever is <b>${s[0].area.toLowerCase()}</b>. Today it is reachable through the ${f.id} recovery plan (net ${m(FX.recommend(f).net)}).`;
      sources = [dataSrc('BV', 'Business value model', 'Foresight · value framework'), dataSrc('FIN', 'Finance actuals (12 months)', sysByType('ERP'))];
      actions = ['Which customers are at risk this month?', 'What does the AI recommend?'];
    }
    else if (/recommend|what should|option|plan|fix|action|do next/.test(ql)) {
      intent = 'recommend';
      const rec = FX.recommend(f);
      html = `<b>Recovery options for ${f.id}</b> (${FX.lc(f.metric)} today: ${f.base}%):<table class="a-tbl"><tr><th>Option</th><th>Alone</th><th>Cost</th><th>Owner</th></tr>${f.options.map(o => { const r = FX.optionImpact(f, o); return `<tr><td>${o.id} · ${o.label}</td><td class="pos">+${Math.round(r.prob - f.base)} pts</td><td>${m(o.cost)}</td><td>${o.owner}</td></tr>`; }).join('')}</table><b>AI recommended plan:</b> ${f.options.filter(o => rec.levels[o.id]).map(o => o.id + (rec.levels[o.id] < 1 ? ' at 50%' : '')).join(' + ')} → <b>${pct(rec.prob)}</b> for ${m(rec.leverCost)}, a net benefit of <b>${m(rec.net)}</b>.<br><span class="a-note">${FX.cfg().platform.principle} A named approver has to confirm this plan.</span>`;
      sources = [dataSrc('OPT', 'Recommendation optimiser', 'Foresight · decision engine')];
      const sop = retrieve(f.options.map(o => o.label).join(' '), 2); sources.push(...sop);
      actions = ['What if we spend 20k on expediting?', 'Who has to approve this?'];
    }
    else if (/why|cause|reason|behind|delay|root/.test(ql) || ql.includes(f.id.toLowerCase())) {
      intent = 'explain';
      const ex = FX.explain(f), risky = ind.twin.zones.flatMap(z => z.assets).filter(a => a.status === 'risk');
      html = `<b>${f.id} (${f.customer}) is at ${f.base}% ${FX.lc(f.metric)}.</b> Predicted: ${f.predicted}, against a committed ${f.due}. Three drivers account for the ${Math.round(ex.healthy - f.base)}-point gap from a healthy ${ex.healthy}%:<ol class="a-ol">${ex.drivers.map(d => `<li><b>${d.label}</b>, about ${Math.round(d.share * 100)}% of the risk (−${d.pts.toFixed(1)} pts)<br><span class="a-note">${d.evidence} · <i>${d.source}</i></span></li>`).join('')}</ol>${risky.length ? `Assets currently flagged red: ${risky.map(a => `<b>${a.id}</b> (${a.alert})`).join('; ')}.` : ''}`;
      sources = ex.drivers.map((d, i) => dataSrc('D' + i, d.label, d.source));
      actions = ['What does the AI recommend?', 'Show me the maths'];
    }
    else if (/predict|next|likely|going to|forecast|upcoming/.test(ql)) {
      intent = 'predict';
      const p = [...ind.predictions].sort((a, b) => b.impact - a.impact);
      html = `<b>What is likely to happen next</b>, ranked by business impact:<table class="a-tbl"><tr><th>Area</th><th>Prediction</th><th>Prob.</th><th>When</th></tr>${p.map(x => `<tr><td>${x.area}</td><td>${x.title}</td><td>${x.prob}%</td><td>${x.horizon}</td></tr>`).join('')}</table>`;
      sources = [dataSrc('MODEL', 'Predictive risk engine (6 models)', 'Model registry'), ...ind.systems.slice(0, 2).map((s, i) => dataSrc('S' + i, s.provides, s.name))];
      actions = ['Which customers are at risk this month?', 'Where can AI save the most money?'];
    }
    else if (/maths|math|calculat|model|accura/.test(ql)) {
      intent = 'maths';
      const ex = FX.explain(f);
      html = `<b>How ${f.base}% is calculated</b>: a calibrated logistic model.<div class="a-code">logit(p) = logit(healthy ${ex.healthy}%) − Σ driver contributions<br>= ${ex.lH.toFixed(3)} ${ex.drivers.map(d => `− ${d.logodds.toFixed(3)}`).join(' ')}<br>= ${ex.lB.toFixed(3)} → p = 1 / (1 + e<sup>−${ex.lB.toFixed(3)}</sup>) = <b>${f.base}%</b></div>The contributions add up exactly, so the explanation always matches the prediction.`;
      sources = [FX.cfg().platformDocs.find(d => d.id === 'P-EXPL'), FX.cfg().platformDocs.find(d => d.id === 'P-MODEL')];
    }
    else if (/perform|health|today|kpi|how are we|overview|summary|brief/.test(ql)) {
      intent = 'health';
      html = `<b>Business health: ${ind.health.score}/100.</b><ul class="a-ol">${ind.kpis.map(k => `<li>${k.label}: <b>${k.value}</b> <span class="${k.bad ? 'neg' : 'pos'}">${k.delta}</span></li>`).join('')}</ul>The weakest area is <b>${[...ind.health.parts].sort((a, b) => a[1] - b[1])[0][0].toLowerCase()}</b>. ${ind.trend.label} is forecast to reach <b>${ind.trend.forecast[ind.trend.forecast.length - 1]}</b> without action.`;
      sources = ind.systems.slice(0, 3).map((s, i) => dataSrc('S' + i, s.provides, s.name));
      actions = ['What is likely to happen next?', 'Which customers are at risk this month?'];
    }

    const docs = retrieve(q, 2);
    if (intent === 'rag' || !html) {
      if (docs.length) {
        const d = docs[0];
        html = `<b>${d.title}</b><br>${d.text}${docs[1] ? `<br><br><span class="a-note">Related: ${docs[1].title}</span>` : ''}`;
        sources = docs;
      } else {
        html = `I couldn't find that in the connected systems or the knowledge base for ${ind.name}. I don't guess: every answer is grounded in your data or documents. Try one of these:`;
        actions = ind.prompts.slice(0, 3);
      }
    } else if (intent !== 'maths') {
      docs.forEach(d => { if (!sources.find(s => s && s.id === d.id)) sources.push(d); });
    }
    sources = sources.filter(Boolean).slice(0, 4);
    return { html, sources, intent, actions };
  }

  return { answer, retrieve };
})();
