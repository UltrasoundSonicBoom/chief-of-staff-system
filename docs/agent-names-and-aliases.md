# Agent Names & Aliases

이 시스템은 각 에이전트에 대해
- 대표 호출명: 의인화된 한국어 이름
- 표시 별칭: 이름(도메인)
- 보조 별칭: 영어/기능 이름
을 함께 사용한다.

## 공식 이름표

1. 도담 (Chief)
- 표시: 도담(Chief)
- 역할: Chief of Staff / 전체 총괄 비서
- 허용 호출:
  - 도담
  - Chief
  - Chief of Staff

2. 금결 (Finance)
- 표시: 금결(Finance)
- 역할: 재무 담당
- 허용 호출:
  - 금결
  - Finance
  - Cash

3. 채움 (Family)
- 표시: 채움(Family)
- 역할: 가족 운영 담당
- 허용 호출:
  - 채움
  - Family

4. 살림 (Home)
- 표시: 살림(Home)
- 역할: 집안일/구매 담당
- 허용 호출:
  - 살림
  - Home
  - Purchasing

5. 진두 (Pro)
- 표시: 진두(Pro)
- 역할: 직장/프로 전략 담당
- 허용 호출:
  - 진두
  - Pro
  - Professional

6. 한결 (KRTA)
- 표시: 한결(KRTA)
- 역할: KRTA 전략 담당
- 허용 호출:
  - 한결
  - KRTA

7. 새김 (Venture)
- 표시: 새김(Venture)
- 역할: 아이디어/벤처 스튜디오 담당
- 허용 호출:
  - 새김
  - Venture
  - Studio

8. 보루 (Infra)
- 표시: 보루(Infra)
- 역할: 기기/보안/인프라 담당
- 허용 호출:
  - 보루
  - Infra
  - Security

## 호출 규칙
- 사용자에게는 한국어 이름을 기본으로 보여준다.
- 화면 표시에는 `이름(도메인)` 형식을 사용한다.
- 사용자가 한국어 이름 또는 보조 별칭 어느 쪽으로 불러도 같은 에이전트로 해석한다.
- 예:
  - "도담, 오늘 우선순위 정리해"
  - "Chief, 오늘 우선순위 정리해"
  - 둘 다 Chief of Staff Agent로 라우팅
