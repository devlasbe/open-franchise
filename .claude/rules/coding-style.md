---
name: coding-style
description: 일관된 코드 품질을 위한 코딩 스타일 규칙
---

# 코딩 스타일

일관된 코드 품질을 위한 코딩 스타일 규칙입니다.

## 불변성 (중요)

항상 새 객체 생성, 절대 변경하지 않음!

```javascript
// 잘못된 방법: 변경
function updateUser(user, name) {
  user.name = name  // 변경!
  return user
}

// 올바른 방법: 불변성
function updateUser(user, name) {
  return { ...user, name }
}
```

### 배열 불변성

```javascript
// 잘못된 방법
array.push(item)
array.sort()

// 올바른 방법
const newArray = [...array, item]
const sortedArray = [...array].sort()
```

## 파일 구성

적은 대형 파일보다 **많은 작은 파일**:

| 권장 | 설명 |
|------|------|
| 200-400줄 | 일반적인 파일 크기 |
| 최대 800줄 | 파일 크기 상한 |
| 기능/도메인별 | 타입별이 아닌 기능별 구성 |

## 오류 처리

항상 포괄적인 오류 처리:

```typescript
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  console.error('작업 실패:', error)
  throw new Error('상세한 사용자 친화적 메시지')
}
```

## 함수 크기

함수는 50줄 미만으로 작성:

```typescript
// 좋음: 작은 함수로 분리
function processData(data) {
  const validated = validateData(data)
  const transformed = transformData(validated)
  return saveData(transformed)
}
```

## 중첩 제한

4레벨 이상의 중첩은 피하고, 얼리 리턴 사용:

```typescript
// 좋음: 얼리 리턴
if (!a) return
if (!b) return
if (!c) return
// 메인 로직
```

## 코드 품질 체크리스트

- [ ] 코드가 읽기 쉽고 이름이 명확함
- [ ] 함수가 작음 (50줄 미만)
- [ ] 파일이 집중됨 (800줄 미만)
- [ ] 깊은 중첩 없음 (4레벨 이하)
- [ ] 적절한 오류 처리
- [ ] console.log 문 없음
- [ ] 하드코딩된 값 없음
- [ ] 변경 없음 (불변 패턴 사용)
