# Foresight — AI Decision Intelligence Platform

An industry-agnostic demo, generalised from the Shahkam POC. It shows how any organisation can get AI value from the ERP/MES/CRM/WMS systems it already has.

> **AI does not replace your existing systems. It turns your existing data into intelligent business decisions.**
> AI recommends. Humans decide.

The original Shahkam desktop POC (`/index.html`) and mobile POC (`/mobile-poc`) are untouched.

## Run

This is a **100% static app**: HTML, CSS and vanilla JavaScript only. There is no server, no build step, no framework and no npm.

- **Desktop:** double-click `platform/index.html`
- **Mobile:** double-click `platform/mobile/index.html`
- **Share it:** copy the `platform/` folder anywhere, or upload it to any static host (GitHub Pages, Netlify, S3, SharePoint, IIS…).

> ⚠️ The **old** Shahkam POC is `/index.html` at the repo root. The new platform is `/platform/index.html`.

The only external request is Google Fonts (Inter). Offline, the app falls back to the system font and still works.

## Structure

```
platform/
  config/industry-config.js     ← the only file that changes per industry (plain JS data)
  shared/engine.js               risk maths, explanations, recommendations, simulation, state, roles
  shared/charts.js               dependency-free SVG charts
  shared/assistant.js            grounded assistant: intents + TF-IDF RAG + citations
  index.html, css/, js/app.js    desktop command centre (9 modules)
  mobile/                        mobile app (alert → approve → monitor)
```

## Modules (top navigation + Home hub)

| # | Module | Question it answers |
|---|---|---|
| 01 | Business Performance Intelligence | How is my business performing today? |
| 02 | Predictive Risk Engine | What problems are likely to happen next? |
| 03 | Explainable AI Engine | Why is it happening, and which data says so? |
| 04 | AI Recommendation Engine | Which action should we take? |
| 05 | What-If Simulation Engine | What happens if I…? |
| 06 | AI Enterprise Assistant | Ask anything, with citations (RAG) |
| 07 | Process Optimisation | Where is time lost in the workflow? |
| 08 | Digital Twin | What is happening in operations right now? |
| 09 | Governance & Responsible AI | Can we trust it? AI recommends, humans decide. |

Also included: the **Executive Decision Journey** (Alert → Understand → Options → Simulate → Approve → Monitor), **Data & AI Architecture**, and **Industry Configuration**.

## Industries included

Textile, Cable, Pharmaceutical, Automotive, Food & Beverage, Chemicals, Logistics, Healthcare, Retail.

## Adding an industry

Copy an industry block in `config/industry-config.js` and edit it: `terms`, `kpis`, `workflow`, `flagship` (its `drivers`, `options` and `stress`), `twin`, `knowledge`. Save and refresh the page. No code changes and no build step are needed. To get the config as JSON, use **Industry Configuration → Export as JSON**.

## How the numbers work

- **Prediction:** a calibrated logistic model. The gap from a healthy baseline (`platform.healthyBaseline`) is decomposed across drivers in log-odds, so the explanation adds up exactly to the prediction ("Show the maths").
- **Options:** each option's `uplift` becomes a log-odds lift. Stacked options have diminishing returns.
- **AI recommended plan:** searches option levels (0 / 50% / 100%) for the highest net benefit that reaches `platform.recommendTarget`.
- **Financials:** value protected = value × Δprobability; net = protected − cost of actions.
- **Stress tests:** stress is a what-if assumption only and is never recorded in an approval.

State (approvals, audit trail, role, industry) is kept in `localStorage` and shared by desktop and mobile, so a mobile approval appears live on the desktop. Use ⟲ in the top bar to reset the demo.

All figures are illustrative mock data.
