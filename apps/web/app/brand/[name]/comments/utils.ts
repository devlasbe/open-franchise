type ValidateCommentFormParams = {
  password: string;
  content: string;
};

export function validateCommentForm({
  password,
  content,
}: ValidateCommentFormParams): string | null {
  if (!password || password.length < 4) {
    return '비밀번호는 4자 이상이어야 합니다';
  }
  if (!content.trim()) {
    return '내용을 입력해주세요';
  }
  if (content.length > 1000) {
    return '댓글은 1000자 이내로 입력해주세요';
  }
  return null;
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
