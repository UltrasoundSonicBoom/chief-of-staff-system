import { getAgentContextTargets } from '../config/load-notion-hq-map.js'
import { loadNotionHqMap } from '../config/load-notion-hq-map.js'
import { ensureSignal, searchExistingNotionObjects, upsertBasicRecord } from '../notion/notion-hq-core.js'

export async function runFamilyIngest() {
  const contextTargets = getAgentContextTargets('Family Operations Agent')
  const map = loadNotionHqMap()
  const family = map.domains.family as { databases: { commitments: { data_source_id: string }, school_inbox: { data_source_id: string }, prep_supplies: { data_source_id: string } } }
  const signalDataSourceId = (map.hq.operating_signals as { data_source_id: string }).data_source_id
  const notionSearch = await searchExistingNotionObjects('Family HQ')

  const schoolInbox = await upsertBasicRecord({
    dataSourceId: family.databases.school_inbox.data_source_id,
    titleProperty: 'Name',
    title: 'Family ingest heartbeat',
    slug: 'family-ingest-heartbeat',
    domain: 'Family',
    ownerAgent: 'Family Operations Agent',
    sourceSystem: 'Hermes',
    runId: 'family-ingest-runtime',
    extraProperties: {
      'Source Type': { select: { name: 'Notice' } },
      Person: { select: { name: '채린' } },
      Imported: { checkbox: false },
      Date: { date: { start: new Date().toISOString().slice(0, 10) } },
      Summary: { rich_text: [{ text: { content: 'school/academy/prep ingestion loop active' } }] },
      'Source URL': { url: null },
    },
  })

  const prepItem = await upsertBasicRecord({
    dataSourceId: family.databases.prep_supplies.data_source_id,
    titleProperty: 'Name',
    title: '이번 주 준비물 점검',
    slug: 'family-weekly-prep-check',
    domain: 'Family',
    ownerAgent: 'Family Operations Agent',
    sourceSystem: 'Hermes',
    runId: 'family-ingest-runtime',
    extraProperties: {
      Person: { select: { name: '채린' } },
      'Item Type': { select: { name: 'Preparation' } },
      Status: { status: { name: 'Not started' } },
      'Needed By': { date: { start: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10) } },
      'Owner Agent': { rich_text: [{ text: { content: 'Family Operations Agent' } }] },
      'Next Action': { rich_text: [{ text: { content: '학교/학원 관련 준비물과 숙제 누락 여부 점검' } }] },
      Notes: { rich_text: [{ text: { content: 'autonomous family prep review' } }] },
    },
  })

  const signal = await ensureSignal({
    dataSourceId: signalDataSourceId,
    title: '가족 운영 점검 루프 활성',
    slug: 'family-ingest-active',
    domain: 'Family',
    ownerAgent: 'Family Operations Agent',
    summary: '학교/학원/준비물/가족 일정 점검 루프를 활성화했다.',
    severity: 'High',
    signalType: 'Review',
    reviewBy: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
    escalationNeeded: false,
    runId: 'family-ingest-runtime',
  })

  return {
    workflow: 'family-ingest',
    contextTargets,
    checks: {
      notionSearchCount: Array.isArray(notionSearch.results) ? notionSearch.results.length : 0,
    },
    writes: {
      schoolInboxMode: schoolInbox.mode,
      prepItemMode: prepItem.mode,
      signalMode: signal.mode,
    },
    nextSteps: [
      'Read Family Commitments / School & Academy Inbox / Prep & Supplies',
      'Convert notices into short summaries and prep actions',
      'Promote upcoming deadlines, exams, and missing items to Operating Signals when time-sensitive',
    ],
  }
}
