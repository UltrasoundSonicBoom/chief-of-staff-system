# Autonomous Operation Plan

This system is intended to run without waiting for the user on every cycle.

## Parallel recurring agents
- Chief of Staff morning brief
- Finance sweep
- Family preparation sweep
- KRTA email / initiative sweep
- Weekly rebalance

## Autonomy rules
- Agents should update their own Notion areas first.
- Escalate only when a meaningful cross-domain conflict or critical risk appears.
- Preserve canonical slugs and registry discipline.
- Summaries should stay short and actionable.

## Current implementation state
- Runtime scaffold exists in `src/`
- Notion HQ helpers exist in `src/notion/`
- Domain HQ pages and seed DBs exist in Notion
- Cron jobs keep the team operating without manual prompting:
  - chief-of-staff-morning-brief
  - finance-agent-sweep
  - family-operations-sweep
  - krta-strategy-email-sweep
