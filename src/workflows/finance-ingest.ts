import { getAgentContextTargets } from '../config/load-notion-hq-map.js'
import { loadNotionHqMap } from '../config/load-notion-hq-map.js'
import { ensureSignal, searchExistingNotionObjects, upsertBasicRecord } from '../notion/notion-hq-core.js'

export async function runFinanceIngest() {
  const contextTargets = getAgentContextTargets('Finance Agent')
  const map = loadNotionHqMap()
  const finance = map.domains.finance as { databases: { ledger: { data_source_id: string }, major_events: { data_source_id: string } } }
  const signalDataSourceId = (map.hq.operating_signals as { data_source_id: string }).data_source_id
  const notionSearch = await searchExistingNotionObjects('Finance HQ')

  const ledgerRecord = await upsertBasicRecord({
    dataSourceId: finance.databases.ledger.data_source_id,
    titleProperty: 'Name',
    title: 'Finance ingest heartbeat',
    slug: 'finance-ingest-heartbeat',
    domain: 'Finance',
    ownerAgent: 'Finance Agent',
    sourceSystem: 'Hermes',
    runId: 'finance-ingest-runtime',
    extraProperties: {
      Type: { select: { name: 'Expense' } },
      Category: { select: { name: 'Debt Service' } },
      Amount: { number: 0 },
      'Transaction Date': { date: { start: new Date().toISOString().slice(0, 10) } },
      Source: { select: { name: 'Manual' } },
      Status: { status: { name: 'Not started' } },
      'Owner Agent': { rich_text: [{ text: { content: 'Finance Agent' } }] },
      Notes: { rich_text: [{ text: { content: 'autonomous finance ingest heartbeat' } }] },
    },
  })

  const majorEvent = await upsertBasicRecord({
    dataSourceId: finance.databases.major_events.data_source_id,
    titleProperty: 'Name',
    title: '5월 대형 재무 이벤트 재점검',
    slug: 'finance-major-events-review',
    domain: 'Finance',
    ownerAgent: 'Finance Agent',
    sourceSystem: 'Hermes',
    runId: 'finance-ingest-runtime',
    extraProperties: {
      'Event Type': { select: { name: 'Debt' } },
      Status: { status: { name: 'Not started' } },
      'Expected Amount': { number: 0 },
      'Event Date': { date: { start: '2026-05-01' } },
      'Owner Agent': { rich_text: [{ text: { content: 'Finance Agent' } }] },
      'Risk Level': { select: { name: 'Critical' } },
      'Next Action': { rich_text: [{ text: { content: 'Tesla/분양/부채 흐름을 하나의 자금 계획으로 재정리' } }] },
      Notes: { rich_text: [{ text: { content: 'autonomous finance review' } }] },
    },
  })

  const signal = await ensureSignal({
    dataSourceId: signalDataSourceId,
    title: '재무 점검 루프 활성',
    slug: 'finance-ingest-active',
    domain: 'Finance',
    ownerAgent: 'Finance Agent',
    summary: 'Finance HQ 기반 부채/대형 이벤트/renewal 점검 루프를 활성화했다.',
    severity: 'Critical',
    signalType: 'Review',
    reviewBy: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
    escalationNeeded: true,
    runId: 'finance-ingest-runtime',
  })

  return {
    workflow: 'finance-ingest',
    contextTargets,
    checks: {
      notionSearchCount: Array.isArray(notionSearch.results) ? notionSearch.results.length : 0,
    },
    writes: {
      ledgerRecordMode: ledgerRecord.mode,
      majorEventMode: majorEvent.mode,
      signalMode: signal.mode,
    },
    nextSteps: [
      'Read Finance Ledger / Major Events / Renewals',
      'Classify incoming statement/order/billing events into debt, living, housing, car, education, or investment categories',
      'Promote large commitments and abnormal cashflow changes to Operating Signals',
    ],
  }
}
