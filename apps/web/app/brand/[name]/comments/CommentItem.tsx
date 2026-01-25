'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CommentType } from '@/services/comment';
import DeleteCommentDialog from './DeleteCommentDialog';
import BlockIpDialog from './BlockIpDialog';
import ReplyForm from './ReplyForm';
import { cn } from '@/utils/cn';
import { formatRelativeTime } from './utils';
import { useAuth } from '@/hooks/useAuth';

type CommentItemPropsType = {
  comment: CommentType;
  onReply: (
    commentId: string,
    data: { nickname: string; password: string; content: string },
  ) => Promise<void>;
  onDelete: (commentId: string, password: string) => Promise<void>;
  onAdminDelete?: (commentId: string) => Promise<void>;
  onBlockIp?: (commentId: string, reason?: string) => Promise<void>;
  isReply?: boolean;
};

export default function CommentItem({
  comment,
  onReply,
  onDelete,
  onAdminDelete,
  onBlockIp,
  isReply = false,
}: CommentItemPropsType) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin } = useAuth();

  const handleReply = async (data: { nickname: string; password: string; content: string }) => {
    setIsLoading(true);
    try {
      await onReply(comment.id, data);
      setShowReplyForm(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (password: string) => {
    setIsLoading(true);
    try {
      if (isAdmin && onAdminDelete) {
        await onAdminDelete(comment.id);
      } else {
        await onDelete(comment.id, password);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('py-3', isReply && 'pl-6 border-l-2 border-muted')}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium">
          {comment.isDeleted ? '(삭제됨)' : comment.nickname || '익명'}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatRelativeTime(comment.createdAt)}
        </span>
      </div>
      <p
        className={cn(
          'text-sm whitespace-pre-wrap break-words',
          comment.isDeleted && 'text-muted-foreground italic',
        )}
      >
        {comment.content}
      </p>
      {!comment.isDeleted && (
        <div className="flex items-center gap-1 mt-2">
          {!isReply && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              답글
            </Button>
          )}
          <DeleteCommentDialog
            onDelete={handleDelete}
            isLoading={isLoading}
            isAdmin={isAdmin && !!onAdminDelete}
          />
          {isAdmin && onBlockIp && (
            <BlockIpDialog commentId={comment.id} onBlock={onBlockIp} isLoading={isLoading} />
          )}
        </div>
      )}
      {showReplyForm && (
        <ReplyForm
          onSubmit={handleReply}
          onCancel={() => setShowReplyForm(false)}
          isLoading={isLoading}
        />
      )}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              onAdminDelete={onAdminDelete}
              onBlockIp={onBlockIp}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
}
