# Domain Context Map

이 문서는 각 에이전트가 어떤 Notion 영역을 읽고 업데이트해야 하는지 설명한다.

## 핵심 규칙
- Chief of Staff는 모든 핵심 HQ 데이터베이스를 읽는다.
- 도메인 에이전트는 자기 도메인 HQ를 먼저 읽고, 그 다음 공유 Projects와 Operating Signals를 읽는다.
- 교차 도메인 의사결정은 반드시 Chief of Staff로 다시 올린다.

## Agent -> 주요 컨텍스트

### Chief of Staff Agent
- Hermes Chief of Staff HQ
- 에이전트 DB
- 역할 및 목표 DB
- 프로젝트 DB
- 운영 시그널 DB

### Finance Agent
- Finance HQ
- 재무 원장
- 재무 대형 이벤트
- 재무 갱신 관리
- 공유 프로젝트 DB
- 공유 운영 시그널 DB

### Family Operations Agent
- Family HQ
- 가족 약속
- 학교·학원 인박스
- 준비물 및 물품
- 공유 프로젝트 DB
- 공유 운영 시그널 DB

### Home & Purchasing Agent
- 현재는 Family/Home 구조를 함께 사용
- 이후 전용 Home HQ DB로 분리 가능
- 공유 프로젝트 DB
- 공유 운영 시그널 DB

### Professional Strategy Agent
- 역할 및 목표 DB
- 프로젝트 DB
- 운영 시그널 DB
- 이후 Professional HQ 분리 가능

### KRTA Strategy Agent
- KRTA Strategy HQ
- KRTA 이니셔티브
- KRTA 위원회 트래커
- KRTA 자료 인박스
- KRTA 이메일 스레드
- 공유 프로젝트 DB
- 공유 운영 시그널 DB

### Venture Studio Agent
- 역할 및 목표 DB
- 프로젝트 DB
- 운영 시그널 DB
- Obsidian 아이디어 소스는 외부 입력으로 사용

### Device / Security / Infra Agent
- 운영 시그널 DB
- 프로젝트 DB
- 이후 전용 Infra HQ / 자산 DB / 백업 DB로 확장

## Squad usage
- daily squad -> executive + finance + family + KRTA
- weekly squad -> all major domains
- core bootstrap -> executive synthesis
