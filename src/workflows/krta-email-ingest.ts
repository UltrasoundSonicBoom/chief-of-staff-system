import { getAgentContextTargets } from '../config/load-notion-hq-map.js'
import { findPageInRegistryBySlug, searchExistingNotionObjects, upsertBasicRecord } from '../notion/notion-hq-core.js'

export async function runKrtaEmailIngest() {
  const contextTargets = getAgentContextTargets('KRTA Strategy Agent')

  const threadRegistryCheck = await findPageInRegistryBySlug('krta-thread-homepage-office')
  const notionSearch = await searchExistingNotionObjects('KRTA Email Threads')

  return {
    workflow: 'krta-email-ingest',
    contextTargets,
    checks: {
      threadRegistryHits: Array.isArray(threadRegistryCheck.results) ? threadRegistryCheck.results.length : 0,
      notionSearchCount: Array.isArray(notionSearch.results) ? notionSearch.results.length : 0,
    },
    nextSteps: [
      'Read KRTA Email Threads and dedupe by thread before creating work items',
      'Map email-derived work to KRTA Initiatives / Committee Tracker / Operating Signals',
      'Promote deadlines, blockers, and decisions to Operating Signals',
    ],
  }
}

export async function seedKrtaThreadSignal(dataSourceId: string) {
  return upsertBasicRecord({
    dataSourceId,
    titleProperty: 'Name',
    title: 'KRTA email ingest bootstrap',
    slug: 'krta-email-ingest-bootstrap',
    domain: 'KRTA',
    ownerAgent: 'KRTA Strategy Agent',
    sourceSystem: 'Hermes',
    runId: 'bootstrap-krta-email-ingest',
    extraProperties: {
      Summary: { rich_text: [{ text: { content: 'Bootstrap record for KRTA email thread ingestion' } }] },
    },
  })
}
