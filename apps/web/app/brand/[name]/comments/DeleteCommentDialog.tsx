'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type DeleteCommentDialogProps = {
  onDelete: (password: string) => Promise<void>;
  isLoading?: boolean;
  isAdmin?: boolean;
};

export default function DeleteCommentDialog({
  onDelete,
  isLoading = false,
  isAdmin = false,
}: DeleteCommentDialogProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setError(null);

    if (!isAdmin && !password) {
      setError('비밀번호를 입력해주세요');
      return;
    }

    try {
      await onDelete(password);
      setOpen(false);
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '삭제에 실패했습니다');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-destructive"
        >
          삭제
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>댓글 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            {isAdmin ? '정말 삭제하시겠습니까?' : '댓글을 삭제하려면 비밀번호를 입력하세요.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {!isAdmin && (
          <div className="py-4">
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          </div>
        )}
        {isAdmin && error && <p className="py-2 text-sm text-destructive">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? '삭제 중...' : '삭제'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
