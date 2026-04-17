import { runKrtaEmailIngest } from './krta-email-ingest.js'
import { runFinanceIngest } from './finance-ingest.js'
import { runFamilyIngest } from './family-ingest.js'

function buildTop3(krta: Awaited<ReturnType<typeof runKrtaEmailIngest>>, finance: Awaited<ReturnType<typeof runFinanceIngest>>, family: Awaited<ReturnType<typeof runFamilyIngest>>) {
  return [
    `재무: 메일 ${finance.checks.gmailMessageCount}건 후보 / 주요 이벤트 점검 유지`,
    `가족: 메일 ${family.checks.gmailMessageCount}건 후보 / 준비물 점검 유지`,
    `KRTA: 메일 ${krta.checks.gmailMessageCount}건 후보 / 스레드 dedupe 루프 유지`,
  ]
}

export async function buildChiefOfStaffBrief() {
  const [krta, finance, family] = await Promise.all([
    runKrtaEmailIngest(),
    runFinanceIngest(),
    runFamilyIngest(),
  ])

  const top3 = buildTop3(krta, finance, family)
  const criticalRisk = finance.checks.gmailMessageCount > 0
    ? '재무 관련 메일/이벤트를 빠르게 분류해 현금흐름 위험을 놓치지 않도록 해야 함'
    : '현재 가장 큰 구조적 위험은 5월 대형 재무 이벤트와 저장공간/운영 과부하'

  return {
    제목: 'Chief of Staff 통합 브리프',
    오늘의_Top3: top3,
    핵심위험: criticalRisk,
    미뤄도되는것: '새 아이디어 확장보다는 기존 시스템 연결 작업을 우선',
    한줄팁: '오늘은 새로운 일을 벌이기보다, 이미 열린 루프 1개만 닫아도 충분하다.',
    세부: {
      재무: finance,
      가족: family,
      KRTA: krta,
    },
  }
}
