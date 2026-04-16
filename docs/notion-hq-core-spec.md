# notion-hq-core Spec

Purpose:
- central capability layer for safe, repeatable Notion operations by persona-based agents

Principles:
- Agents own content, not architecture
- Dashboard is view, master DB is source
- Idempotent by default
- Required metadata on every object
- Master schema changes require Chief of Staff review

Core capabilities:
- discovery
- create page from template
- create database from template
- upsert records
- registry updates
- relation integrity
- audit trail

MVP:
- Page Registry
- Database Registry
- Agents
- Roles & Goals
- Projects
- Operating Signals
