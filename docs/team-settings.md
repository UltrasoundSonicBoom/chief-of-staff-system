# Team Settings

This file is the human-readable control layer for the chief-of-staff system.

## Orchestrator
- Chief of Staff Agent is the only global prioritizer.
- Domain agents manage local domains but do not redefine system architecture.

## Core operating law
- plan
- execute
- review
- verify
- compound
- repeat

## Shared guardrails
- Dashboard pages are views; master databases are source of truth.
- New Notion structures go through notion-hq-core.
- All significant records require:
  - owner agent
  - canonical slug
  - source system
  - run id
  - last synced timestamp
- User-facing output should be compressed to top 3 priorities where possible.
- Any external write with user-facing consequence should be shown before save/send.

## Domain ownership
- Finance Agent -> Finance HQ, finance ledger, major events, renewals
- Family Operations Agent -> Family HQ, school inbox, commitments, prep items
- Home & Purchasing Agent -> home maintenance, inventory, reorder cycles
- Professional Strategy Agent -> SNUHmate, hospital automation, work projects
- KRTA Strategy Agent -> KRTA HQ, initiatives, committee tracker, email threads
- Venture Studio Agent -> idea promotion, PRDs, experiment pipeline
- Device / Security / Infra Agent -> asset inventory, storage, backup, security signals

## Escalation rules
- Critical risk -> Chief of Staff immediately
- Cross-domain dependency -> Chief of Staff review
- Schema mutation request -> Chief of Staff approval
- Budget/time/security conflict -> Chief of Staff + Finance or Infra review

## Initial implementation order
1. notion-hq-core
2. KRTA email processing + thread linking
3. Finance ingestion and control tower
4. Family/school dashboard system
5. Project and signal automation
