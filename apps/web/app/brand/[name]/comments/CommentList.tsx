'use client';

import { useState, useCallback } from 'react';
import { Comment, CommentService, CommentsResponse } from '@/services/comment';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import CommentPagination from './CommentPagination';
import { ApiError } from '@/utils/fetchService';

type CommentListProps = {
  brandNm: string;
  initialData: CommentsResponse['payload'];
};

const PAGE_SIZE = 20;

export default function CommentList({ brandNm, initialData }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>(initialData.comments);
  const [totalCount, setTotalCount] = useState(initialData.totalCount);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [currentPage, setCurrentPage] = useState(initialData.currentPage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(
    async (page: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await CommentService.getComments(brandNm, {
          pageNo: page,
          pageSize: PAGE_SIZE,
        });
        setComments(response.payload.comments);
        setTotalCount(response.payload.totalCount);
        setTotalPages(response.payload.totalPages);
        setCurrentPage(response.payload.currentPage);
      } catch (err) {
        setError('댓글을 불러오는데 실패했습니다');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [brandNm],
  );

  const handleCreateComment = async (data: {
    nickname: string;
    password: string;
    content: string;
  }) => {
    try {
      await CommentService.createComment(brandNm, data);
      await fetchComments(1);
    } catch (err) {
      if (err instanceof ApiError) {
        throw new Error(err.message);
      }
      throw err;
    }
  };

  const handleCreateReply = async (
    commentId: string,
    data: { nickname: string; password: string; content: string },
  ) => {
    try {
      await CommentService.createReply(commentId, data);
      await fetchComments(currentPage);
    } catch (err) {
      if (err instanceof ApiError) {
        throw new Error(err.message);
      }
      throw err;
    }
  };

  const handleDeleteComment = async (commentId: string, password: string) => {
    try {
      await CommentService.deleteComment(commentId, password);
      await fetchComments(currentPage);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 403) {
          throw new Error('비밀번호가 일치하지 않습니다');
        }
        throw new Error(err.message);
      }
      throw err;
    }
  };

  const handleAdminDeleteComment = async (commentId: string) => {
    try {
      await CommentService.forceDeleteComment(commentId);
      await fetchComments(currentPage);
    } catch (err) {
      if (err instanceof ApiError) {
        throw new Error(err.message);
      }
      throw err;
    }
  };

  const handleBlockIp = async (commentId: string, reason?: string) => {
    try {
      await CommentService.blockCommentIp(commentId, { reason });
      alert('IP가 차단되었습니다.');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          throw new Error('이미 차단된 IP입니다');
        }
        throw new Error(err.message);
      }
      throw err;
    }
  };

  const handlePageChange = (page: number) => {
    fetchComments(page);
    window.scrollTo({
      top: document.getElementById('comment-section')?.offsetTop ?? 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="space-y-4">
      <CommentForm onSubmit={handleCreateComment} isLoading={isLoading} />

      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      <div className="text-sm text-muted-foreground">총 {totalCount}개의 댓글</div>

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">불러오는 중...</div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
        </div>
      ) : (
        <div className="divide-y">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleCreateReply}
              onDelete={handleDeleteComment}
              onAdminDelete={handleAdminDeleteComment}
              onBlockIp={handleBlockIp}
            />
          ))}
        </div>
      )}

      <CommentPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
