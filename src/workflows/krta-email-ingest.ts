import { getAgentContextTargets } from '../config/load-notion-hq-map.js'
import { loadNotionHqMap } from '../config/load-notion-hq-map.js'
import { ensureSignal, findPageInRegistryBySlug, searchExistingNotionObjects, upsertBasicRecord } from '../notion/notion-hq-core.js'

export async function runKrtaEmailIngest() {
  const contextTargets = getAgentContextTargets('KRTA Strategy Agent')
  const map = loadNotionHqMap()
  const threadDataSourceId = (map.domains.krta as { databases: { email_threads: { data_source_id: string } } }).databases.email_threads.data_source_id
  const signalDataSourceId = (map.hq.operating_signals as { data_source_id: string }).data_source_id

  const threadRegistryCheck = await findPageInRegistryBySlug('krta-thread-homepage-office')
  const notionSearch = await searchExistingNotionObjects('KRTA Email Threads')
  const bootstrapThread = await upsertBasicRecord({
    dataSourceId: threadDataSourceId,
    titleProperty: 'Name',
    title: 'KRTA email ingest bootstrap',
    slug: 'krta-email-ingest-bootstrap',
    domain: 'KRTA',
    ownerAgent: 'KRTA Strategy Agent',
    sourceSystem: 'Hermes',
    runId: 'krta-email-ingest-runtime',
    extraProperties: {
      'Thread ID': { rich_text: [{ text: { content: 'bootstrap-thread' } }] },
      Counterparty: { select: { name: '기타' } },
      Status: { status: { name: 'Not started' } },
      'Email State': { select: { name: '진행중' } },
      Direction: { select: { name: 'Inbound' } },
      'Last Email Date': { date: { start: new Date().toISOString().slice(0, 10) } },
      'Project Link': { rich_text: [{ text: { content: 'KRTA 정보통계 홈페이지 구축' } }] },
      'Action Summary': { rich_text: [{ text: { content: '이메일 스레드 dedupe 및 후속 액션 추출 루프 시작' } }] },
      'Gmail Link': { url: 'https://mail.google.com/' },
      Notes: { rich_text: [{ text: { content: 'autonomous bootstrap' } }] },
    },
  })

  const signal = await ensureSignal({
    dataSourceId: signalDataSourceId,
    title: 'KRTA 이메일 스레드 점검 루프 활성',
    slug: 'krta-email-ingest-active',
    domain: 'Professional',
    ownerAgent: 'KRTA Strategy Agent',
    summary: 'KRTA Email Threads를 기준으로 스레드 dedupe, 프로젝트/태스크/일정/문서 파생 루프를 활성화했다.',
    severity: 'High',
    signalType: 'Review',
    reviewBy: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
    escalationNeeded: false,
    runId: 'krta-email-ingest-runtime',
  })

  return {
    workflow: 'krta-email-ingest',
    contextTargets,
    checks: {
      threadRegistryHits: Array.isArray(threadRegistryCheck.results) ? threadRegistryCheck.results.length : 0,
      notionSearchCount: Array.isArray(notionSearch.results) ? notionSearch.results.length : 0,
    },
    writes: {
      bootstrapThreadMode: bootstrapThread.mode,
      signalMode: signal.mode,
    },
    nextSteps: [
      'Read KRTA Email Threads and dedupe by thread before creating work items',
      'Map email-derived work to KRTA Initiatives / Committee Tracker / Operating Signals',
      'Promote deadlines, blockers, and decisions to Operating Signals',
    ],
  }
}
