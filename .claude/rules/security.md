---
name: security
description: 모든 코드에 적용되는 필수 보안 규칙
---

# 보안

모든 코드에 적용되는 필수 보안 규칙입니다.

## 필수 보안 검사

모든 커밋 전:

- [ ] 하드코딩된 시크릿 없음 (API 키, 비밀번호, 토큰)
- [ ] 모든 사용자 입력 검증됨
- [ ] SQL 인젝션 방지 (파라미터화된 쿼리)
- [ ] XSS 방지 (HTML 새니타이즈)
- [ ] CSRF 보호 활성화
- [ ] 인증/인가 검증됨
- [ ] 모든 엔드포인트에 레이트 리미팅
- [ ] 오류 메시지가 민감한 데이터 노출하지 않음

## 시크릿 관리

```typescript
// 절대 금지: 하드코딩된 시크릿
const apiKey = "sk-proj-xxxxx"

// 항상: 환경 변수
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('OPENAI_API_KEY가 설정되지 않았습니다')
}
```

## SQL 인젝션 방지

```typescript
// 위험: 문자열 연결
const query = `SELECT * FROM users WHERE id = ${userId}`

// 안전: 파라미터화된 쿼리
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
```

## XSS 방지

```typescript
// 위험: innerHTML 직접 사용
element.innerHTML = userInput

// 안전: textContent 사용
element.textContent = userInput

// 안전: 라이브러리로 새니타이즈
import DOMPurify from 'dompurify'
element.innerHTML = DOMPurify.sanitize(userInput)
```

## 보안 등급

| 등급 | 설명 | 조치 |
|------|------|------|
| 치명적 | 시크릿 노출, 인젝션 | 즉시 수정 필수 |
| 높음 | 인증 우회, XSS | 커밋 전 수정 |
| 중간 | 레이트 리미팅 누락 | 가능한 빨리 수정 |
| 낮음 | 정보 노출 가능성 | 검토 후 수정 |

**보안은 선택 사항이 아닙니다.**
