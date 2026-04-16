---
name: notion-hq-core
description: Central capability layer for safe Notion HQ operations by persona-based agents.
trigger: Any agent wants to create/update Notion pages, databases, records, or relations.
---

# notion-hq-core

Mission:
- let agents update Notion HQ safely without breaking information architecture

Rules:
1. Agents own content, not architecture
2. Dashboard is view, master DB is source
3. Prefer find-or-create and upsert over blind create
4. Every object needs canonical metadata
5. Schema mutation requires Chief of Staff review

Required inputs:
- agent_name
- domain
- intent
- object_type
- target_parent
- canonical_slug
- title
- template_name
- source_system
- run_id
- payload

Core capabilities:
- discovery
- page/database creation via template
- record upsert
- registry updates
- relation validation
- audit logging

MVP objects:
- Page Registry
- Database Registry
- Agents
- Roles & Goals
- Projects
- Operating Signals
