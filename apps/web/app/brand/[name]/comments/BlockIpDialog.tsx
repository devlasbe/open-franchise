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

type BlockIpDialogProps = {
  commentId: string;
  onBlock: (commentId: string, reason?: string) => Promise<void>;
  isLoading?: boolean;
};

export default function BlockIpDialog({
  commentId,
  onBlock,
  isLoading = false,
}: BlockIpDialogProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [blocking, setBlocking] = useState(false);

  const handleBlock = async () => {
    setError(null);
    setBlocking(true);

    try {
      await onBlock(commentId, reason || undefined);
      setOpen(false);
      setReason('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'IP 차단에 실패했습니다');
    } finally {
      setBlocking(false);
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
          IP 차단
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>IP 차단</AlertDialogTitle>
          <AlertDialogDescription>
            이 댓글 작성자의 IP를 차단합니다. 차단된 IP는 더 이상 댓글을 작성할 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Input
            type="text"
            placeholder="차단 사유 (선택)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isLoading || blocking}
          />
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading || blocking}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleBlock();
            }}
            disabled={isLoading || blocking}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {blocking ? '차단 중...' : '차단'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
