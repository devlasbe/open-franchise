---
name: agents
description: 에이전트를 효과적으로 사용하는 규칙
---

# 에이전트 오케스트레이션

에이전트를 효과적으로 사용하는 규칙입니다.

## 사용 가능한 에이전트

~/.claude/agents/에 위치:

| 에이전트 | 목적 | 사용 시점 |
|----------|------|-----------|
| planner | 구현 계획 | 복잡한 기능, 리팩토링 |
| architect | 시스템 설계 | 아키텍처 결정 |
| tdd-guide | 테스트 주도 개발 | 새 기능, 버그 수정 |
| code-reviewer | 코드 리뷰 | 코드 작성 후 |
| security-reviewer | 보안 분석 | 커밋 전 |
| build-error-resolver | 빌드 오류 수정 | 빌드 실패 시 |
| e2e-runner | E2E 테스트 | 중요 사용자 흐름 |
| refactor-cleaner | 불필요한 코드 정리 | 코드 유지보수 |
| doc-updater | 문서화 | 문서 업데이트 |

## 즉시 에이전트 사용

사용자 프롬프트 없이도 다음 상황에서 에이전트를 사용하세요:

| 상황 | 사용할 에이전트 |
|------|----------------|
| 복잡한 기능 요청 | planner |
| 코드 작성/수정 완료 | code-reviewer |
| 버그 수정 또는 새 기능 | tdd-guide |
| 아키텍처 결정 | architect |

## 병렬 작업 실행

독립적인 작업에는 **항상 병렬 Task 실행** 사용!

## 에이전트 사용 우선순위

```
1. planner       → 무엇을 할지 계획
2. architect     → 어떻게 할지 설계
3. tdd-guide     → 테스트와 함께 구현
4. code-reviewer → 품질 검토
5. security-reviewer → 보안 검토
```
