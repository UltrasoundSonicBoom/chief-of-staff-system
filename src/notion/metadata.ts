export const REQUIRED_METADATA = [
  'canonical_slug',
  'domain',
  'owner_agent',
  'created_by_agent',
  'last_updated_by_agent',
  'source_system',
  'run_id',
  'lifecycle_status',
  'last_synced_at',
] as const

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s_-]+/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function buildMetadata(agentName: string, domain: string, sourceSystem: string, runId: string, lifecycleStatus = 'active') {
  const now = new Date().toISOString()
  return {
    domain,
    owner_agent: agentName,
    created_by_agent: agentName,
    last_updated_by_agent: agentName,
    source_system: sourceSystem,
    run_id: runId,
    lifecycle_status: lifecycleStatus,
    last_synced_at: now,
  }
}

export function validateMetadata(metadata: Record<string, unknown>) {
  return REQUIRED_METADATA.filter((key) => metadata[key] === undefined || metadata[key] === null || metadata[key] === '')
}
