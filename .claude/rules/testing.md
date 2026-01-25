---
name: testing
description: 테스트 주도 개발과 커버리지 요구사항
---

# 테스트

테스트 주도 개발과 커버리지 요구사항입니다.

## 최소 테스트 커버리지: 80%

모든 새 코드는 **80% 이상**의 테스트 커버리지를 가져야 합니다.

## 테스트 타입 (모두 필수)

| 타입 | 범위 | 예시 |
|------|------|------|
| **단위 테스트** | 개별 함수, 유틸리티, 컴포넌트 | calculatePrice.test.ts |
| **통합 테스트** | API 엔드포인트, 데이터베이스 작업 | api/users.test.ts |
| **E2E 테스트** | 중요 사용자 흐름 (Playwright) | e2e/checkout.spec.ts |

## 테스트 주도 개발 (TDD)

필수 워크플로우:

```
1. 테스트 먼저 작성 (RED)
2. 테스트 실행 - 실패해야 함
3. 최소한의 구현 작성 (GREEN)
4. 테스트 실행 - 통과해야 함
5. 리팩토링 (IMPROVE)
6. 커버리지 확인 (80%+)
```

## TDD 예시

```typescript
// 1단계: 테스트 먼저 작성 (RED)
describe('calculateTotal', () => {
  it('should return sum of prices', () => {
    const items = [{ price: 100 }, { price: 200 }]
    expect(calculateTotal(items)).toBe(300)
  })
})

// 3단계: 최소한의 구현 (GREEN)
function calculateTotal(items: { price: number }[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}
```

## 커버리지 요구사항

```bash
# 커버리지와 함께 테스트 실행
npm test --coverage

# 임계값
- 브랜치: 80%
- 함수: 80%
- 라인: 80%
- 문장: 80%
```

## 100% 커버리지 필수 영역

- 금융 계산
- 인증 로직
- 보안에 중요한 코드
- 핵심 비즈니스 로직
