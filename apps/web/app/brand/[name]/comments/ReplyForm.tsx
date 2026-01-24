'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';
import { validateCommentForm } from './utils';

type ReplyFormProps = {
  onSubmit: (data: { nickname: string; password: string; content: string }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
};

export default function ReplyForm({ onSubmit, onCancel, isLoading = false }: ReplyFormProps) {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateCommentForm({ password, content });
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await onSubmit({ nickname, password, content });
    } catch (err) {
      setError(err instanceof Error ? err.message : '답글 작성에 실패했습니다');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2 pl-4 border-l-2 border-muted">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="닉네임 (선택)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
          className="w-28 h-8 text-sm"
          disabled={isLoading}
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          maxLength={20}
          className="w-28 h-8 text-sm"
          disabled={isLoading}
          required
        />
      </div>
      <textarea
        placeholder="답글을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={1000}
        disabled={isLoading}
        className={cn(
          'min-h-[60px] resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        )}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={isLoading}>
          취소
        </Button>
        <Button type="submit" size="sm" disabled={isLoading}>
          {isLoading ? '작성 중...' : '답글'}
        </Button>
      </div>
    </form>
  );
}
