'use client';

import { useEffect, useState, useCallback } from 'react';
import { AdminService, AdminCommentType } from '@/services/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const PAGE_SIZE = 10;

export default function CommentsTab() {
  const [comments, setComments] = useState<AdminCommentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [brandNm, setBrandNm] = useState('');
  const [ipAddress, setIpAddress] = useState('');

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await AdminService.getComments({
        pageNo,
        pageSize: PAGE_SIZE,
        brandNm: brandNm || undefined,
        ipAddress: ipAddress || undefined,
      });
      if (res?.payload) {
        setComments(res.payload);
        setTotalCount(res.count);
      }
    } catch (error) {
      console.error('댓글 목록 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [pageNo, brandNm, ipAddress]);

  const handleSearch = () => {
    setPageNo(1);
    fetchComments();
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) return;
    try {
      await AdminService.deleteComment(commentId);
      alert('삭제되었습니다.');
      fetchComments();
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('삭제 실패');
    }
  };

  const handleBlockIp = async (commentId: string, ip: string) => {
    const reason = prompt(`IP ${ip}를 차단합니다. 차단 사유를 입력하세요 (선택):`, '');
    if (reason === null) return;

    try {
      await AdminService.blockCommentIp(commentId, reason || undefined);
      alert('IP가 차단되었습니다.');
    } catch (error) {
      console.error('IP 차단 실패:', error);
      alert('IP 차단 실패');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;

    return date.toLocaleDateString('ko-KR');
  };

  const truncateContent = (content: string, maxLength: number = 30) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>댓글 관리</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 검색 필터 */}
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          <Input
            placeholder="브랜드명 검색"
            value={brandNm}
            onChange={(e) => setBrandNm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full sm:w-48"
          />
          <Input
            placeholder="IP 주소 검색"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full sm:w-48"
          />
          <Button onClick={handleSearch} disabled={loading} className="w-full sm:w-auto">
            검색
          </Button>
        </div>

        {/* 모바일 카드 레이아웃 */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">로딩 중...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">댓글이 없습니다.</div>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id} className="border">
                <CardContent className="p-4 space-y-3">
                  {/* 상단: 브랜드명 + 상태 배지 */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate mr-2">{comment.brandNm}</span>
                    {comment.isDeleted ? (
                      <Badge variant="secondary">삭제됨</Badge>
                    ) : (
                      <Badge variant="default">정상</Badge>
                    )}
                  </div>

                  {/* 내용 */}
                  <p className="text-sm">{comment.content}</p>

                  {/* 메타 정보: 닉네임, IP, 작성일 */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>닉네임: {comment.nickname || '익명'}</span>
                    <span className="font-mono">IP: {comment.ipAddress}</span>
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex gap-2 pt-2 border-t">
                    {!comment.isDeleted && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(comment.id)}
                      >
                        삭제
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBlockIp(comment.id, comment.ipAddress)}
                    >
                      IP차단
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* 데스크톱 테이블 */}
        <div className="hidden md:block border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">브랜드명</TableHead>
                <TableHead className="w-[80px]">닉네임</TableHead>
                <TableHead>내용</TableHead>
                <TableHead className="w-[120px]">IP</TableHead>
                <TableHead className="w-[100px]">작성일</TableHead>
                <TableHead className="w-[80px]">상태</TableHead>
                <TableHead className="w-[150px] text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    로딩 중...
                  </TableCell>
                </TableRow>
              ) : comments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    댓글이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                comments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell className="font-medium">{comment.brandNm}</TableCell>
                    <TableCell>{comment.nickname || '익명'}</TableCell>
                    <TableCell title={comment.content}>
                      {truncateContent(comment.content)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{comment.ipAddress}</TableCell>
                    <TableCell>{formatDate(comment.createdAt)}</TableCell>
                    <TableCell>
                      {comment.isDeleted ? (
                        <Badge variant="secondary">삭제됨</Badge>
                      ) : (
                        <Badge variant="default">정상</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        {!comment.isDeleted && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(comment.id)}
                          >
                            삭제
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBlockIp(comment.id, comment.ipAddress)}
                        >
                          IP차단
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageNo((p) => Math.max(1, p - 1))}
              disabled={pageNo === 1}
            >
              이전
            </Button>
            <span className="flex items-center px-4 text-sm">
              {pageNo} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageNo((p) => Math.min(totalPages, p + 1))}
              disabled={pageNo === totalPages}
            >
              다음
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
