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
    titleProperty: '이름',
    title: 'KRTA 이메일 인제스트 부트스트랩',
    slug: 'krta-email-ingest-bootstrap',
    slugPropertyName: '표준 슬러그',
    domain: 'KRTA',
    ownerAgent: 'KRTA Strategy Agent',
    sourceSystem: 'Hermes',
    runId: 'krta-email-ingest-runtime',
    extraProperties: {
      '스레드 ID': { rich_text: [{ text: { content: 'bootstrap-thread' } }] },
      상대방: { select: { name: '기타' } },
      상태: { status: { name: 'Not started' } },
      '이메일 상태': { select: { name: '진행중' } },
      방향: { select: { name: 'Inbound' } },
      '최근 메일 일시': { date: { start: new Date().toISOString().slice(0, 10) } },
      '프로젝트 연결': { rich_text: [{ text: { content: 'KRTA 정보통계 홈페이지 구축' } }] },
      '액션 요약': { rich_text: [{ text: { content: '이메일 스레드 dedupe 및 후속 액션 추출 루프 시작' } }] },
      'Gmail 링크': { url: 'https://mail.google.com/' },
      비고: { rich_text: [{ text: { content: 'autonomous bootstrap' } }] },
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
