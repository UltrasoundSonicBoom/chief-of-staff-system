# AGENTS.md

This repository defines a personal chief-of-staff multi-agent system.

Rules:
- Agents do not invent new Notion schemas without going through notion-hq-core.
- Dashboard pages are views; master databases are the source of truth.
- All records must be attributable to an owner agent and canonical slug.
- Work proceeds by: plan -> execute -> review -> verify -> compound -> repeat.
- Chief of Staff reads across all domains and handles escalation.

Core agents:
- Chief of Staff Agent
- Finance Agent
- Family Operations Agent
- Home & Purchasing Agent
- Professional Strategy Agent
- KRTA Strategy Agent
- Venture Studio Agent
- Device / Security / Infra Agent

Initial implementation goals:
1. Bootstrap Notion HQ core databases and registries
2. Define shared capability layer (notion-hq-core)
3. Seed team roster, roles/goals, and operating signals
4. Add domain-specific workflows incrementally
