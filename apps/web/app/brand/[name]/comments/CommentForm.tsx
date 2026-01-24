'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';
import { validateCommentForm } from './utils';

type CommentFormProps = {
  onSubmit: (data: { nickname: string; password: string; content: string }) => Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
};

export default function CommentForm({
  onSubmit,
  isLoading = false,
  placeholder = '댓글을 입력하세요',
}: CommentFormProps) {
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
      setNickname('');
      setPassword('');
      setContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '댓글 작성에 실패했습니다');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="닉네임 (선택)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
          className="w-32"
          disabled={isLoading}
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          maxLength={20}
          className="w-32"
          disabled={isLoading}
          required
        />
      </div>
      <div className="flex gap-2">
        <textarea
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={1000}
          disabled={isLoading}
          className={cn(
            'flex-1 min-h-[80px] resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          )}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} size="sm">
          {isLoading ? '작성 중...' : '작성'}
        </Button>
      </div>
    </form>
  );
}
