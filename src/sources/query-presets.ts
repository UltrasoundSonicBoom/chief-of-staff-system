export const KRTA_GMAIL_QUERIES = [
  'from:(@krta.or.kr) OR 안다경 OR 김현희 OR "에스에이소프트" OR "디지털영상학회"',
  'subject:(정보관리 OR 정보통계 OR 홈페이지 OR 위원회 OR 상임이사회 OR AI) newer_than:30d',
  'has:attachment (KRTA OR 방사선사협회 OR 정보통계) newer_than:60d',
]

export const FINANCE_GMAIL_QUERIES = [
  'subject:(명세서 OR 결제 OR 승인 OR 자동납부 OR 카드 OR 대출 OR 청구) newer_than:14d',
  'from:(coupang OR naver OR toss OR card OR bank) newer_than:14d',
  'label:inbox (Tesla OR 분양 OR 계약금 OR 대출 OR 잔금) newer_than:60d',
]

export const FAMILY_GMAIL_QUERIES = [
  'subject:(가정통신문 OR 준비물 OR 수행평가 OR 시험 OR 급식 OR 학원) newer_than:30d',
  'from:(school OR academy) newer_than:30d',
  '채린 OR 다산새봄중학교 newer_than:30d',
]

export function summarizeMessage(message: Record<string, unknown>) {
  return {
    id: String(message.id ?? ''),
    threadId: String(message.threadId ?? ''),
    from: String(message.from ?? ''),
    subject: String(message.subject ?? ''),
    date: String(message.date ?? ''),
    snippet: String(message.snippet ?? ''),
  }
}
