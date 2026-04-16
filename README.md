# Chief of Staff System

Personal multi-agent chief-of-staff operating system for Jayce.

Purpose:
- orchestrate family, finance, KRTA, professional, home, and infra operations
- maintain a central Notion HQ
- let domain agents manage their own workspaces through shared rules
- generate briefings, signals, and project updates

Core stack:
- Hermes Agent
- Codex / Claude-style agent teams
- Notion HQ
- Obsidian
- Things3
- Google Calendar
- Apple Reminders

Initial focus:
1. notion-hq-core
2. Chief of Staff orchestration
3. Finance Agent
4. KRTA Strategy Agent
5. Family Operations Agent

Installed local references:
- oh-my-codex (global install + workspace setup)
- CCteam-creator skill (installed into ~/.claude/skills/CCteam-creator)
- homeassistant-claude-kit (local venv via make setup)
- @jackchen_me/open-multi-agent (workspace dependency)

Runtime scaffold:
- `src/index.ts` boots a minimal chief-of-staff team via open-multi-agent
- `src/config/` loads team and agent configs
- `src/orchestration/` builds the initial team
- `config/agents/*.json` defines persona-aware agent settings

Useful commands:
- `npm install`
- `npm run build`
- `npm run bootstrap`
- `npm run bootstrap -- daily`
- `npm run bootstrap -- weekly`
- `omx doctor`

See:
- docs/notion-hq-core-spec.md
- docs/team-roster.md
- docs/team-settings.md
- docs/team-operating-playbook.md
- docs/startup-playbooks.md
- docs/domain-context-map.md
- docs/agent-personas.md
- docs/orchestration.md
