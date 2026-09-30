/* =====================================================================
   Foresight · Industry configuration
   ---------------------------------------------------------------------
   This is the ONLY file that changes per industry. Edit it directly —
   there is no build step. It is plain JavaScript data, loaded with a
   normal <script> tag, so the demo runs as static files (double-click
   index.html, or host on any static web server).

   Structure:
     platform      product name, promise, model thresholds
     platformDocs  cross-industry policies the AI Assistant can cite
     industries[]  one block per industry:
       id, name, icon, sector, currency, systems[], terms{},
       kpis[], health, revenue, trend,
       flagship { drivers[], options[], stress }   ← the hero scenario
       portfolio[], predictions[], anomalies[], savings[],
       workflow { stages[], recommendations[] }, twin { zones[] },
       alerts[], knowledge[], prompts[]

   To add an industry: copy an existing block inside `industries`,
   change its id / name / terms, then edit the content.
   ===================================================================== */
window.FORESIGHT_CONFIG = {
  "platform": {
    "name": "Foresight",
    "product": "AI Decision Intelligence Platform",
    "tagline": "Turn your existing data into intelligent business decisions.",
    "promise": "AI does not replace your existing systems. It turns your existing data into intelligent business decisions.",
    "principle": "AI recommends. Humans decide.",
    "defaultIndustry": "textile",
    "healthyBaseline": 94,
    "recommendTarget": 90
  },
  "genericTerms": [
    "entity",
    "customer",
    "asset",
    "unit",
    "successMetric",
    "site",
    "supplier"
  ],
  "platformDocs": [
    {
      "id": "P-SEC",
      "title": "Security & data residency",
      "source": "Platform policy",
      "text": "The platform is deployed inside the customer's own environment: on-premises or in their private cloud tenancy. Operational data never leaves the customer boundary. The language model is private and hosted on-premises or in a dedicated tenancy; prompts and data are never used to train public models. Access is enforced by single sign-on and role-based access control, personal data is masked before retrieval, and every query is logged."
    },
    {
      "id": "P-HITL",
      "title": "Human-in-the-loop decision policy",
      "source": "Governance policy",
      "text": "AI recommends; humans decide. The platform is advisory and never writes to the ERP, MES, CRM or WMS on its own. Any consequential action such as expediting, reallocating capacity, approving spend or changing a schedule requires explicit approval by a named person with the right authority. Approvals are recorded in an immutable audit trail with the evidence, model version and financial impact at the moment of decision."
    },
    {
      "id": "P-MODEL",
      "title": "Model cards & monitoring",
      "source": "MLOps",
      "text": "Each predictive model has a model card covering purpose, training data window, features, accuracy, known limitations and owner. Models are monitored weekly for accuracy, calibration and data drift. If accuracy drops below threshold, the model is flagged, recommendations are labelled low confidence, and retraining is triggered with human sign-off before promotion."
    },
    {
      "id": "P-INT",
      "title": "Integration pattern",
      "source": "Architecture",
      "text": "Systems of record remain the source of truth. Data is extracted read-only through APIs, CDC or scheduled extracts, validated, and mapped to a canonical entity model: order or case, asset, material, supplier and customer. A versioned feature layer feeds prediction, explanation, optimisation and simulation services. Insights flow back to users through dashboards, mobile alerts and the assistant, and optionally through approved write-back workflows."
    },
    {
      "id": "P-EXPL",
      "title": "How explanations are computed",
      "source": "Model card",
      "text": "Risk probabilities come from a calibrated logistic model. The difference between the healthy baseline and the current prediction is decomposed into contributions from each driver in log-odds, so the contributions add up exactly to the prediction. Each driver links back to the source-system evidence that influenced it."
    }
  ],
  "industries": [
    {
      "id": "textile",
      "name": "Textile Manufacturing",
      "icon": "🧵",
      "sector": "Manufacturing",
      "currency": {
        "symbol": "$",
        "code": "USD"
      },
      "systems": [
        {
          "name": "Oracle ERP",
          "type": "ERP",
          "provides": "Orders, materials, procurement, finance"
        },
        {
          "name": "JACK MES",
          "type": "MES",
          "provides": "Machine-level sewing output & efficiency"
        },
        {
          "name": "Barcode",
          "type": "Shop-floor",
          "provides": "Cutting bundles & WIP"
        },
        {
          "name": "RFID",
          "type": "WMS",
          "provides": "Packing, warehouse & dispatch"
        },
        {
          "name": "QMS",
          "type": "Quality",
          "provides": "Inline inspection, DHU"
        }
      ],
      "terms": {
        "entity": "Order",
        "entityPlural": "Orders",
        "customer": "Buyer",
        "asset": "Sewing line",
        "assetPlural": "Lines",
        "unit": "garments",
        "successMetric": "On-time delivery",
        "site": "Factory",
        "supplier": "Fabric mill"
      },
      "kpis": [
        {
          "label": "On-time delivery",
          "value": "91.4%",
          "delta": "−2.1 pts vs last month",
          "bad": true
        },
        {
          "label": "Line efficiency",
          "value": "87.3%",
          "delta": "−3.4 pts this week",
          "bad": true
        },
        {
          "label": "Orders at risk",
          "value": "11",
          "delta": "+4 since Monday",
          "bad": true
        },
        {
          "label": "Right-first-time",
          "value": "95.8%",
          "delta": "+0.6 pts",
          "bad": false
        }
      ],
      "health": {
        "score": 72,
        "parts": [
          [
            "Delivery",
            68
          ],
          [
            "Production",
            71
          ],
          [
            "Quality",
            84
          ],
          [
            "Supply",
            62
          ],
          [
            "Cost",
            77
          ]
        ]
      },
      "revenue": {
        "label": "Monthly revenue",
        "values": [
          4.1,
          4.3,
          4.0,
          4.6,
          4.8,
          4.7,
          5.0,
          5.2,
          4.9,
          5.1,
          4.8,
          4.6
        ]
      },
      "trend": {
        "label": "On-time delivery %",
        "values": [
          94.1,
          93.8,
          93.6,
          93.9,
          93.2,
          92.9,
          92.7,
          92.3,
          92.0,
          91.8,
          91.6,
          91.4
        ],
        "forecast": [
          90.6,
          89.7,
          88.9,
          87.8
        ],
        "target": 93
      },
      "flagship": {
        "id": "SO-10482",
        "title": "Export order · 25,000 garments",
        "customer": "Global Fashion Co.",
        "qty": "25,000 garments",
        "value": 650000,
        "due": "18 Sep",
        "predicted": "21 Sep",
        "risk": "Order delay",
        "metric": "On-time delivery probability",
        "base": 61,
        "alert": "Export order SO-10482 has a 61% chance of shipping on time. $254K is at risk.",
        "drivers": [
          {
            "label": "Fabric shortage (L/XL sizes)",
            "impact": 45,
            "source": "Oracle ERP",
            "evidence": "18,500 of 25,000 m of fabric confirmed. The import shipment for L/XL is held at customs, ETA +8 days."
          },
          {
            "label": "Line L-07 at capacity",
            "impact": 35,
            "source": "JACK MES",
            "evidence": "L-07 is 96% utilised at 79% efficiency, with 82K units queued and a predicted delay of 14 hours."
          },
          {
            "label": "Inline quality rework",
            "impact": 20,
            "source": "QMS",
            "evidence": "DHU on L-07 is 7.4% against a 3% target, which adds rework loops before finishing."
          }
        ],
        "options": [
          {
            "id": "A",
            "label": "Expedite fabric by air freight",
            "uplift": 25,
            "cost": 22000,
            "time": "2 days",
            "owner": "Procurement",
            "targets": 0
          },
          {
            "id": "B",
            "label": "Move 30% of volume from L-07 to L-03",
            "uplift": 18,
            "cost": 8000,
            "time": "Next shift",
            "owner": "Production",
            "targets": 1
          },
          {
            "id": "C",
            "label": "Approve Saturday overtime",
            "uplift": 12,
            "cost": 11000,
            "time": "This week",
            "owner": "Plant manager",
            "targets": 1
          }
        ],
        "stress": {
          "label": "Additional fabric delay",
          "unit": "days",
          "max": 10,
          "perUnit": 0.16,
          "costPerUnit": 0
        }
      },
      "portfolio": [
        {
          "id": "SO-10482",
          "customer": "Global Fashion Co.",
          "value": 650000,
          "prob": 61,
          "driver": "Fabric shortage",
          "due": "18 Sep"
        },
        {
          "id": "SO-10491",
          "customer": "Northstar Apparel",
          "value": 410000,
          "prob": 68,
          "driver": "Line L-04 downtime",
          "due": "22 Sep"
        },
        {
          "id": "SO-10477",
          "customer": "Meridian Retail",
          "value": 295000,
          "prob": 72,
          "driver": "Trim supplier late",
          "due": "20 Sep"
        },
        {
          "id": "SO-10503",
          "customer": "Eclipse Brands",
          "value": 520000,
          "prob": 79,
          "driver": "Wash capacity",
          "due": "29 Sep"
        },
        {
          "id": "SO-10466",
          "customer": "Atlas Uniforms",
          "value": 180000,
          "prob": 86,
          "driver": "On track",
          "due": "16 Sep"
        },
        {
          "id": "SO-10512",
          "customer": "Velvet & Co.",
          "value": 240000,
          "prob": 92,
          "driver": "On track",
          "due": "4 Oct"
        }
      ],
      "predictions": [
        {
          "area": "Delivery",
          "title": "SO-10482 likely to ship 3 days late",
          "prob": 39,
          "horizon": "18 Sep",
          "impact": 254000
        },
        {
          "area": "Production",
          "title": "Line L-07: 14-hour delay predicted",
          "prob": 78,
          "horizon": "48 h",
          "impact": 61000
        },
        {
          "area": "Machine",
          "title": "Bartack machine M-221 likely to fail (vibration trend)",
          "prob": 64,
          "horizon": "5 days",
          "impact": 18000
        },
        {
          "area": "Quality",
          "title": "DHU on L-07 set to exceed 8%",
          "prob": 57,
          "horizon": "3 days",
          "impact": 26000
        },
        {
          "area": "Supply",
          "title": "Trim supplier likely 6 days late",
          "prob": 71,
          "horizon": "12 Sep",
          "impact": 83000
        },
        {
          "area": "Cost",
          "title": "Cotton PO-48291 priced 20% above contract",
          "prob": 87,
          "horizon": "Now",
          "impact": 42000
        }
      ],
      "anomalies": [
        {
          "id": "PO-48291",
          "supplier": "Supplier A",
          "item": "Cotton fabric",
          "variance": 20.3,
          "score": 87
        },
        {
          "id": "PO-48317",
          "supplier": "Threadline",
          "item": "Polyester yarn",
          "variance": 11.8,
          "score": 71
        },
        {
          "id": "PO-48355",
          "supplier": "Prime Dyes",
          "item": "Indigo dye",
          "variance": 8.9,
          "score": 58
        }
      ],
      "savings": [
        {
          "area": "Delivery risk recovery",
          "value": 610000,
          "note": "Earlier intervention on at-risk orders"
        },
        {
          "area": "Procurement price anomalies",
          "value": 185000,
          "note": "Catching off-contract pricing before payment"
        },
        {
          "area": "Line efficiency & downtime",
          "value": 240000,
          "note": "Predictive rebalancing across lines"
        },
        {
          "area": "Quality rework",
          "value": 96000,
          "note": "Early DHU warnings"
        }
      ],
      "workflow": {
        "unit": "days",
        "stages": [
          {
            "stage": "Order received",
            "current": 1,
            "optimised": 0.5,
            "status": "ok",
            "note": "Auto-validated in ERP"
          },
          {
            "stage": "Material planning",
            "current": 9,
            "optimised": 5,
            "status": "bottleneck",
            "note": "Import fabric lead time and customs holds"
          },
          {
            "stage": "Cutting",
            "current": 2,
            "optimised": 1.5,
            "status": "ok",
            "note": "Barcode bundle tracking"
          },
          {
            "stage": "Sewing",
            "current": 8,
            "optimised": 6,
            "status": "warn",
            "note": "L-07 is overloaded; others have headroom"
          },
          {
            "stage": "Quality & finishing",
            "current": 3,
            "optimised": 2,
            "status": "warn",
            "note": "Rework loops from high DHU"
          },
          {
            "stage": "Packing & shipment",
            "current": 2,
            "optimised": 1.5,
            "status": "ok",
            "note": "RFID-based dispatch"
          }
        ],
        "recommendations": [
          {
            "stage": "Material planning",
            "text": "Trigger fabric expediting automatically when the import ETA slips past the cut date minus 5 days.",
            "saving": "−4 days"
          },
          {
            "stage": "Sewing",
            "text": "Load-balance each day using predicted line efficiency instead of static allocation.",
            "saving": "−2 days"
          },
          {
            "stage": "Quality & finishing",
            "text": "Alert supervisors when predicted DHU exceeds 5%, before rework builds up.",
            "saving": "−1 day"
          }
        ]
      },
      "twin": {
        "title": "Factory floor",
        "zones": [
          {
            "name": "Cutting",
            "assets": [
              {
                "id": "CUT-1",
                "status": "ok",
                "kpi": 92,
                "unit": "% util"
              },
              {
                "id": "CUT-2",
                "status": "ok",
                "kpi": 88,
                "unit": "% util"
              }
            ]
          },
          {
            "name": "Sewing",
            "assets": [
              {
                "id": "L-03",
                "status": "ok",
                "kpi": 82,
                "unit": "% eff"
              },
              {
                "id": "L-04",
                "status": "warn",
                "kpi": 83,
                "unit": "% eff",
                "alert": "19 h downtime this week"
              },
              {
                "id": "L-07",
                "status": "risk",
                "kpi": 79,
                "unit": "% eff",
                "alert": "14 h delay predicted and DHU at 7.4%"
              },
              {
                "id": "L-09",
                "status": "ok",
                "kpi": 86,
                "unit": "% eff"
              }
            ]
          },
          {
            "name": "Finishing",
            "assets": [
              {
                "id": "FIN-1",
                "status": "warn",
                "kpi": 71,
                "unit": "% util",
                "alert": "Rework backlog building"
              },
              {
                "id": "WASH",
                "status": "ok",
                "kpi": 77,
                "unit": "% util"
              }
            ]
          },
          {
            "name": "Warehouse",
            "assets": [
              {
                "id": "FG-WH",
                "status": "ok",
                "kpi": 64,
                "unit": "% full"
              },
              {
                "id": "FAB-WH",
                "status": "risk",
                "kpi": 31,
                "unit": "% cover",
                "alert": "L/XL fabric cover below 5 days"
              }
            ]
          }
        ]
      },
      "alerts": [
        {
          "sev": "high",
          "title": "SO-10482 delivery at risk",
          "detail": "61% on-time · $254K exposed"
        },
        {
          "sev": "high",
          "title": "Line L-07 delay predicted",
          "detail": "14 h late · 78% probability"
        },
        {
          "sev": "med",
          "title": "PO-48291 unusual price",
          "detail": "+20.3% above contract"
        },
        {
          "sev": "low",
          "title": "M-221 maintenance due",
          "detail": "Vibration trending up"
        }
      ],
      "knowledge": [
        {
          "id": "T-SOP-12",
          "title": "SOP: Import fabric expediting",
          "source": "SharePoint · SOP library",
          "text": "When confirmed fabric is below the requirement at cut date minus 5 days, procurement may expedite by air freight up to $25,000 per order with plant manager approval. Customs holds are escalated to the clearing agent within 24 hours."
        },
        {
          "id": "T-POL-04",
          "title": "Policy: Line reallocation",
          "source": "Production handbook",
          "text": "Volume may be moved between sewing lines of the same product family when the receiving line has more than 10% capacity headroom. The receiving line needs a 4-hour learning-curve allowance."
        },
        {
          "id": "T-KPI-01",
          "title": "KPI definitions: OTD, efficiency, DHU",
          "source": "BI glossary",
          "text": "On-time delivery is shipments on or before the committed date divided by total shipments. Line efficiency is earned minutes over available minutes. DHU is defects per hundred units inspected."
        },
        {
          "id": "T-CON-7",
          "title": "Buyer contract: Global Fashion Co.",
          "source": "CRM · contracts",
          "text": "Late delivery penalty of 2% of order value per day, capped at 10%. Repeated late deliveries trigger a vendor scorecard review that affects next-season allocation."
        }
      ],
      "prompts": [
        "Which customers are at risk this month?",
        "Why is production behind schedule?",
        "Which suppliers have unusual pricing?",
        "Where can AI save the most money?"
      ]
    },
    {
      "id": "cable",
      "name": "Cable Manufacturing",
      "icon": "🔌",
      "sector": "Manufacturing",
      "currency": {
        "symbol": "$",
        "code": "USD"
      },
      "systems": [
        {
          "name": "SAP S/4HANA",
          "type": "ERP",
          "provides": "Orders, BOM, copper purchasing, finance"
        },
        {
          "name": "Siemens Opcenter",
          "type": "MES",
          "provides": "Extrusion, drawing & stranding output"
        },
        {
          "name": "Line PLCs / IoT",
          "type": "IoT",
          "provides": "Temperature, speed, vibration"
        },
        {
          "name": "LIMS",
          "type": "Quality",
          "provides": "HV test, partial discharge results"
        },
        {
          "name": "Salesforce",
          "type": "CRM",
          "provides": "Tenders, customer commitments"
        }
      ],
      "terms": {
        "entity": "Order",
        "entityPlural": "Orders",
        "customer": "Customer",
        "asset": "Extrusion line",
        "assetPlural": "Lines",
        "unit": "km",
        "successMetric": "On-time delivery",
        "site": "Plant",
        "supplier": "Copper supplier"
      },
      "kpis": [
        {
          "label": "On-time delivery",
          "value": "88.9%",
          "delta": "−3.0 pts vs last month",
          "bad": true
        },
        {
          "label": "OEE",
          "value": "74.2%",
          "delta": "−2.6 pts",
          "bad": true
        },
        {
          "label": "Scrap rate",
          "value": "2.8%",
          "delta": "+0.4 pts",
          "bad": true
        },
        {
          "label": "First-pass test yield",
          "value": "97.1%",
          "delta": "+0.3 pts",
          "bad": false
        }
      ],
      "health": {
        "score": 69,
        "parts": [
          [
            "Delivery",
            63
          ],
          [
            "Production",
            70
          ],
          [
            "Quality",
            88
          ],
          [
            "Supply",
            55
          ],
          [
            "Cost",
            71
          ]
        ]
      },
      "revenue": {
        "label": "Monthly revenue",
        "values": [
          11.2,
          11.8,
          12.4,
          12.0,
          13.1,
          13.6,
          12.9,
          13.8,
          14.2,
          13.5,
          13.0,
          12.7
        ]
      },
      "trend": {
        "label": "On-time delivery %",
        "values": [
          93.0,
          92.6,
          92.1,
          91.8,
          91.2,
          90.9,
          90.4,
          90.1,
          89.7,
          89.5,
          89.2,
          88.9
        ],
        "forecast": [
          88.0,
          87.1,
          86.4,
          85.9
        ],
        "target": 92
      },
      "flagship": {
        "id": "CO-7731",
        "title": "MV power cable · 180 km",
        "customer": "National Grid Utility",
        "qty": "180 km",
        "value": 2400000,
        "due": "30 Sep",
        "predicted": "6 Oct",
        "risk": "Customer delivery delay",
        "metric": "On-time delivery probability",
        "base": 58,
        "alert": "Utility order CO-7731 has a 58% chance of delivering on time. $1.0M is at risk.",
        "drivers": [
          {
            "label": "Copper cathode shortage",
            "impact": 45,
            "source": "SAP S/4HANA",
            "evidence": "The primary copper supplier is 8 days late on 140 t. Inventory covers 4.5 days against a 12-day requirement."
          },
          {
            "label": "Extrusion line EX-2 downtime",
            "impact": 35,
            "source": "Siemens Opcenter",
            "evidence": "EX-2 has had 31 h of unplanned downtime in 10 days, and its screw temperature variance is rising."
          },
          {
            "label": "HV test bay queue",
            "impact": 20,
            "source": "LIMS",
            "evidence": "The routine-test queue is 6 drums deep, 2.5 days of waiting."
          }
        ],
        "options": [
          {
            "id": "A",
            "label": "Expedite copper from an alternate supplier",
            "uplift": 24,
            "cost": 60000,
            "time": "4 days",
            "owner": "Procurement",
            "targets": 0
          },
          {
            "id": "B",
            "label": "Reallocate the order to EX-4",
            "uplift": 19,
            "cost": 25000,
            "time": "Next shift",
            "owner": "Production",
            "targets": 1
          },
          {
            "id": "C",
            "label": "Add a weekend HV test shift",
            "uplift": 11,
            "cost": 18000,
            "time": "This weekend",
            "owner": "Quality",
            "targets": 2
          }
        ],
        "stress": {
          "label": "Additional copper delay",
          "unit": "days",
          "max": 10,
          "perUnit": 0.14,
          "costPerUnit": 0
        }
      },
      "portfolio": [
        {
          "id": "CO-7731",
          "customer": "National Grid Utility",
          "value": 2400000,
          "prob": 58,
          "driver": "Copper shortage",
          "due": "30 Sep"
        },
        {
          "id": "CO-7745",
          "customer": "MetroRail Authority",
          "value": 1350000,
          "prob": 66,
          "driver": "EX-2 downtime",
          "due": "7 Oct"
        },
        {
          "id": "CO-7702",
          "customer": "SolarFarm Developers",
          "value": 880000,
          "prob": 71,
          "driver": "PVC compound late",
          "due": "2 Oct"
        },
        {
          "id": "CO-7760",
          "customer": "BuildCo Contractors",
          "value": 420000,
          "prob": 81,
          "driver": "Test queue",
          "due": "12 Oct"
        },
        {
          "id": "CO-7718",
          "customer": "Telecom Networks",
          "value": 610000,
          "prob": 89,
          "driver": "On track",
          "due": "28 Sep"
        },
        {
          "id": "CO-7771",
          "customer": "Offshore Wind JV",
          "value": 3100000,
          "prob": 93,
          "driver": "On track",
          "due": "20 Nov"
        }
      ],
      "predictions": [
        {
          "area": "Delivery",
          "title": "CO-7731 likely 6 days late",
          "prob": 42,
          "horizon": "30 Sep",
          "impact": 1008000
        },
        {
          "area": "Machine",
          "title": "EX-2 screw drive failure risk",
          "prob": 69,
          "horizon": "7 days",
          "impact": 140000
        },
        {
          "area": "Supply",
          "title": "Copper stock-out at current burn",
          "prob": 74,
          "horizon": "4.5 days",
          "impact": 560000
        },
        {
          "area": "Quality",
          "title": "Partial-discharge failures rising on EX-2 output",
          "prob": 38,
          "horizon": "2 weeks",
          "impact": 90000
        },
        {
          "area": "Cost",
          "title": "Copper price variance vs LME hedge",
          "prob": 81,
          "horizon": "Now",
          "impact": 210000
        },
        {
          "area": "Energy",
          "title": "Furnace energy anomaly, night shift",
          "prob": 55,
          "horizon": "Now",
          "impact": 36000
        }
      ],
      "anomalies": [
        {
          "id": "PO-C2210",
          "supplier": "Andes Copper",
          "item": "Copper cathode",
          "variance": 6.4,
          "score": 82
        },
        {
          "id": "PO-C2244",
          "supplier": "PolyChem",
          "item": "XLPE compound",
          "variance": 14.1,
          "score": 76
        },
        {
          "id": "PO-C2261",
          "supplier": "DrumWorks",
          "item": "Wooden drums",
          "variance": 9.2,
          "score": 61
        }
      ],
      "savings": [
        {
          "area": "Delivery risk recovery",
          "value": 1900000,
          "note": "Earlier intervention on utility tenders"
        },
        {
          "area": "Predictive maintenance (extrusion)",
          "value": 520000,
          "note": "Avoided unplanned downtime"
        },
        {
          "area": "Copper procurement anomalies",
          "value": 340000,
          "note": "Price variance vs hedge"
        },
        {
          "area": "Scrap reduction",
          "value": 280000,
          "note": "Process drift alerts"
        }
      ],
      "workflow": {
        "unit": "days",
        "stages": [
          {
            "stage": "Order",
            "current": 2,
            "optimised": 1,
            "status": "ok",
            "note": "Tender converted in CRM"
          },
          {
            "stage": "Material planning",
            "current": 10,
            "optimised": 6,
            "status": "bottleneck",
            "note": "Copper availability and single-sourcing"
          },
          {
            "stage": "Drawing & stranding",
            "current": 4,
            "optimised": 3.5,
            "status": "ok",
            "note": "Stable"
          },
          {
            "stage": "Extrusion",
            "current": 7,
            "optimised": 5,
            "status": "warn",
            "note": "EX-2 unplanned downtime"
          },
          {
            "stage": "Testing",
            "current": 4,
            "optimised": 2,
            "status": "warn",
            "note": "HV test bay queue"
          },
          {
            "stage": "Delivery",
            "current": 3,
            "optimised": 2.5,
            "status": "ok",
            "note": "Drum logistics"
          }
        ],
        "recommendations": [
          {
            "stage": "Material planning",
            "text": "Dual-source copper and trigger alternate-supplier POs when predicted coverage drops below 7 days.",
            "saving": "−4 days"
          },
          {
            "stage": "Extrusion",
            "text": "Run predictive maintenance on EX-2 using PLC temperature and vibration signals.",
            "saving": "−2 days"
          },
          {
            "stage": "Testing",
            "text": "Schedule HV tests dynamically from predicted drum completion times.",
            "saving": "−2 days"
          }
        ]
      },
      "twin": {
        "title": "Cable plant",
        "zones": [
          {
            "name": "Drawing",
            "assets": [
              {
                "id": "RBD-1",
                "status": "ok",
                "kpi": 88,
                "unit": "% OEE"
              },
              {
                "id": "MWD-2",
                "status": "ok",
                "kpi": 84,
                "unit": "% OEE"
              }
            ]
          },
          {
            "name": "Extrusion",
            "assets": [
              {
                "id": "EX-2",
                "status": "risk",
                "kpi": 61,
                "unit": "% OEE",
                "alert": "31 h downtime and drive failure risk"
              },
              {
                "id": "EX-3",
                "status": "ok",
                "kpi": 79,
                "unit": "% OEE"
              },
              {
                "id": "EX-4",
                "status": "ok",
                "kpi": 72,
                "unit": "% OEE"
              }
            ]
          },
          {
            "name": "Testing",
            "assets": [
              {
                "id": "HV-BAY",
                "status": "warn",
                "kpi": 6,
                "unit": "drums queued",
                "alert": "2.5-day queue"
              },
              {
                "id": "PD-LAB",
                "status": "ok",
                "kpi": 2,
                "unit": "drums queued"
              }
            ]
          },
          {
            "name": "Stores",
            "assets": [
              {
                "id": "CU-STK",
                "status": "risk",
                "kpi": 4.5,
                "unit": "days cover",
                "alert": "Copper below the 12-day requirement"
              },
              {
                "id": "DRUMS",
                "status": "ok",
                "kpi": 210,
                "unit": "in stock"
              }
            ]
          }
        ]
      },
      "alerts": [
        {
          "sev": "high",
          "title": "CO-7731 delivery at risk",
          "detail": "58% on-time · $1.0M exposed"
        },
        {
          "sev": "high",
          "title": "Copper stock-out in 4.5 days",
          "detail": "Supplier 8 days late"
        },
        {
          "sev": "med",
          "title": "EX-2 failure risk",
          "detail": "69% within 7 days"
        },
        {
          "sev": "low",
          "title": "XLPE compound price anomaly",
          "detail": "+14.1% vs contract"
        }
      ],
      "knowledge": [
        {
          "id": "C-SOP-3",
          "title": "SOP: Copper supply contingency",
          "source": "Procurement manual",
          "text": "If copper coverage is predicted below 7 days, procurement may raise a spot order with an approved alternate supplier at up to LME plus 4% premium, with CFO approval above $50,000."
        },
        {
          "id": "C-POL-8",
          "title": "Policy: Extrusion line reallocation",
          "source": "Production handbook",
          "text": "Medium-voltage constructions can run on EX-2 or EX-4. Changeover takes 6 hours including purge and die change."
        },
        {
          "id": "C-QA-2",
          "title": "HV routine test standard",
          "source": "Quality manual",
          "text": "Every drum of MV cable is routine-tested for AC voltage withstand and partial discharge before release. Test bay capacity is 3 drums per shift."
        },
        {
          "id": "C-CON-1",
          "title": "Contract: National Grid Utility framework",
          "source": "CRM · contracts",
          "text": "Liquidated damages of 0.5% of contract value per day of delay, capped at 10%. Performance affects framework renewal scoring."
        }
      ],
      "prompts": [
        "Which customers are at risk this month?",
        "Why is production behind schedule?",
        "Which suppliers have unusual pricing?",
        "What if copper is delayed 5 more days?"
      ]
    },
    {
      "id": "pharma",
      "name": "Pharmaceutical Manufacturing",
      "icon": "💊",
      "sector": "Life sciences",
      "currency": {
        "symbol": "$",
        "code": "USD"
      },
      "systems": [
        {
          "name": "SAP ERP",
          "type": "ERP",
          "provides": "Orders, materials, batch genealogy"
        },
        {
          "name": "MES / eBR",
          "type": "MES",
          "provides": "Electronic batch records, execution"
        },
        {
          "name": "LIMS",
          "type": "Quality",
          "provides": "QC testing, stability, OOS/OOT"
        },
        {
          "name": "QMS (Veeva)",
          "type": "Quality",
          "provides": "Deviations, CAPA, change control"
        },
        {
          "name": "WMS",
          "type": "WMS",
          "provides": "Quarantine, released stock, cold chain"
        }
      ],
      "terms": {
        "entity": "Batch",
        "entityPlural": "Batches",
        "customer": "Distributor",
        "asset": "Production suite",
        "assetPlural": "Suites",
        "unit": "tablets",
        "successMetric": "On-time batch release",
        "site": "Site",
        "supplier": "API supplier"
      },
      "kpis": [
        {
          "label": "On-time batch release",
          "value": "86.5%",
          "delta": "−4.2 pts vs last month",
          "bad": true
        },
        {
          "label": "QC lab cycle time",
          "value": "11.4 d",
          "delta": "+2.1 days",
          "bad": true
        },
        {
          "label": "Open deviations",
          "value": "23",
          "delta": "+6",
          "bad": true
        },
        {
          "label": "Right-first-time batches",
          "value": "96.2%",
          "delta": "+0.8 pts",
          "bad": false
        }
      ],
      "health": {
        "score": 70,
        "parts": [
          [
            "Release",
            61
          ],
          [
            "Production",
            78
          ],
          [
            "Quality",
            66
          ],
          [
            "Supply",
            74
          ],
          [
            "Compliance",
            90
          ]
        ]
      },
      "revenue": {
        "label": "Monthly revenue",
        "values": [
          8.4,
          8.9,
          9.1,
          8.7,
          9.6,
          9.8,
          10.1,
          9.7,
          10.4,
          10.0,
          9.5,
          9.3
        ]
      },
      "trend": {
        "label": "On-time batch release %",
        "values": [
          93.2,
          92.8,
          92.0,
          91.1,
          90.4,
          89.8,
          89.0,
          88.5,
          87.9,
          87.3,
          86.9,
          86.5
        ],
        "forecast": [
          85.8,
          85.0,
          84.1,
          83.5
        ],
        "target": 92
      },
      "flagship": {
        "id": "B-2291",
        "title": "Amoxicillin 500 mg · batch release",
        "customer": "Regional Health Distributor",
        "qty": "1.2M tablets",
        "value": 1100000,
        "due": "24 Sep",
        "predicted": "1 Oct",
        "risk": "Batch release delay",
        "metric": "On-time release probability",
        "base": 63,
        "alert": "Batch B-2291 has a 63% chance of releasing on time. $407K of supply commitments is at risk.",
        "drivers": [
          {
            "label": "QC testing bottleneck (HPLC)",
            "impact": 45,
            "source": "LIMS",
            "evidence": "HPLC utilisation is 98% with 41 samples queued. Assay and dissolution for B-2291 are scheduled 6 days out."
          },
          {
            "label": "Stability retest (OOT result)",
            "impact": 30,
            "source": "QMS (Veeva)",
            "evidence": "An out-of-trend impurity result at T3 opened deviation DEV-0931, and the investigation is still open."
          },
          {
            "label": "API lot arrival delay",
            "impact": 25,
            "source": "SAP ERP",
            "evidence": "The API lot for the next campaign is 5 days late, so packaging sequence changes are needed."
          }
        ],
        "options": [
          {
            "id": "A",
            "label": "Prioritise HPLC capacity for B-2291",
            "uplift": 22,
            "cost": 9000,
            "time": "24 h",
            "owner": "QC manager",
            "targets": 0
          },
          {
            "id": "B",
            "label": "Send release testing to a contract lab",
            "uplift": 16,
            "cost": 28000,
            "time": "3 days",
            "owner": "Quality",
            "targets": 0
          },
          {
            "id": "C",
            "label": "Resequence the packaging schedule",
            "uplift": 10,
            "cost": 4000,
            "time": "Next shift",
            "owner": "Planning",
            "targets": 2
          }
        ],
        "stress": {
          "label": "Additional QC queue",
          "unit": "samples",
          "max": 30,
          "perUnit": 0.05,
          "costPerUnit": 0
        }
      },
      "portfolio": [
        {
          "id": "B-2291",
          "customer": "Regional Health Distributor",
          "value": 1100000,
          "prob": 63,
          "driver": "QC bottleneck",
          "due": "24 Sep"
        },
        {
          "id": "B-2305",
          "customer": "National Hospital Tender",
          "value": 1650000,
          "prob": 69,
          "driver": "Stability OOT",
          "due": "1 Oct"
        },
        {
          "id": "B-2287",
          "customer": "PharmaLink Wholesale",
          "value": 540000,
          "prob": 74,
          "driver": "Packaging material",
          "due": "26 Sep"
        },
        {
          "id": "B-2312",
          "customer": "Export: Gulf Distributor",
          "value": 780000,
          "prob": 82,
          "driver": "Cold-chain slot",
          "due": "8 Oct"
        },
        {
          "id": "B-2279",
          "customer": "Retail Pharmacy Chain",
          "value": 320000,
          "prob": 90,
          "driver": "On track",
          "due": "22 Sep"
        },
        {
          "id": "B-2318",
          "customer": "Regional Health Distributor",
          "value": 950000,
          "prob": 94,
          "driver": "On track",
          "due": "15 Oct"
        }
      ],
      "predictions": [
        {
          "area": "Release",
          "title": "B-2291 likely released 7 days late",
          "prob": 37,
          "horizon": "24 Sep",
          "impact": 407000
        },
        {
          "area": "Quality",
          "title": "Dissolution OOS risk on granulation suite G-2",
          "prob": 29,
          "horizon": "Next 3 batches",
          "impact": 220000
        },
        {
          "area": "Equipment",
          "title": "Tablet press TP-4 punch wear",
          "prob": 66,
          "horizon": "10 days",
          "impact": 48000
        },
        {
          "area": "Supply",
          "title": "API shortage for Q4 campaign",
          "prob": 58,
          "horizon": "3 weeks",
          "impact": 610000
        },
        {
          "area": "Compliance",
          "title": "Deviation closure SLA breach",
          "prob": 72,
          "horizon": "2 weeks",
          "impact": 0
        },
        {
          "area": "Cost",
          "title": "Excipient price anomaly",
          "prob": 64,
          "horizon": "Now",
          "impact": 31000
        }
      ],
      "anomalies": [
        {
          "id": "PO-P1182",
          "supplier": "ChemSource API",
          "item": "Amoxicillin trihydrate",
          "variance": 12.7,
          "score": 79
        },
        {
          "id": "PO-P1201",
          "supplier": "PackPro",
          "item": "Alu-alu blister foil",
          "variance": 17.5,
          "score": 74
        },
        {
          "id": "PO-P1215",
          "supplier": "Excipia",
          "item": "Microcrystalline cellulose",
          "variance": 7.1,
          "score": 55
        }
      ],
      "savings": [
        {
          "area": "Faster batch release",
          "value": 1400000,
          "note": "Less working capital in quarantine"
        },
        {
          "area": "QC lab scheduling",
          "value": 380000,
          "note": "Higher HPLC utilisation and fewer retests"
        },
        {
          "area": "Deviation prediction",
          "value": 260000,
          "note": "Fewer lost batches"
        },
        {
          "area": "Procurement anomalies",
          "value": 150000,
          "note": "API and packaging price variance"
        }
      ],
      "workflow": {
        "unit": "days",
        "stages": [
          {
            "stage": "Order / demand",
            "current": 2,
            "optimised": 1,
            "status": "ok",
            "note": "Demand plan in ERP"
          },
          {
            "stage": "Material release",
            "current": 5,
            "optimised": 3,
            "status": "warn",
            "note": "Incoming API testing"
          },
          {
            "stage": "Manufacturing",
            "current": 6,
            "optimised": 5.5,
            "status": "ok",
            "note": "eBR execution"
          },
          {
            "stage": "QC testing",
            "current": 11,
            "optimised": 6,
            "status": "bottleneck",
            "note": "HPLC capacity and retests"
          },
          {
            "stage": "QA batch release",
            "current": 3,
            "optimised": 1.5,
            "status": "warn",
            "note": "Deviation review before release"
          },
          {
            "stage": "Distribution",
            "current": 2,
            "optimised": 2,
            "status": "ok",
            "note": "Cold-chain logistics"
          }
        ],
        "recommendations": [
          {
            "stage": "QC testing",
            "text": "Schedule lab work by predicted release date and customer impact, not first-in-first-out.",
            "saving": "−5 days"
          },
          {
            "stage": "QA batch release",
            "text": "Use review-by-exception: AI pre-checks eBR data and flags only anomalies for QA.",
            "saving": "−1.5 days"
          },
          {
            "stage": "Material release",
            "text": "Use predictive supplier quality scoring to reduce incoming testing for trusted suppliers.",
            "saving": "−2 days"
          }
        ]
      },
      "twin": {
        "title": "Manufacturing site",
        "zones": [
          {
            "name": "Production suites",
            "assets": [
              {
                "id": "G-1",
                "status": "ok",
                "kpi": 81,
                "unit": "% OEE"
              },
              {
                "id": "G-2",
                "status": "warn",
                "kpi": 69,
                "unit": "% OEE",
                "alert": "Dissolution drift"
              },
              {
                "id": "TP-4",
                "status": "warn",
                "kpi": 74,
                "unit": "% OEE",
                "alert": "Punch wear predicted"
              }
            ]
          },
          {
            "name": "QC laboratory",
            "assets": [
              {
                "id": "HPLC",
                "status": "risk",
                "kpi": 98,
                "unit": "% util",
                "alert": "41 samples queued"
              },
              {
                "id": "DISSO",
                "status": "warn",
                "kpi": 91,
                "unit": "% util"
              },
              {
                "id": "MICRO",
                "status": "ok",
                "kpi": 66,
                "unit": "% util"
              }
            ]
          },
          {
            "name": "Warehouse",
            "assets": [
              {
                "id": "QUAR",
                "status": "warn",
                "kpi": 18,
                "unit": "batches held",
                "alert": "Awaiting release"
              },
              {
                "id": "COLD",
                "status": "ok",
                "kpi": 4.1,
                "unit": "°C"
              }
            ]
          }
        ]
      },
      "alerts": [
        {
          "sev": "high",
          "title": "B-2291 release at risk",
          "detail": "63% on-time · $407K exposed"
        },
        {
          "sev": "high",
          "title": "HPLC at 98% utilisation",
          "detail": "41 samples queued"
        },
        {
          "sev": "med",
          "title": "DEV-0931 investigation open",
          "detail": "Stability OOT at T3"
        },
        {
          "sev": "low",
          "title": "TP-4 punch wear",
          "detail": "Maintenance within 10 days"
        }
      ],
      "knowledge": [
        {
          "id": "PH-SOP-21",
          "title": "SOP: QC sample prioritisation",
          "source": "QMS · SOP library",
          "text": "The QC manager may reprioritise the testing queue for batches with a committed release date within 10 days, provided system suitability and data-integrity controls are kept. Changes are recorded in LIMS."
        },
        {
          "id": "PH-SOP-33",
          "title": "SOP: Use of contract laboratories",
          "source": "QMS · SOP library",
          "text": "Release testing can be outsourced only to qualified contract labs on the approved supplier list, with a technical agreement in place. Results need QA review before batch disposition."
        },
        {
          "id": "PH-GMP-2",
          "title": "GMP: Deviation and OOT handling",
          "source": "Quality manual",
          "text": "An out-of-trend stability result opens a deviation. The batch can still be released if the investigation shows no impact on the released specification, with QA approval."
        },
        {
          "id": "PH-CON-5",
          "title": "Supply agreement: Regional Health Distributor",
          "source": "CRM · contracts",
          "text": "Service level 95% on-time in full. Stock-outs of essential medicines trigger escalation to the health authority and financial penalties."
        }
      ],
      "prompts": [
        "Which batches are at risk this month?",
        "Why are batch releases behind schedule?",
        "Which suppliers have unusual pricing?",
        "Where can AI save the most money?"
      ]
    },
    {
      "id": "auto",
      "name": "Automotive Manufacturing",
      "icon": "🚗",
      "sector": "Manufacturing",
      "currency": {
        "symbol": "$",
        "code": "USD"
      },
      "systems": [
        {
          "name": "SAP ERP",
          "type": "ERP",
          "provides": "Call-offs, EDI releases, purchasing"
        },
        {
          "name": "MES",
          "type": "MES",
          "provides": "Station output, cycle times, traceability"
        },
        {
          "name": "Robot / PLC telemetry",
          "type": "IoT",
          "provides": "Vibration, current, fault codes"
        },
        {
          "name": "QMS",
          "type": "Quality",
          "provides": "PPM, 8D, supplier quality holds"
        },
        {
          "name": "Supplier portal",
          "type": "SRM",
          "provides": "ASNs, supplier capacity"
        }
      ],
      "terms": {
        "entity": "Call-off",
        "entityPlural": "Call-offs",
        "customer": "OEM",
        "asset": "Robotic cell",
        "assetPlural": "Cells",
        "unit": "assemblies",
        "successMetric": "JIT delivery",
        "site": "Plant",
        "supplier": "Tier-2 supplier"
      },
      "kpis": [
        {
          "label": "JIT delivery",
          "value": "96.1%",
          "delta": "−1.4 pts",
          "bad": true
        },
        {
          "label": "OEE",
          "value": "78.5%",
          "delta": "−2.2 pts",
          "bad": true
        },
        {
          "label": "Customer PPM",
          "value": "34",
          "delta": "+9 PPM",
          "bad": true
        },
        {
          "label": "Premium freight",
          "value": "$84K",
          "delta": "−$12K",
          "bad": false
        }
      ],
      "health": {
        "score": 74,
        "parts": [
          [
            "Delivery",
            76
          ],
          [
            "Production",
            72
          ],
          [
            "Quality",
            69
          ],
          [
            "Supply",
            67
          ],
          [
            "Cost",
            81
          ]
        ]
      },
      "revenue": {
        "label": "Monthly revenue",
        "values": [
          21.0,
          22.4,
          23.1,
          22.0,
          24.5,
          25.2,
          23.8,
          19.6,
          24.9,
          25.7,
          25.1,
          24.4
        ]
      },
      "trend": {
        "label": "JIT delivery %",
        "values": [
          98.0,
          97.9,
          97.7,
          97.5,
          97.4,
          97.1,
          96.9,
          96.8,
          96.6,
          96.4,
          96.3,
          96.1
        ],
        "forecast": [
          95.6,
          95.0,
          94.6,
          94.1
        ],
        "target": 98
      },
      "flagship": {
        "id": "JIT-5520",
        "title": "Brake assemblies · weekly call-off",
        "customer": "OEM Assembly Plant North",
        "qty": "12,000 assemblies",
        "value": 1800000,
        "due": "Fri 06:00",
        "predicted": "Mon 14:00",
        "risk": "Line-stop risk at OEM",
        "metric": "JIT delivery probability",
        "base": 64,
        "alert": "Call-off JIT-5520 has a 64% chance of on-time delivery. The OEM line-stop exposure is $648K.",
        "drivers": [
          {
            "label": "Casting supplier quality hold",
            "impact": 40,
            "source": "QMS",
            "evidence": "2,400 castings are held for porosity (8D open) and replacement ASN is not confirmed."
          },
          {
            "label": "Robotic cell R-12 failure risk",
            "impact": 35,
            "source": "Robot telemetry",
            "evidence": "J4 gearbox vibration is up 38% over 5 days. The model predicts a 71% failure probability within 72 h."
          },
          {
            "label": "Line-side inventory below 2 days",
            "impact": 25,
            "source": "SAP ERP",
            "evidence": "Caliper housings cover 1.6 days against a 3-day safety stock."
          }
        ],
        "options": [
          {
            "id": "A",
            "label": "Preventive maintenance on R-12 tonight",
            "uplift": 20,
            "cost": 12000,
            "time": "Tonight",
            "owner": "Maintenance",
            "targets": 1
          },
          {
            "id": "B",
            "label": "Dual-source castings from backup foundry",
            "uplift": 22,
            "cost": 45000,
            "time": "3 days",
            "owner": "Purchasing",
            "targets": 0
          },
          {
            "id": "C",
            "label": "Premium freight for housings",
            "uplift": 12,
            "cost": 30000,
            "time": "48 h",
            "owner": "Logistics",
            "targets": 2
          }
        ],
        "stress": {
          "label": "Additional supplier hold",
          "unit": "days",
          "max": 7,
          "perUnit": 0.2,
          "costPerUnit": 0
        }
      },
      "portfolio": [
        {
          "id": "JIT-5520",
          "customer": "OEM Assembly Plant North",
          "value": 1800000,
          "prob": 64,
          "driver": "Casting quality hold",
          "due": "Fri"
        },
        {
          "id": "JIT-5531",
          "customer": "OEM Assembly Plant South",
          "value": 1250000,
          "prob": 71,
          "driver": "Cell R-12 risk",
          "due": "Mon"
        },
        {
          "id": "SVC-880",
          "customer": "Aftermarket Parts Co.",
          "value": 390000,
          "prob": 77,
          "driver": "Packaging",
          "due": "Wed"
        },
        {
          "id": "JIT-5544",
          "customer": "EV Startup Motors",
          "value": 720000,
          "prob": 84,
          "driver": "Engineering change",
          "due": "Thu"
        },
        {
          "id": "JIT-5509",
          "customer": "OEM Assembly Plant North",
          "value": 1700000,
          "prob": 95,
          "driver": "On track",
          "due": "Tue"
        },
        {
          "id": "PRO-114",
          "customer": "Truck OEM",
          "value": 260000,
          "prob": 91,
          "driver": "On track",
          "due": "Next wk"
        }
      ],
      "predictions": [
        {
          "area": "Delivery",
          "title": "JIT-5520 at risk of short shipment",
          "prob": 36,
          "horizon": "Fri",
          "impact": 648000
        },
        {
          "area": "Machine",
          "title": "Robot R-12 J4 gearbox failure",
          "prob": 71,
          "horizon": "72 h",
          "impact": 190000
        },
        {
          "area": "Quality",
          "title": "Weld spatter defects rising on cell W-3",
          "prob": 48,
          "horizon": "1 week",
          "impact": 55000
        },
        {
          "area": "Supply",
          "title": "Tier-2 casting shortage",
          "prob": 62,
          "horizon": "5 days",
          "impact": 400000
        },
        {
          "area": "Cost",
          "title": "Premium freight overspend",
          "prob": 58,
          "horizon": "Month-end",
          "impact": 70000
        },
        {
          "area": "Energy",
          "title": "Compressed-air leak on line 3",
          "prob": 67,
          "horizon": "Now",
          "impact": 22000
        }
      ],
      "anomalies": [
        {
          "id": "PO-A5512",
          "supplier": "Foundry Rheinmetal",
          "item": "Caliper castings",
          "variance": 9.8,
          "score": 73
        },
        {
          "id": "PO-A5540",
          "supplier": "FastenAll",
          "item": "M10 bolts",
          "variance": 22.4,
          "score": 81
        },
        {
          "id": "PO-A5577",
          "supplier": "LogiExpress",
          "item": "Premium freight",
          "variance": 35.0,
          "score": 77
        }
      ],
      "savings": [
        {
          "area": "Avoided OEM line-stops",
          "value": 2100000,
          "note": "Earlier call-off risk detection"
        },
        {
          "area": "Predictive maintenance (robots)",
          "value": 640000,
          "note": "Unplanned downtime avoided"
        },
        {
          "area": "Premium freight reduction",
          "value": 310000,
          "note": "Planned instead of panic shipments"
        },
        {
          "area": "Quality escapes",
          "value": 220000,
          "note": "Lower PPM and fewer chargebacks"
        }
      ],
      "workflow": {
        "unit": "hours",
        "stages": [
          {
            "stage": "EDI call-off",
            "current": 4,
            "optimised": 1,
            "status": "ok",
            "note": "Automated EDI release"
          },
          {
            "stage": "Material call",
            "current": 36,
            "optimised": 20,
            "status": "bottleneck",
            "note": "Supplier holds and low line-side stock"
          },
          {
            "stage": "Machining",
            "current": 18,
            "optimised": 16,
            "status": "ok",
            "note": "Stable"
          },
          {
            "stage": "Assembly (robotic)",
            "current": 22,
            "optimised": 16,
            "status": "warn",
            "note": "R-12 micro-stops"
          },
          {
            "stage": "End-of-line test",
            "current": 6,
            "optimised": 5,
            "status": "ok",
            "note": "Automated"
          },
          {
            "stage": "Sequenced shipment",
            "current": 8,
            "optimised": 6,
            "status": "ok",
            "note": "Milk-run"
          }
        ],
        "recommendations": [
          {
            "stage": "Material call",
            "text": "Set dynamic safety stock from predicted supplier risk, not fixed days of cover.",
            "saving": "−16 h"
          },
          {
            "stage": "Assembly (robotic)",
            "text": "Run condition-based maintenance from robot telemetry before failures.",
            "saving": "−6 h"
          },
          {
            "stage": "Sequenced shipment",
            "text": "Plan truck slots from predicted completion times.",
            "saving": "−2 h"
          }
        ]
      },
      "twin": {
        "title": "Assembly plant",
        "zones": [
          {
            "name": "Machining",
            "assets": [
              {
                "id": "CNC-1",
                "status": "ok",
                "kpi": 84,
                "unit": "% OEE"
              },
              {
                "id": "CNC-2",
                "status": "ok",
                "kpi": 81,
                "unit": "% OEE"
              }
            ]
          },
          {
            "name": "Robotic assembly",
            "assets": [
              {
                "id": "R-10",
                "status": "ok",
                "kpi": 86,
                "unit": "% OEE"
              },
              {
                "id": "R-12",
                "status": "risk",
                "kpi": 62,
                "unit": "% OEE",
                "alert": "J4 gearbox failure risk of 71% in 72 h"
              },
              {
                "id": "W-3",
                "status": "warn",
                "kpi": 74,
                "unit": "% OEE",
                "alert": "Weld spatter trend"
              }
            ]
          },
          {
            "name": "Logistics",
            "assets": [
              {
                "id": "LINESIDE",
                "status": "risk",
                "kpi": 1.6,
                "unit": "days cover",
                "alert": "Below safety stock"
              },
              {
                "id": "DOCK-2",
                "status": "ok",
                "kpi": 3,
                "unit": "trucks due"
              }
            ]
          }
        ]
      },
      "alerts": [
        {
          "sev": "high",
          "title": "JIT-5520 short-shipment risk",
          "detail": "64% on-time · $648K exposed"
        },
        {
          "sev": "high",
          "title": "Robot R-12 failure predicted",
          "detail": "71% within 72 h"
        },
        {
          "sev": "med",
          "title": "Casting quality hold",
          "detail": "2,400 parts on hold"
        },
        {
          "sev": "low",
          "title": "M10 bolt price anomaly",
          "detail": "+22.4% vs contract"
        }
      ],
      "knowledge": [
        {
          "id": "A-SOP-7",
          "title": "SOP: Robot preventive maintenance",
          "source": "Maintenance CMMS",
          "text": "When the predicted failure probability goes above 60% within 7 days, maintenance may schedule an unplanned PM in the next non-production window. Spare J4 gearboxes are held in central stores."
        },
        {
          "id": "A-POL-2",
          "title": "Policy: Dual sourcing and backup foundry",
          "source": "Purchasing handbook",
          "text": "The backup foundry is PPAP-approved for caliper castings, with a 3-day lead time and a 9% price premium. Activating it needs purchasing director approval."
        },
        {
          "id": "A-CON-9",
          "title": "OEM supply agreement: line-stop clause",
          "source": "CRM · contracts",
          "text": "Supplier-caused line stoppage at the OEM is charged at $36,000 per hour, plus containment and sorting costs."
        },
        {
          "id": "A-KPI-3",
          "title": "KPI definitions: OEE, PPM, JIT",
          "source": "BI glossary",
          "text": "OEE is availability times performance times quality. PPM is defective parts per million shipped. JIT delivery is call-offs delivered in the committed window and sequence."
        }
      ],
      "prompts": [
        "Which OEM call-offs are at risk this week?",
        "Why is assembly behind schedule?",
        "Which suppliers have unusual pricing?",
        "Where can AI save the most money?"
      ]
    },
    {
      "id": "food",
      "name": "Food & Beverage",
      "icon": "🥤",
      "sector": "Consumer goods",
      "currency": {
        "symbol": "$",
        "code": "USD"
      },
      "systems": [
        {
          "name": "Microsoft Dynamics 365",
          "type": "ERP",
          "provides": "Orders, recipes, purchasing"
        },
        {
          "name": "MES",
          "type": "MES",
          "provides": "Filling, CIP, line speed"
        },
        {
          "name": "Cold-chain IoT",
          "type": "IoT",
          "provides": "Temperatures, humidity"
        },
        {
          "name": "LIMS",
          "type": "Quality",
          "provides": "Micro, shelf-life, allergens"
        },
        {
          "name": "TMS / WMS",
          "type": "WMS",
          "provides": "Reefer fleet, dock slots"
        }
      ],
      "terms": {
        "entity": "Order",
        "entityPlural": "Orders",
        "customer": "Retailer",
        "asset": "Filling line",
        "assetPlural": "Lines",
        "unit": "cases",
        "successMetric": "On-time in-full (OTIF)",
        "site": "Plant",
        "supplier": "Farm co-op"
      },
      "kpis": [
        {
          "label": "OTIF",
          "value": "92.3%",
          "delta": "−1.9 pts",
          "bad": true
        },
        {
          "label": "Waste / spoilage",
          "value": "3.6%",
          "delta": "+0.5 pts",
          "bad": true
        },
        {
          "label": "Line OEE",
          "value": "71.0%",
          "delta": "−1.2 pts",
          "bad": true
        },
        {
          "label": "Forecast accuracy",
          "value": "84%",
          "delta": "+2 pts",
          "bad": false
        }
      ],
      "health": {
        "score": 73,
        "parts": [
          [
            "Service",
            70
          ],
          [
            "Production",
            71
          ],
          [
            "Quality",
            86
          ],
          [
            "Supply",
            64
          ],
          [
            "Waste",
            68
          ]
        ]
      },
      "revenue": {
        "label": "Monthly revenue",
        "values": [
          6.2,
          6.0,
          6.5,
          6.9,
          7.4,
          8.1,
          8.6,
          8.4,
          7.6,
          7.0,
          6.7,
          6.9
        ]
      },
      "trend": {
        "label": "OTIF %",
        "values": [
          95.0,
          94.8,
          94.6,
          94.4,
          94.0,
          93.8,
          93.5,
          93.2,
          93.0,
          92.7,
          92.5,
          92.3
        ],
        "forecast": [
          91.8,
          91.1,
          90.5,
          90.0
        ],
        "target": 95
      },
      "flagship": {
        "id": "PO-3380",
        "title": "Yoghurt promotion · 40,000 cases",
        "customer": "National Supermarket Chain",
        "qty": "40,000 cases",
        "value": 620000,
        "due": "Tue",
        "predicted": "Thu (short 18%)",
        "risk": "Promotion short-fill",
        "metric": "On-time in-full probability",
        "base": 60,
        "alert": "Promotion order PO-3380 has a 60% chance of shipping in full and on time. $248K is at risk.",
        "drivers": [
          {
            "label": "Raw milk supply shortfall",
            "impact": 40,
            "source": "Microsoft Dynamics 365",
            "evidence": "The farm co-op is delivering 82% of contracted volume (heat wave), so 64K litres are short for the week."
          },
          {
            "label": "Filler F-3 CIP overrun",
            "impact": 30,
            "source": "MES",
            "evidence": "CIP cycles are averaging 2.4 h against a 1.5 h standard, costing 5.4 h of filling time per day."
          },
          {
            "label": "Reefer truck capacity",
            "impact": 30,
            "source": "TMS / WMS",
            "evidence": "Only 9 of 14 reefer loads are booked for Tuesday's delivery window."
          }
        ],
        "options": [
          {
            "id": "A",
            "label": "Buy spot milk from a secondary co-op",
            "uplift": 20,
            "cost": 18000,
            "time": "24 h",
            "owner": "Procurement",
            "targets": 0
          },
          {
            "id": "B",
            "label": "Move volume to F-1 and optimise CIP",
            "uplift": 15,
            "cost": 6000,
            "time": "Next shift",
            "owner": "Production",
            "targets": 1
          },
          {
            "id": "C",
            "label": "Book 3PL reefer trucks",
            "uplift": 14,
            "cost": 14000,
            "time": "Same day",
            "owner": "Logistics",
            "targets": 2
          }
        ],
        "stress": {
          "label": "Demand uplift above forecast",
          "unit": "%",
          "max": 30,
          "perUnit": 0.035,
          "costPerUnit": 0
        }
      },
      "portfolio": [
        {
          "id": "PO-3380",
          "customer": "National Supermarket Chain",
          "value": 620000,
          "prob": 60,
          "driver": "Milk shortfall",
          "due": "Tue"
        },
        {
          "id": "PO-3391",
          "customer": "Discount Grocer",
          "value": 310000,
          "prob": 67,
          "driver": "Reefer capacity",
          "due": "Wed"
        },
        {
          "id": "PO-3372",
          "customer": "Convenience Stores Group",
          "value": 180000,
          "prob": 75,
          "driver": "Label change",
          "due": "Tue"
        },
        {
          "id": "PO-3402",
          "customer": "Export: Gulf Retail",
          "value": 450000,
          "prob": 83,
          "driver": "Shelf-life window",
          "due": "Fri"
        },
        {
          "id": "PO-3365",
          "customer": "Online Grocery",
          "value": 140000,
          "prob": 91,
          "driver": "On track",
          "due": "Mon"
        },
        {
          "id": "PO-3410",
          "customer": "National Supermarket Chain",
          "value": 580000,
          "prob": 93,
          "driver": "On track",
          "due": "Next wk"
        }
      ],
      "predictions": [
        {
          "area": "Service",
          "title": "PO-3380 likely short by 18%",
          "prob": 40,
          "horizon": "Tue",
          "impact": 248000
        },
        {
          "area": "Supply",
          "title": "Milk intake below plan for 5 days",
          "prob": 76,
          "horizon": "This week",
          "impact": 190000
        },
        {
          "area": "Quality",
          "title": "Shelf-life breach risk on lot Y-771",
          "prob": 33,
          "horizon": "4 days",
          "impact": 60000
        },
        {
          "area": "Machine",
          "title": "Filler F-3 valve seal failure",
          "prob": 52,
          "horizon": "6 days",
          "impact": 42000
        },
        {
          "area": "Waste",
          "title": "Overproduction of plain SKU",
          "prob": 61,
          "horizon": "Next week",
          "impact": 38000
        },
        {
          "area": "Cold chain",
          "title": "Cold room CR-2 temperature excursion",
          "prob": 44,
          "horizon": "48 h",
          "impact": 85000
        }
      ],
      "anomalies": [
        {
          "id": "PO-F7710",
          "supplier": "Valley Co-op",
          "item": "Raw milk (spot)",
          "variance": 16.2,
          "score": 78
        },
        {
          "id": "PO-F7722",
          "supplier": "SweetCo",
          "item": "Sugar",
          "variance": 9.4,
          "score": 62
        },
        {
          "id": "PO-F7735",
          "supplier": "PackRight",
          "item": "Yoghurt cups",
          "variance": 13.0,
          "score": 70
        }
      ],
      "savings": [
        {
          "area": "Promotion availability",
          "value": 820000,
          "note": "Fewer short-fills and fines"
        },
        {
          "area": "Waste & spoilage",
          "value": 410000,
          "note": "Demand-driven production"
        },
        {
          "area": "CIP & changeover optimisation",
          "value": 190000,
          "note": "More filling hours"
        },
        {
          "area": "Procurement anomalies",
          "value": 120000,
          "note": "Spot purchase variance"
        }
      ],
      "workflow": {
        "unit": "hours",
        "stages": [
          {
            "stage": "Order & forecast",
            "current": 12,
            "optimised": 6,
            "status": "warn",
            "note": "Promo uplift not in forecast"
          },
          {
            "stage": "Milk intake",
            "current": 24,
            "optimised": 16,
            "status": "bottleneck",
            "note": "Supply shortfall"
          },
          {
            "stage": "Processing",
            "current": 10,
            "optimised": 9,
            "status": "ok",
            "note": "Fermentation stable"
          },
          {
            "stage": "Filling & CIP",
            "current": 14,
            "optimised": 10,
            "status": "warn",
            "note": "CIP overrun on F-3"
          },
          {
            "stage": "QA hold",
            "current": 24,
            "optimised": 18,
            "status": "ok",
            "note": "Micro results"
          },
          {
            "stage": "Cold-chain delivery",
            "current": 12,
            "optimised": 10,
            "status": "warn",
            "note": "Reefer booking"
          }
        ],
        "recommendations": [
          {
            "stage": "Milk intake",
            "text": "Predict co-op shortfalls from weather and yield data, and pre-book secondary supply.",
            "saving": "−8 h"
          },
          {
            "stage": "Filling & CIP",
            "text": "Tune CIP cycle length from sensor-based cleanliness verification.",
            "saving": "−4 h"
          },
          {
            "stage": "Order & forecast",
            "text": "Feed retailer promotion calendars into demand sensing.",
            "saving": "−6 h"
          }
        ]
      },
      "twin": {
        "title": "Dairy plant",
        "zones": [
          {
            "name": "Intake",
            "assets": [
              {
                "id": "SILO-1",
                "status": "warn",
                "kpi": 58,
                "unit": "% full",
                "alert": "Below plan"
              },
              {
                "id": "SILO-2",
                "status": "ok",
                "kpi": 71,
                "unit": "% full"
              }
            ]
          },
          {
            "name": "Filling",
            "assets": [
              {
                "id": "F-1",
                "status": "ok",
                "kpi": 79,
                "unit": "% OEE"
              },
              {
                "id": "F-3",
                "status": "risk",
                "kpi": 58,
                "unit": "% OEE",
                "alert": "CIP overrun and seal risk"
              }
            ]
          },
          {
            "name": "Cold chain",
            "assets": [
              {
                "id": "CR-1",
                "status": "ok",
                "kpi": 3.2,
                "unit": "°C"
              },
              {
                "id": "CR-2",
                "status": "warn",
                "kpi": 5.4,
                "unit": "°C",
                "alert": "Excursion risk"
              },
              {
                "id": "REEFERS",
                "status": "risk",
                "kpi": 9,
                "unit": "/14 booked",
                "alert": "5 loads short"
              }
            ]
          }
        ]
      },
      "alerts": [
        {
          "sev": "high",
          "title": "PO-3380 short-fill risk",
          "detail": "60% OTIF · $248K exposed"
        },
        {
          "sev": "high",
          "title": "Milk intake 18% below plan",
          "detail": "Heat wave impact"
        },
        {
          "sev": "med",
          "title": "Cold room CR-2 drift",
          "detail": "5.4 °C and rising"
        },
        {
          "sev": "low",
          "title": "Cup price anomaly",
          "detail": "+13% vs contract"
        }
      ],
      "knowledge": [
        {
          "id": "F-SOP-4",
          "title": "SOP: Secondary milk sourcing",
          "source": "Procurement manual",
          "text": "Spot milk can be bought from approved secondary co-ops when intake is predicted below 90% of plan, subject to incoming quality testing. Spot premiums above 15% need commercial director approval."
        },
        {
          "id": "F-SOP-9",
          "title": "SOP: CIP validation",
          "source": "Food safety manual",
          "text": "CIP cycles may be shortened only when conductivity, temperature and flow sensors verify the validated cleaning parameters. Allergen changeovers always run the full cycle."
        },
        {
          "id": "F-CON-2",
          "title": "Retailer agreement: promotions",
          "source": "CRM · contracts",
          "text": "Promotional orders carry an OTIF target of 98%. Short-fills incur a 3% fine on undelivered value and affect future promotion slots."
        },
        {
          "id": "F-QA-1",
          "title": "Cold-chain policy",
          "source": "Food safety manual",
          "text": "Finished yoghurt must stay between 2 and 6 °C. Excursions above 8 °C for more than 30 minutes require QA disposition."
        }
      ],
      "prompts": [
        "Which retailers are at risk this week?",
        "Why is filling behind schedule?",
        "Which suppliers have unusual pricing?",
        "What if demand is 20% above forecast?"
      ]
    },
    {
      "id": "chem",
      "name": "Chemicals",
      "icon": "⚗️",
      "sector": "Process industry",
      "currency": {
        "symbol": "$",
        "code": "USD"
      },
      "systems": [
        {
          "name": "SAP ERP",
          "type": "ERP",
          "provides": "Orders, feedstock, costing"
        },
        {
          "name": "DCS / Historian (PI)",
          "type": "IoT",
          "provides": "Reactor temperatures, pressures, yields"
        },
        {
          "name": "LIMS",
          "type": "Quality",
          "provides": "Spec testing, CoA"
        },
        {
          "name": "APS",
          "type": "Planning",
          "provides": "Campaign schedules"
        },
        {
          "name": "Hazmat logistics",
          "type": "TMS",
          "provides": "ISO-tanks, ADR slots"
        }
      ],
      "terms": {
        "entity": "Order",
        "entityPlural": "Orders",
        "customer": "Customer",
        "asset": "Reactor",
        "assetPlural": "Reactors",
        "unit": "tonnes",
        "successMetric": "On-time delivery",
        "site": "Plant",
        "supplier": "Feedstock supplier"
      },
      "kpis": [
        {
          "label": "On-time delivery",
          "value": "89.7%",
          "delta": "−2.4 pts",
          "bad": true
        },
        {
          "label": "Reactor yield",
          "value": "93.1%",
          "delta": "−1.6 pts",
          "bad": true
        },
        {
          "label": "Energy per tonne",
          "value": "1.42 MWh",
          "delta": "+4%",
          "bad": true
        },
        {
          "label": "Off-spec batches",
          "value": "1.9%",
          "delta": "−0.3 pts",
          "bad": false
        }
      ],
      "health": {
        "score": 71,
        "parts": [
          [
            "Delivery",
            66
          ],
          [
            "Production",
            70
          ],
          [
            "Quality",
            85
          ],
          [
            "Supply",
            60
          ],
          [
            "Energy",
            72
          ]
        ]
      },
      "revenue": {
        "label": "Monthly revenue",
        "values": [
          15.4,
          15.9,
          16.2,
          15.1,
          16.8,
          17.3,
          16.9,
          17.6,
          17.1,
          16.4,
          16.0,
          15.8
        ]
      },
      "trend": {
        "label": "On-time delivery %",
        "values": [
          93.5,
          93.1,
          92.8,
          92.4,
          92.0,
          91.6,
          91.2,
          90.8,
          90.5,
          90.2,
          89.9,
          89.7
        ],
        "forecast": [
          89.0,
          88.3,
          87.7,
          87.0
        ],
        "target": 93
      },
      "flagship": {
        "id": "CH-9014",
        "title": "Acrylic resin · 200 t",
        "customer": "Coatings Manufacturer Ltd",
        "qty": "200 t",
        "value": 900000,
        "due": "3 Oct",
        "predicted": "9 Oct",
        "risk": "Customer delivery delay",
        "metric": "On-time delivery probability",
        "base": 60,
        "alert": "Resin order CH-9014 has a 60% chance of delivering on time. $360K is at risk.",
        "drivers": [
          {
            "label": "Monomer feedstock delay",
            "impact": 40,
            "source": "SAP ERP",
            "evidence": "The butyl acrylate shipment is 6 days late at port and tank farm cover is 3 days."
          },
          {
            "label": "Reactor R-3 fouling",
            "impact": 35,
            "source": "DCS / Historian (PI)",
            "evidence": "The heat-transfer coefficient is down 17%, batch time is up 2.1 h, and yield is 91% against a 95% target."
          },
          {
            "label": "Hazmat shipping slot",
            "impact": 25,
            "source": "Hazmat logistics",
            "evidence": "No ISO-tank slot is confirmed for the delivery week, and ADR carrier capacity is tight."
          }
        ],
        "options": [
          {
            "id": "A",
            "label": "Source monomer from an alternate supplier",
            "uplift": 21,
            "cost": 40000,
            "time": "3 days",
            "owner": "Procurement",
            "targets": 0
          },
          {
            "id": "B",
            "label": "Clean R-3 and shift the campaign to R-5",
            "uplift": 18,
            "cost": 20000,
            "time": "36 h",
            "owner": "Operations",
            "targets": 1
          },
          {
            "id": "C",
            "label": "Reserve an ISO-tank slot now",
            "uplift": 11,
            "cost": 9000,
            "time": "Same day",
            "owner": "Logistics",
            "targets": 2
          }
        ],
        "stress": {
          "label": "Additional feedstock delay",
          "unit": "days",
          "max": 10,
          "perUnit": 0.15,
          "costPerUnit": 0
        }
      },
      "portfolio": [
        {
          "id": "CH-9014",
          "customer": "Coatings Manufacturer Ltd",
          "value": 900000,
          "prob": 60,
          "driver": "Monomer delay",
          "due": "3 Oct"
        },
        {
          "id": "CH-9022",
          "customer": "Adhesives Group",
          "value": 540000,
          "prob": 68,
          "driver": "R-3 fouling",
          "due": "6 Oct"
        },
        {
          "id": "CH-9001",
          "customer": "Textile Chemicals Co.",
          "value": 310000,
          "prob": 73,
          "driver": "Hazmat slot",
          "due": "1 Oct"
        },
        {
          "id": "CH-9030",
          "customer": "Automotive Paints",
          "value": 1200000,
          "prob": 85,
          "driver": "Spec change",
          "due": "15 Oct"
        },
        {
          "id": "CH-8994",
          "customer": "Construction Sealants",
          "value": 260000,
          "prob": 90,
          "driver": "On track",
          "due": "29 Sep"
        },
        {
          "id": "CH-9041",
          "customer": "Packaging Inks",
          "value": 420000,
          "prob": 94,
          "driver": "On track",
          "due": "20 Oct"
        }
      ],
      "predictions": [
        {
          "area": "Delivery",
          "title": "CH-9014 likely 6 days late",
          "prob": 40,
          "horizon": "3 Oct",
          "impact": 360000
        },
        {
          "area": "Asset",
          "title": "Reactor R-3 fouling reaches cleaning threshold",
          "prob": 83,
          "horizon": "4 days",
          "impact": 120000
        },
        {
          "area": "Quality",
          "title": "Viscosity off-spec risk, campaign 22",
          "prob": 31,
          "horizon": "Next batch",
          "impact": 75000
        },
        {
          "area": "Supply",
          "title": "Monomer tank farm stock-out",
          "prob": 64,
          "horizon": "3 days",
          "impact": 280000
        },
        {
          "area": "Energy",
          "title": "Steam consumption anomaly on R-5",
          "prob": 59,
          "horizon": "Now",
          "impact": 28000
        },
        {
          "area": "Safety",
          "title": "Pressure relief valve inspection overdue",
          "prob": 90,
          "horizon": "Now",
          "impact": 0
        }
      ],
      "anomalies": [
        {
          "id": "PO-K3310",
          "supplier": "PetroMonomers",
          "item": "Butyl acrylate",
          "variance": 11.3,
          "score": 80
        },
        {
          "id": "PO-K3327",
          "supplier": "Catalyst Corp",
          "item": "Initiator",
          "variance": 24.6,
          "score": 84
        },
        {
          "id": "PO-K3339",
          "supplier": "TankLog",
          "item": "ISO-tank hire",
          "variance": 18.0,
          "score": 69
        }
      ],
      "savings": [
        {
          "area": "Delivery risk recovery",
          "value": 950000,
          "note": "Earlier feedstock and slot action"
        },
        {
          "area": "Reactor yield & fouling",
          "value": 610000,
          "note": "Optimal cleaning schedule"
        },
        {
          "area": "Energy optimisation",
          "value": 330000,
          "note": "Steam and cooling anomalies"
        },
        {
          "area": "Procurement anomalies",
          "value": 160000,
          "note": "Catalyst price variance"
        }
      ],
      "workflow": {
        "unit": "days",
        "stages": [
          {
            "stage": "Order",
            "current": 1,
            "optimised": 1,
            "status": "ok",
            "note": "ERP"
          },
          {
            "stage": "Feedstock planning",
            "current": 8,
            "optimised": 5,
            "status": "bottleneck",
            "note": "Port delays and low tank cover"
          },
          {
            "stage": "Reaction campaign",
            "current": 5,
            "optimised": 4,
            "status": "warn",
            "note": "R-3 fouling"
          },
          {
            "stage": "QC & CoA",
            "current": 2,
            "optimised": 1.5,
            "status": "ok",
            "note": "LIMS"
          },
          {
            "stage": "Filling",
            "current": 1,
            "optimised": 1,
            "status": "ok",
            "note": "Drums and IBCs"
          },
          {
            "stage": "Hazmat delivery",
            "current": 4,
            "optimised": 2.5,
            "status": "warn",
            "note": "ISO-tank availability"
          }
        ],
        "recommendations": [
          {
            "stage": "Feedstock planning",
            "text": "Link vessel-tracking ETAs to tank-farm forecasts so alternate supply is triggered early.",
            "saving": "−3 days"
          },
          {
            "stage": "Reaction campaign",
            "text": "Schedule reactor cleaning from predicted fouling, not fixed intervals.",
            "saving": "−1 day"
          },
          {
            "stage": "Hazmat delivery",
            "text": "Book ISO-tanks automatically at campaign start using the predicted finish date.",
            "saving": "−1.5 days"
          }
        ]
      },
      "twin": {
        "title": "Chemical plant",
        "zones": [
          {
            "name": "Tank farm",
            "assets": [
              {
                "id": "TK-BA",
                "status": "risk",
                "kpi": 3,
                "unit": "days cover",
                "alert": "Monomer stock-out risk"
              },
              {
                "id": "TK-MMA",
                "status": "ok",
                "kpi": 11,
                "unit": "days cover"
              }
            ]
          },
          {
            "name": "Reactors",
            "assets": [
              {
                "id": "R-3",
                "status": "risk",
                "kpi": 91,
                "unit": "% yield",
                "alert": "Fouling, HTC down 17%"
              },
              {
                "id": "R-4",
                "status": "ok",
                "kpi": 95,
                "unit": "% yield"
              },
              {
                "id": "R-5",
                "status": "warn",
                "kpi": 94,
                "unit": "% yield",
                "alert": "Steam anomaly"
              }
            ]
          },
          {
            "name": "Logistics",
            "assets": [
              {
                "id": "ISO",
                "status": "warn",
                "kpi": 2,
                "unit": "tanks free",
                "alert": "Slots tight"
              },
              {
                "id": "DRUM",
                "status": "ok",
                "kpi": 88,
                "unit": "% ready"
              }
            ]
          }
        ]
      },
      "alerts": [
        {
          "sev": "high",
          "title": "CH-9014 delivery at risk",
          "detail": "60% on-time · $360K exposed"
        },
        {
          "sev": "high",
          "title": "Monomer stock-out in 3 days",
          "detail": "Vessel 6 days late"
        },
        {
          "sev": "med",
          "title": "R-3 fouling threshold",
          "detail": "83% within 4 days"
        },
        {
          "sev": "low",
          "title": "Initiator price anomaly",
          "detail": "+24.6% vs contract"
        }
      ],
      "knowledge": [
        {
          "id": "CH-SOP-6",
          "title": "SOP: Alternate feedstock qualification",
          "source": "Quality manual",
          "text": "Alternate monomer suppliers on the approved list may be used after CoA verification. First delivery from a new supplier needs a lab-scale reactivity check."
        },
        {
          "id": "CH-SOP-11",
          "title": "SOP: Reactor cleaning and campaign transfer",
          "source": "Operations manual",
          "text": "Transferring a campaign between reactors needs a recipe check and a 36-hour clean and changeover. R-5 is qualified for acrylic resins."
        },
        {
          "id": "CH-HSE-1",
          "title": "HSE: Hazmat transport",
          "source": "HSE manual",
          "text": "Class 3 flammable products must use ADR-certified carriers and ISO-tanks. Slots are booked at least 5 days ahead."
        },
        {
          "id": "CH-CON-3",
          "title": "Contract: Coatings Manufacturer Ltd",
          "source": "CRM · contracts",
          "text": "A late delivery lets the customer buy cover elsewhere and charge the price difference. The customer is strategic, with $10M annual volume."
        }
      ],
      "prompts": [
        "Which customers are at risk this month?",
        "Why is production behind schedule?",
        "Which suppliers have unusual pricing?",
        "Where can AI save the most money?"
      ]
    },
    {
      "id": "logistics",
      "name": "Logistics",
      "icon": "🚚",
      "sector": "Transport & logistics",
      "currency": {
        "symbol": "$",
        "code": "USD"
      },
      "systems": [
        {
          "name": "Oracle TMS",
          "type": "TMS",
          "provides": "Loads, routes, carriers"
        },
        {
          "name": "Manhattan WMS",
          "type": "WMS",
          "provides": "Warehouse throughput, docks"
        },
        {
          "name": "Telematics / GPS",
          "type": "IoT",
          "provides": "Vehicle location, fuel, driver hours"
        },
        {
          "name": "Port / carrier EDI",
          "type": "EDI",
          "provides": "Vessel ETAs, container status"
        },
        {
          "name": "Salesforce",
          "type": "CRM",
          "provides": "Customer SLAs, contracts"
        }
      ],
      "terms": {
        "entity": "Shipment",
        "entityPlural": "Shipments",
        "customer": "Shipper",
        "asset": "Hub",
        "assetPlural": "Hubs",
        "unit": "loads",
        "successMetric": "SLA achievement",
        "site": "Network",
        "supplier": "Carrier"
      },
      "kpis": [
        {
          "label": "SLA achievement",
          "value": "93.8%",
          "delta": "−1.7 pts",
          "bad": true
        },
        {
          "label": "Cost per km",
          "value": "$1.84",
          "delta": "+6.2%",
          "bad": true
        },
        {
          "label": "Empty miles",
          "value": "14.2%",
          "delta": "+1.1 pts",
          "bad": true
        },
        {
          "label": "Fleet utilisation",
          "value": "86%",
          "delta": "+2 pts",
          "bad": false
        }
      ],
      "health": {
        "score": 75,
        "parts": [
          [
            "Service",
            74
          ],
          [
            "Network",
            70
          ],
          [
            "Fleet",
            82
          ],
          [
            "Cost",
            63
          ],
          [
            "Safety",
            91
          ]
        ]
      },
      "revenue": {
        "label": "Monthly revenue",
        "values": [
          9.1,
          9.4,
          9.8,
          9.6,
          10.2,
          10.5,
          10.1,
          10.8,
          11.3,
          11.9,
          12.6,
          13.4
        ]
      },
      "trend": {
        "label": "SLA achievement %",
        "values": [
          96.2,
          96.0,
          95.7,
          95.5,
          95.3,
          95.0,
          94.8,
          94.6,
          94.4,
          94.2,
          94.0,
          93.8
        ],
        "forecast": [
          93.1,
          92.4,
          91.9,
          91.2
        ],
        "target": 96
      },
      "flagship": {
        "id": "SH-44120",
        "title": "Peak-season distribution · 38 loads",
        "customer": "ElectroMart Retail",
        "qty": "38 FTL loads",
        "value": 760000,
        "due": "Fri",
        "predicted": "Mon",
        "risk": "SLA breach",
        "metric": "SLA achievement probability",
        "base": 62,
        "alert": "Shipment SH-44120 has a 62% chance of meeting its SLA. $289K is at risk.",
        "drivers": [
          {
            "label": "Port congestion (vessel 3 days late)",
            "impact": 40,
            "source": "Port / carrier EDI",
            "evidence": "The MSC vessel ETA moved from Mon to Thu, delaying 22 inbound containers."
          },
          {
            "label": "Driver shortage at the Midlands hub",
            "impact": 35,
            "source": "Telematics / GPS",
            "evidence": "11 drivers are near their hours-of-service limit this week, with 6 vacancies open."
          },
          {
            "label": "Fuel cost spike and route diversion",
            "impact": 25,
            "source": "Oracle TMS",
            "evidence": "The M6 closure adds 42 km per load, and diesel is up 9% in 2 weeks."
          }
        ],
        "options": [
          {
            "id": "A",
            "label": "Reroute inbound containers via rail",
            "uplift": 20,
            "cost": 22000,
            "time": "24 h",
            "owner": "Network planning",
            "targets": 0
          },
          {
            "id": "B",
            "label": "Bring in temporary agency drivers",
            "uplift": 16,
            "cost": 15000,
            "time": "48 h",
            "owner": "Fleet manager",
            "targets": 1
          },
          {
            "id": "C",
            "label": "Consolidate loads at the cross-dock",
            "uplift": 10,
            "cost": 6000,
            "time": "Same day",
            "owner": "Hub manager",
            "targets": 2
          }
        ],
        "stress": {
          "label": "Fuel price increase",
          "unit": "%",
          "max": 30,
          "perUnit": 0.02,
          "costPerUnit": 1400
        }
      },
      "portfolio": [
        {
          "id": "SH-44120",
          "customer": "ElectroMart Retail",
          "value": 760000,
          "prob": 62,
          "driver": "Port congestion",
          "due": "Fri"
        },
        {
          "id": "SH-44131",
          "customer": "FreshFoods Group",
          "value": 420000,
          "prob": 69,
          "driver": "Reefer availability",
          "due": "Thu"
        },
        {
          "id": "SH-44098",
          "customer": "HomeStyle Furniture",
          "value": 280000,
          "prob": 74,
          "driver": "Driver hours",
          "due": "Wed"
        },
        {
          "id": "SH-44145",
          "customer": "PharmaDirect",
          "value": 510000,
          "prob": 82,
          "driver": "Temperature control",
          "due": "Sat"
        },
        {
          "id": "SH-44077",
          "customer": "AutoParts Hub",
          "value": 190000,
          "prob": 90,
          "driver": "On track",
          "due": "Tue"
        },
        {
          "id": "SH-44152",
          "customer": "ElectroMart Retail",
          "value": 830000,
          "prob": 93,
          "driver": "On track",
          "due": "Next wk"
        }
      ],
      "predictions": [
        {
          "area": "Service",
          "title": "SH-44120 SLA breach likely",
          "prob": 38,
          "horizon": "Fri",
          "impact": 289000
        },
        {
          "area": "Fleet",
          "title": "Truck T-118 brake wear critical",
          "prob": 68,
          "horizon": "1 week",
          "impact": 14000
        },
        {
          "area": "Network",
          "title": "Midlands hub dock congestion",
          "prob": 73,
          "horizon": "Thu–Fri",
          "impact": 95000
        },
        {
          "area": "Cost",
          "title": "Fuel spend overrun",
          "prob": 81,
          "horizon": "Month-end",
          "impact": 130000
        },
        {
          "area": "People",
          "title": "Driver hours-of-service breaches",
          "prob": 45,
          "horizon": "This week",
          "impact": 25000
        },
        {
          "area": "Customer",
          "title": "FreshFoods churn signal",
          "prob": 34,
          "horizon": "Quarter",
          "impact": 1200000
        }
      ],
      "anomalies": [
        {
          "id": "INV-L901",
          "supplier": "Subcontract Haulage Ltd",
          "item": "Spot haulage",
          "variance": 27.5,
          "score": 83
        },
        {
          "id": "INV-L918",
          "supplier": "FuelCard Co.",
          "item": "Diesel",
          "variance": 9.1,
          "score": 66
        },
        {
          "id": "INV-L925",
          "supplier": "PortServices",
          "item": "Demurrage",
          "variance": 41.0,
          "score": 88
        }
      ],
      "savings": [
        {
          "area": "SLA penalties avoided",
          "value": 720000,
          "note": "Proactive rerouting"
        },
        {
          "area": "Route & fuel optimisation",
          "value": 540000,
          "note": "Fewer empty miles and diversions"
        },
        {
          "area": "Carrier invoice anomalies",
          "value": 260000,
          "note": "Demurrage and spot overcharges"
        },
        {
          "area": "Predictive fleet maintenance",
          "value": 180000,
          "note": "Fewer roadside failures"
        }
      ],
      "workflow": {
        "unit": "hours",
        "stages": [
          {
            "stage": "Order booked",
            "current": 2,
            "optimised": 1,
            "status": "ok",
            "note": "EDI"
          },
          {
            "stage": "Inbound / port",
            "current": 72,
            "optimised": 40,
            "status": "bottleneck",
            "note": "Vessel delays and port congestion"
          },
          {
            "stage": "Hub cross-dock",
            "current": 10,
            "optimised": 6,
            "status": "warn",
            "note": "Dock congestion"
          },
          {
            "stage": "Line-haul",
            "current": 14,
            "optimised": 12,
            "status": "warn",
            "note": "Diversions and driver hours"
          },
          {
            "stage": "Last mile",
            "current": 8,
            "optimised": 7,
            "status": "ok",
            "note": "Route optimised"
          },
          {
            "stage": "Proof of delivery",
            "current": 4,
            "optimised": 1,
            "status": "ok",
            "note": "ePOD"
          }
        ],
        "recommendations": [
          {
            "stage": "Inbound / port",
            "text": "Predict vessel delays from AIS data and pre-book rail alternatives automatically.",
            "saving": "−32 h"
          },
          {
            "stage": "Hub cross-dock",
            "text": "Assign dock slots dynamically from predicted arrival times.",
            "saving": "−4 h"
          },
          {
            "stage": "Line-haul",
            "text": "Plan routes around closures and fuel prices, and match drivers to their remaining hours.",
            "saving": "−2 h"
          }
        ]
      },
      "twin": {
        "title": "Logistics network",
        "zones": [
          {
            "name": "Ports",
            "assets": [
              {
                "id": "FELIX",
                "status": "risk",
                "kpi": 72,
                "unit": "h dwell",
                "alert": "Vessel 3 days late"
              },
              {
                "id": "SOTON",
                "status": "ok",
                "kpi": 18,
                "unit": "h dwell"
              }
            ]
          },
          {
            "name": "Hubs",
            "assets": [
              {
                "id": "MIDLANDS",
                "status": "risk",
                "kpi": 97,
                "unit": "% docks",
                "alert": "Congestion and driver shortage"
              },
              {
                "id": "NORTH",
                "status": "ok",
                "kpi": 71,
                "unit": "% docks"
              },
              {
                "id": "SOUTH",
                "status": "ok",
                "kpi": 64,
                "unit": "% docks"
              }
            ]
          },
          {
            "name": "Fleet",
            "assets": [
              {
                "id": "ON-ROUTE",
                "status": "ok",
                "kpi": 142,
                "unit": "vehicles"
              },
              {
                "id": "T-118",
                "status": "warn",
                "kpi": 22,
                "unit": "% brake",
                "alert": "Maintenance due"
              },
              {
                "id": "IDLE",
                "status": "warn",
                "kpi": 19,
                "unit": "vehicles"
              }
            ]
          }
        ]
      },
      "alerts": [
        {
          "sev": "high",
          "title": "SH-44120 SLA at risk",
          "detail": "62% · $289K exposed"
        },
        {
          "sev": "high",
          "title": "Midlands hub at 97% dock use",
          "detail": "Driver shortage"
        },
        {
          "sev": "med",
          "title": "Demurrage invoice anomaly",
          "detail": "+41% vs expected"
        },
        {
          "sev": "low",
          "title": "T-118 brake wear",
          "detail": "Service within a week"
        }
      ],
      "knowledge": [
        {
          "id": "L-SOP-2",
          "title": "SOP: Port disruption playbook",
          "source": "Operations manual",
          "text": "When a vessel ETA slips more than 48 hours, network planning evaluates rail and short-sea alternatives. Rail rerouting up to $25,000 is approved by the network director."
        },
        {
          "id": "L-POL-5",
          "title": "Policy: Agency drivers",
          "source": "HR & compliance",
          "text": "Agency drivers must hold a valid licence and driver qualification card, and complete a site induction. Hours-of-service rules are enforced by telematics."
        },
        {
          "id": "L-CON-8",
          "title": "SLA: ElectroMart Retail peak season",
          "source": "CRM · contracts",
          "text": "Peak-season SLA is 97% on-time. Each failed delivery window costs $3,500 plus a 5% rebate on monthly invoices if SLA falls below 92%."
        },
        {
          "id": "L-KPI-1",
          "title": "KPI definitions: SLA, empty miles, cost per km",
          "source": "BI glossary",
          "text": "SLA achievement is deliveries in the agreed window divided by total. Empty miles are unloaded kilometres as a share of total. Cost per km includes fuel, driver, maintenance and tolls."
        }
      ],
      "prompts": [
        "Which shippers are at risk this month?",
        "Why are deliveries behind schedule?",
        "Which carriers have unusual invoices?",
        "What if fuel cost increases 15%?"
      ]
    },
    {
      "id": "health",
      "name": "Healthcare",
      "icon": "🏥",
      "sector": "Healthcare",
      "currency": {
        "symbol": "$",
        "code": "USD"
      },
      "systems": [
        {
          "name": "EHR (Epic / Cerner)",
          "type": "EHR",
          "provides": "Admissions, acuity, orders"
        },
        {
          "name": "Bed management",
          "type": "Ops",
          "provides": "Occupancy, discharges"
        },
        {
          "name": "Rostering",
          "type": "HR",
          "provides": "Staffing, skill mix"
        },
        {
          "name": "RIS / PACS",
          "type": "Diagnostics",
          "provides": "Imaging turnaround"
        },
        {
          "name": "ERP (Finance & supply)",
          "type": "ERP",
          "provides": "Costs, consumables"
        }
      ],
      "terms": {
        "entity": "Capacity plan",
        "entityPlural": "Capacity plans",
        "customer": "Patients",
        "asset": "Ward",
        "assetPlural": "Wards",
        "unit": "patients",
        "successMetric": "4-hour ED target",
        "site": "Hospital",
        "supplier": "Supplier"
      },
      "kpis": [
        {
          "label": "ED 4-hour performance",
          "value": "71.8%",
          "delta": "−3.5 pts",
          "bad": true
        },
        {
          "label": "Bed occupancy",
          "value": "96.4%",
          "delta": "+2.1 pts",
          "bad": true
        },
        {
          "label": "Delayed discharges",
          "value": "58",
          "delta": "+12",
          "bad": true
        },
        {
          "label": "Readmission rate",
          "value": "8.1%",
          "delta": "−0.4 pts",
          "bad": false
        }
      ],
      "health": {
        "score": 66,
        "parts": [
          [
            "Access",
            58
          ],
          [
            "Flow",
            61
          ],
          [
            "Quality",
            82
          ],
          [
            "Workforce",
            63
          ],
          [
            "Finance",
            70
          ]
        ]
      },
      "revenue": {
        "label": "Monthly activity income",
        "values": [
          18.1,
          18.4,
          18.0,
          18.9,
          19.3,
          19.0,
          19.6,
          18.7,
          19.8,
          20.1,
          20.4,
          20.9
        ]
      },
      "trend": {
        "label": "ED 4-hour performance %",
        "values": [
          79.0,
          78.4,
          77.9,
          77.1,
          76.3,
          75.8,
          75.0,
          74.2,
          73.6,
          72.9,
          72.4,
          71.8
        ],
        "forecast": [
          70.9,
          69.8,
          69.1,
          68.2
        ],
        "target": 78
      },
      "flagship": {
        "id": "ED-FLOW-37",
        "title": "Weekend surge · Emergency department",
        "customer": "Patients (forecast 412 arrivals)",
        "qty": "412 patients",
        "value": 420000,
        "due": "Sat–Sun",
        "predicted": "Target missed",
        "risk": "ED overcrowding and target breach",
        "metric": "Probability of meeting 4-hour target",
        "base": 59,
        "alert": "The weekend ED surge has a 59% chance of meeting the 4-hour target. $172K of penalties and diverted activity is at risk.",
        "drivers": [
          {
            "label": "Bed occupancy 97% (discharge delays)",
            "impact": 45,
            "source": "Bed management",
            "evidence": "58 medically fit patients are awaiting discharge, and 14 of them are waiting for social care packages."
          },
          {
            "label": "Nurse staffing gap (night shift)",
            "impact": 30,
            "source": "Rostering",
            "evidence": "The Saturday night shift is 9 RN short against acuity-based demand."
          },
          {
            "label": "Radiology turnaround",
            "impact": 25,
            "source": "RIS / PACS",
            "evidence": "CT turnaround from ED is 3.2 h against a 1 h target, with one scanner down for maintenance."
          }
        ],
        "options": [
          {
            "id": "A",
            "label": "Open a discharge lounge and run early ward rounds",
            "uplift": 20,
            "cost": 8000,
            "time": "Friday",
            "owner": "Operations director",
            "targets": 0
          },
          {
            "id": "B",
            "label": "Book agency nurses for weekend nights",
            "uplift": 15,
            "cost": 24000,
            "time": "24 h",
            "owner": "Chief nurse",
            "targets": 1
          },
          {
            "id": "C",
            "label": "Extend CT hours and prioritise ED scans",
            "uplift": 10,
            "cost": 12000,
            "time": "Weekend",
            "owner": "Radiology lead",
            "targets": 2
          }
        ],
        "stress": {
          "label": "Patient demand increase",
          "unit": "%",
          "max": 30,
          "perUnit": 0.045,
          "costPerUnit": 0
        }
      },
      "portfolio": [
        {
          "id": "ED-FLOW-37",
          "customer": "Emergency department",
          "value": 420000,
          "prob": 59,
          "driver": "Bed occupancy",
          "due": "Weekend"
        },
        {
          "id": "ELEC-ORTHO",
          "customer": "Elective orthopaedics list",
          "value": 380000,
          "prob": 66,
          "driver": "Bed availability",
          "due": "Mon"
        },
        {
          "id": "ONC-DAY",
          "customer": "Oncology day unit",
          "value": 210000,
          "prob": 78,
          "driver": "Pharmacy prep",
          "due": "Tue"
        },
        {
          "id": "DIAG-6W",
          "customer": "Diagnostics 6-week target",
          "value": 290000,
          "prob": 71,
          "driver": "CT capacity",
          "due": "Month-end"
        },
        {
          "id": "MAT-UNIT",
          "customer": "Maternity unit",
          "value": 150000,
          "prob": 88,
          "driver": "On track",
          "due": "Week"
        },
        {
          "id": "OPD-CARD",
          "customer": "Cardiology outpatients",
          "value": 170000,
          "prob": 92,
          "driver": "On track",
          "due": "Week"
        }
      ],
      "predictions": [
        {
          "area": "Flow",
          "title": "ED 4-hour breach this weekend",
          "prob": 41,
          "horizon": "Sat–Sun",
          "impact": 172000
        },
        {
          "area": "Patient",
          "title": "12 inpatients at high deterioration risk (early warning)",
          "prob": 62,
          "horizon": "24 h",
          "impact": 0
        },
        {
          "area": "Patient",
          "title": "Readmission risk: 23 patients due for discharge",
          "prob": 48,
          "horizon": "30 days",
          "impact": 95000
        },
        {
          "area": "Workforce",
          "title": "Night staffing below safe levels on 3 wards",
          "prob": 67,
          "horizon": "Sat",
          "impact": 40000
        },
        {
          "area": "Equipment",
          "title": "CT scanner 2 tube failure",
          "prob": 39,
          "horizon": "2 weeks",
          "impact": 110000
        },
        {
          "area": "Supply",
          "title": "IV consumables stock-out on ward 7",
          "prob": 55,
          "horizon": "5 days",
          "impact": 12000
        }
      ],
      "anomalies": [
        {
          "id": "INV-H201",
          "supplier": "StaffBank Agency",
          "item": "Agency nursing",
          "variance": 32.0,
          "score": 85
        },
        {
          "id": "INV-H214",
          "supplier": "MedSupplies",
          "item": "IV cannulas",
          "variance": 14.6,
          "score": 71
        },
        {
          "id": "INV-H230",
          "supplier": "ImagingCare",
          "item": "Service contract",
          "variance": 8.0,
          "score": 57
        }
      ],
      "savings": [
        {
          "area": "Patient flow & length of stay",
          "value": 1600000,
          "note": "Earlier discharge planning"
        },
        {
          "area": "Agency staffing spend",
          "value": 520000,
          "note": "Predictive rostering"
        },
        {
          "area": "Avoided readmissions",
          "value": 380000,
          "note": "Risk-targeted follow-up"
        },
        {
          "area": "Supply & procurement anomalies",
          "value": 140000,
          "note": "Invoice and price variance"
        }
      ],
      "workflow": {
        "unit": "hours",
        "stages": [
          {
            "stage": "Arrival & triage",
            "current": 0.4,
            "optimised": 0.3,
            "status": "ok",
            "note": "Streaming at the front door"
          },
          {
            "stage": "Assessment",
            "current": 1.1,
            "optimised": 0.9,
            "status": "ok",
            "note": "Clinician review"
          },
          {
            "stage": "Diagnostics",
            "current": 3.2,
            "optimised": 1.5,
            "status": "warn",
            "note": "CT turnaround"
          },
          {
            "stage": "Decision to admit",
            "current": 0.8,
            "optimised": 0.6,
            "status": "ok",
            "note": "Specialty review"
          },
          {
            "stage": "Wait for bed",
            "current": 6.5,
            "optimised": 2.0,
            "status": "bottleneck",
            "note": "Discharge delays upstream"
          },
          {
            "stage": "Discharge",
            "current": 9.0,
            "optimised": 5.0,
            "status": "warn",
            "note": "Late-day discharges, TTO pharmacy"
          }
        ],
        "recommendations": [
          {
            "stage": "Wait for bed",
            "text": "Predict discharges 48 h ahead and pull patients to the discharge lounge before midday.",
            "saving": "−4.5 h"
          },
          {
            "stage": "Diagnostics",
            "text": "Prioritise ED imaging dynamically by predicted breach time.",
            "saving": "−1.7 h"
          },
          {
            "stage": "Discharge",
            "text": "Prepare take-home medications the day before predicted discharge.",
            "saving": "−4 h"
          }
        ]
      },
      "twin": {
        "title": "Hospital operations",
        "zones": [
          {
            "name": "Emergency",
            "assets": [
              {
                "id": "ED-MAJ",
                "status": "risk",
                "kpi": 38,
                "unit": "patients",
                "alert": "11 waiting over 4 h"
              },
              {
                "id": "ED-RESUS",
                "status": "warn",
                "kpi": 5,
                "unit": "/6 bays"
              },
              {
                "id": "ED-MINORS",
                "status": "ok",
                "kpi": 14,
                "unit": "patients"
              }
            ]
          },
          {
            "name": "Wards",
            "assets": [
              {
                "id": "WARD-7",
                "status": "risk",
                "kpi": 100,
                "unit": "% occ",
                "alert": "9 delayed discharges"
              },
              {
                "id": "WARD-9",
                "status": "warn",
                "kpi": 97,
                "unit": "% occ"
              },
              {
                "id": "AMU",
                "status": "warn",
                "kpi": 95,
                "unit": "% occ"
              }
            ]
          },
          {
            "name": "Resources",
            "assets": [
              {
                "id": "CT-1",
                "status": "warn",
                "kpi": 3.2,
                "unit": "h TAT",
                "alert": "CT-2 down"
              },
              {
                "id": "NURSES",
                "status": "risk",
                "kpi": -9,
                "unit": "RN gap",
                "alert": "Saturday night gap"
              },
              {
                "id": "THEATRES",
                "status": "ok",
                "kpi": 82,
                "unit": "% util"
              }
            ]
          }
        ]
      },
      "alerts": [
        {
          "sev": "high",
          "title": "Weekend ED surge risk",
          "detail": "59% · $172K exposed"
        },
        {
          "sev": "high",
          "title": "12 patients at deterioration risk",
          "detail": "Early-warning score rising"
        },
        {
          "sev": "med",
          "title": "Saturday night RN gap",
          "detail": "9 nurses short"
        },
        {
          "sev": "low",
          "title": "Agency invoice anomaly",
          "detail": "+32% vs framework rate"
        }
      ],
      "knowledge": [
        {
          "id": "H-SOP-1",
          "title": "SOP: Surge and escalation (OPEL)",
          "source": "Operations policy",
          "text": "At escalation level 3, the site opens the discharge lounge, runs board rounds before 10:00 and may book agency staff above framework rates with executive approval."
        },
        {
          "id": "H-POL-6",
          "title": "Policy: Safe staffing",
          "source": "Nursing directorate",
          "text": "Ward staffing is set by acuity. Gaps above 10% must be escalated to the chief nurse. Agency spend above $20,000 per weekend needs director approval."
        },
        {
          "id": "H-CLIN-3",
          "title": "Clinical: Early warning and deterioration",
          "source": "Clinical governance",
          "text": "Patients with a rising early-warning score are reviewed by the outreach team within 30 minutes. Model predictions support clinical judgement and never replace it."
        },
        {
          "id": "H-GOV-2",
          "title": "Data protection: Patient data",
          "source": "Information governance",
          "text": "Patient-identifiable data stays inside the hospital network. The assistant sees pseudonymised records scoped to the user's role and care relationship."
        }
      ],
      "prompts": [
        "Which services are at risk this month?",
        "Why is patient flow behind target?",
        "Which suppliers have unusual invoices?",
        "What if patient demand increases 15%?"
      ]
    },
    {
      "id": "retail",
      "name": "Retail",
      "icon": "🛍️",
      "sector": "Retail",
      "currency": {
        "symbol": "$",
        "code": "USD"
      },
      "systems": [
        {
          "name": "SAP / Oracle Retail",
          "type": "ERP",
          "provides": "Merchandise, purchasing, finance"
        },
        {
          "name": "POS",
          "type": "Sales",
          "provides": "Store sales by SKU and hour"
        },
        {
          "name": "WMS",
          "type": "WMS",
          "provides": "DC picking, stock, dispatch"
        },
        {
          "name": "E-commerce",
          "type": "Digital",
          "provides": "Online orders, traffic"
        },
        {
          "name": "CRM / Loyalty",
          "type": "CRM",
          "provides": "Customer segments, churn"
        }
      ],
      "terms": {
        "entity": "Campaign",
        "entityPlural": "Campaigns",
        "customer": "Shoppers",
        "asset": "Distribution centre",
        "assetPlural": "DCs",
        "unit": "SKUs",
        "successMetric": "In-stock availability",
        "site": "Network",
        "supplier": "Vendor"
      },
      "kpis": [
        {
          "label": "On-shelf availability",
          "value": "94.2%",
          "delta": "−1.6 pts",
          "bad": true
        },
        {
          "label": "Gross margin",
          "value": "31.4%",
          "delta": "−0.8 pts",
          "bad": true
        },
        {
          "label": "Stock cover",
          "value": "38 days",
          "delta": "+5 days",
          "bad": true
        },
        {
          "label": "Online conversion",
          "value": "3.1%",
          "delta": "+0.2 pts",
          "bad": false
        }
      ],
      "health": {
        "score": 74,
        "parts": [
          [
            "Availability",
            69
          ],
          [
            "Margin",
            72
          ],
          [
            "Inventory",
            64
          ],
          [
            "Customer",
            83
          ],
          [
            "Cost",
            78
          ]
        ]
      },
      "revenue": {
        "label": "Monthly sales",
        "values": [
          42,
          39,
          44,
          46,
          48,
          45,
          47,
          52,
          55,
          49,
          58,
          71
        ]
      },
      "trend": {
        "label": "On-shelf availability %",
        "values": [
          96.3,
          96.1,
          95.9,
          95.8,
          95.5,
          95.3,
          95.1,
          94.9,
          94.8,
          94.6,
          94.4,
          94.2
        ],
        "forecast": [
          93.6,
          92.9,
          92.4,
          91.8
        ],
        "target": 96
      },
      "flagship": {
        "id": "CMP-221",
        "title": "Back-to-school campaign · 140 stores",
        "customer": "Shoppers (140 stores + online)",
        "qty": "1,850 SKUs",
        "value": 2100000,
        "due": "Launch Mon",
        "predicted": "34 stores short",
        "risk": "Promotion stock-outs",
        "metric": "In-stock probability during campaign",
        "base": 62,
        "alert": "Campaign CMP-221 has a 62% chance of staying in stock. $798K of sales is at risk.",
        "drivers": [
          {
            "label": "Vendor delay on the top-20 SKUs",
            "impact": 40,
            "source": "SAP / Oracle Retail",
            "evidence": "The backpack and stationery vendor is 7 days late, covering 38% of campaign sales."
          },
          {
            "label": "DC pick capacity",
            "impact": 30,
            "source": "WMS",
            "evidence": "The central DC is at 104% of pick capacity next week, with a 3-day backlog of store replenishment."
          },
          {
            "label": "Demand uplift above forecast",
            "impact": 30,
            "source": "POS",
            "evidence": "Early-week POS and web traffic are 35% above forecast in the North region."
          }
        ],
        "options": [
          {
            "id": "A",
            "label": "Rebalance stock between stores",
            "uplift": 18,
            "cost": 12000,
            "time": "48 h",
            "owner": "Merchandising",
            "targets": 2
          },
          {
            "id": "B",
            "label": "Expedite the vendor PO (split air/sea)",
            "uplift": 22,
            "cost": 35000,
            "time": "4 days",
            "owner": "Buying",
            "targets": 0
          },
          {
            "id": "C",
            "label": "Add an extra DC night shift",
            "uplift": 12,
            "cost": 16000,
            "time": "Tonight",
            "owner": "DC manager",
            "targets": 1
          }
        ],
        "stress": {
          "label": "Demand uplift above forecast",
          "unit": "%",
          "max": 40,
          "perUnit": 0.03,
          "costPerUnit": 0
        }
      },
      "portfolio": [
        {
          "id": "CMP-221",
          "customer": "Back-to-school (all stores)",
          "value": 2100000,
          "prob": 62,
          "driver": "Vendor delay",
          "due": "Mon"
        },
        {
          "id": "CMP-224",
          "customer": "Autumn fashion (online)",
          "value": 950000,
          "prob": 70,
          "driver": "Size curve gaps",
          "due": "Thu"
        },
        {
          "id": "CMP-219",
          "customer": "Home & garden clearance",
          "value": 410000,
          "prob": 76,
          "driver": "Markdown timing",
          "due": "Now"
        },
        {
          "id": "CMP-227",
          "customer": "Electronics bundle",
          "value": 1300000,
          "prob": 84,
          "driver": "Vendor allocation",
          "due": "Next wk"
        },
        {
          "id": "CMP-215",
          "customer": "Grocery weekly deals",
          "value": 680000,
          "prob": 91,
          "driver": "On track",
          "due": "Weekly"
        },
        {
          "id": "CMP-230",
          "customer": "Loyalty double points",
          "value": 520000,
          "prob": 93,
          "driver": "On track",
          "due": "Oct"
        }
      ],
      "predictions": [
        {
          "area": "Availability",
          "title": "34 stores short on top SKUs",
          "prob": 38,
          "horizon": "Launch week",
          "impact": 798000
        },
        {
          "area": "Demand",
          "title": "North region 35% above forecast",
          "prob": 72,
          "horizon": "2 weeks",
          "impact": 310000
        },
        {
          "area": "Inventory",
          "title": "Overstock in summer lines, markdown needed",
          "prob": 69,
          "horizon": "4 weeks",
          "impact": 240000
        },
        {
          "area": "Customer",
          "title": "High-value loyalty churn signal",
          "prob": 27,
          "horizon": "Quarter",
          "impact": 1500000
        },
        {
          "area": "Fraud",
          "title": "Return-fraud pattern at 3 stores",
          "prob": 61,
          "horizon": "Now",
          "impact": 48000
        },
        {
          "area": "Cost",
          "title": "DC overtime overspend",
          "prob": 57,
          "horizon": "Month-end",
          "impact": 64000
        }
      ],
      "anomalies": [
        {
          "id": "PO-R4410",
          "supplier": "SchoolGear Co.",
          "item": "Backpacks",
          "variance": 12.2,
          "score": 74
        },
        {
          "id": "PO-R4432",
          "supplier": "PaperWorld",
          "item": "Notebooks",
          "variance": 19.8,
          "score": 81
        },
        {
          "id": "INV-R4460",
          "supplier": "Parcel Express",
          "item": "Home delivery",
          "variance": 23.5,
          "score": 77
        }
      ],
      "savings": [
        {
          "area": "Lost sales from stock-outs",
          "value": 2400000,
          "note": "Store-level demand sensing"
        },
        {
          "area": "Markdown optimisation",
          "value": 860000,
          "note": "Earlier, smaller markdowns"
        },
        {
          "area": "Customer retention",
          "value": 640000,
          "note": "Churn-targeted offers"
        },
        {
          "area": "Vendor & carrier anomalies",
          "value": 210000,
          "note": "Price and invoice variance"
        }
      ],
      "workflow": {
        "unit": "days",
        "stages": [
          {
            "stage": "Demand forecast",
            "current": 5,
            "optimised": 2,
            "status": "warn",
            "note": "Weekly, top-down"
          },
          {
            "stage": "Vendor ordering",
            "current": 21,
            "optimised": 14,
            "status": "bottleneck",
            "note": "Vendor delays"
          },
          {
            "stage": "DC receiving",
            "current": 2,
            "optimised": 1.5,
            "status": "ok",
            "note": "ASN-based"
          },
          {
            "stage": "DC picking",
            "current": 3,
            "optimised": 1.5,
            "status": "warn",
            "note": "Pick capacity"
          },
          {
            "stage": "Store replenishment",
            "current": 2,
            "optimised": 1.5,
            "status": "ok",
            "note": "Daily trucks"
          },
          {
            "stage": "Shelf / online",
            "current": 1,
            "optimised": 0.5,
            "status": "ok",
            "note": "Omnichannel"
          }
        ],
        "recommendations": [
          {
            "stage": "Vendor ordering",
            "text": "Score vendors on predicted lateness and split orders across vendors for campaign SKUs.",
            "saving": "−7 days"
          },
          {
            "stage": "Demand forecast",
            "text": "Move to daily store-SKU demand sensing using POS, web and weather data.",
            "saving": "−3 days"
          },
          {
            "stage": "DC picking",
            "text": "Plan labour from predicted pick volumes instead of the last week's actuals.",
            "saving": "−1.5 days"
          }
        ]
      },
      "twin": {
        "title": "Retail network",
        "zones": [
          {
            "name": "Distribution",
            "assets": [
              {
                "id": "DC-CENTRAL",
                "status": "risk",
                "kpi": 104,
                "unit": "% pick cap",
                "alert": "3-day backlog"
              },
              {
                "id": "DC-NORTH",
                "status": "ok",
                "kpi": 81,
                "unit": "% pick cap"
              }
            ]
          },
          {
            "name": "Stores",
            "assets": [
              {
                "id": "NORTH",
                "status": "risk",
                "kpi": 89,
                "unit": "% in-stock",
                "alert": "Demand +35%"
              },
              {
                "id": "SOUTH",
                "status": "ok",
                "kpi": 96,
                "unit": "% in-stock"
              },
              {
                "id": "LONDON",
                "status": "warn",
                "kpi": 93,
                "unit": "% in-stock"
              }
            ]
          },
          {
            "name": "Online",
            "assets": [
              {
                "id": "WEB",
                "status": "ok",
                "kpi": 3.1,
                "unit": "% conv"
              },
              {
                "id": "FULFIL",
                "status": "warn",
                "kpi": 26,
                "unit": "h to ship",
                "alert": "Above 24 h promise"
              }
            ]
          }
        ]
      },
      "alerts": [
        {
          "sev": "high",
          "title": "CMP-221 stock-out risk",
          "detail": "62% in-stock · $798K exposed"
        },
        {
          "sev": "high",
          "title": "Central DC at 104% capacity",
          "detail": "3-day backlog"
        },
        {
          "sev": "med",
          "title": "North demand +35%",
          "detail": "Above forecast"
        },
        {
          "sev": "low",
          "title": "Notebook price anomaly",
          "detail": "+19.8% vs agreed cost"
        }
      ],
      "knowledge": [
        {
          "id": "R-SOP-3",
          "title": "SOP: Inter-store stock transfer",
          "source": "Store operations manual",
          "text": "Stock may be moved between stores in the same region when the source store has more than 3 weeks of cover. Transfers run on the daily replenishment trucks at marginal cost."
        },
        {
          "id": "R-POL-1",
          "title": "Policy: Vendor expediting",
          "source": "Buying handbook",
          "text": "Buyers may expedite vendor POs by air for campaign SKUs when the predicted margin loss is higher than the freight premium. Premiums above $25,000 need a commercial director's approval."
        },
        {
          "id": "R-KPI-2",
          "title": "KPI definitions: availability, cover, GMROI",
          "source": "BI glossary",
          "text": "On-shelf availability is the share of store-SKU hours in stock. Stock cover is stock on hand divided by forecast daily sales. GMROI is gross margin divided by average inventory cost."
        },
        {
          "id": "R-CX-4",
          "title": "Customer promise",
          "source": "Customer charter",
          "text": "Advertised promotional items must be available or offered with a rain-check. Online orders ship within 24 hours."
        }
      ],
      "prompts": [
        "Which campaigns are at risk this month?",
        "Why is availability behind target?",
        "Which vendors have unusual pricing?",
        "What if demand is 25% above forecast?"
      ]
    }
  ]
};
