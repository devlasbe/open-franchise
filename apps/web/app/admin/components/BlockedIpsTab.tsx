'use client';

import { useEffect, useState, useCallback } from 'react';
import { AdminService, BlockedIp } from '@/services/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const PAGE_SIZE = 10;

type BlockedIpForm = {
  ipPattern: string;
  reason: string;
  expiresAt: string;
  isActive: boolean;
};

const initialForm: BlockedIpForm = {
  ipPattern: '',
  reason: '',
  expiresAt: '',
  isActive: true,
};

export default function BlockedIpsTab() {
  const [blockedIps, setBlockedIps] = useState<BlockedIp[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [ipPattern, setIpPattern] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<BlockedIpForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const fetchBlockedIps = useCallback(async () => {
    setLoading(true);
    try {
      const res = await AdminService.getBlockedIps({
        pageNo,
        pageSize: PAGE_SIZE,
        ipPattern: ipPattern || undefined,
        isActive: activeOnly ? true : undefined,
      });
      if (res?.payload) {
        setBlockedIps(res.payload);
        setTotalCount(res.count);
      }
    } catch (error) {
      console.error('차단 IP 목록 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [pageNo, ipPattern, activeOnly]);

  const handleSearch = () => {
    setPageNo(1);
    fetchBlockedIps();
  };

  const handleAdd = async () => {
    if (!formData.ipPattern) {
      alert('IP 패턴을 입력해주세요.');
      return;
    }

    try {
      await AdminService.createBlockedIp({
        ipPattern: formData.ipPattern,
        reason: formData.reason || undefined,
        expiresAt: formData.expiresAt || undefined,
      });
      alert('IP가 차단되었습니다.');
      setIsAddDialogOpen(false);
      setFormData(initialForm);
      fetchBlockedIps();
    } catch (error) {
      console.error('IP 차단 추가 실패:', error);
      alert('IP 차단 추가 실패');
    }
  };

  const openEditDialog = (item: BlockedIp) => {
    setEditingId(item.id);
    setFormData({
      ipPattern: item.ipPattern,
      reason: item.reason || '',
      expiresAt: item.expiresAt ? item.expiresAt.split('T')[0] : '',
      isActive: item.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleEdit = async () => {
    if (!editingId || !formData.ipPattern) {
      alert('IP 패턴을 입력해주세요.');
      return;
    }

    try {
      await AdminService.updateBlockedIp(editingId, {
        ipPattern: formData.ipPattern,
        reason: formData.reason || undefined,
        expiresAt: formData.expiresAt || undefined,
        isActive: formData.isActive,
      });
      alert('수정되었습니다.');
      setIsEditDialogOpen(false);
      setFormData(initialForm);
      setEditingId(null);
      fetchBlockedIps();
    } catch (error) {
      console.error('IP 차단 수정 실패:', error);
      alert('수정 실패');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 IP 차단을 삭제하시겠습니까?')) return;

    try {
      await AdminService.deleteBlockedIp(id);
      alert('삭제되었습니다.');
      fetchBlockedIps();
    } catch (error) {
      console.error('IP 차단 삭제 실패:', error);
      alert('삭제 실패');
    }
  };

  const handleToggleActive = async (item: BlockedIp) => {
    try {
      await AdminService.updateBlockedIp(item.id, {
        isActive: !item.isActive,
      });
      fetchBlockedIps();
    } catch (error) {
      console.error('상태 변경 실패:', error);
      alert('상태 변경 실패');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  useEffect(() => {
    fetchBlockedIps();
  }, [fetchBlockedIps]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>IP 차단 관리</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>+ IP 차단 추가</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>IP 차단 추가</DialogTitle>
              <DialogDescription>
                차단할 IP 패턴을 입력하세요. CIDR 표기법 지원 (예: 192.168.1.0/24)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="ipPattern">IP 패턴 *</Label>
                <Input
                  id="ipPattern"
                  placeholder="192.168.1.0/24 또는 10.0.0.1"
                  value={formData.ipPattern}
                  onChange={(e) => setFormData({ ...formData, ipPattern: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">차단 사유</Label>
                <Input
                  id="reason"
                  placeholder="스팸 댓글"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiresAt">만료일 (선택)</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleAdd}>추가</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 검색 필터 */}
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap items-stretch sm:items-center">
          <Input
            placeholder="IP 패턴 검색"
            value={ipPattern}
            onChange={(e) => setIpPattern(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full sm:w-48"
          />
          <div className="flex items-center gap-2">
            <Switch
              id="activeOnly"
              checked={activeOnly}
              onCheckedChange={(checked) => {
                setActiveOnly(checked);
              }}
            />
            <Label htmlFor="activeOnly">활성화만</Label>
          </div>
          <Button onClick={handleSearch} disabled={loading} className="w-full sm:w-auto">
            검색
          </Button>
        </div>

        {/* 모바일 카드 레이아웃 */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">로딩 중...</div>
          ) : blockedIps.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">차단된 IP가 없습니다.</div>
          ) : (
            blockedIps.map((item) => (
              <Card key={item.id} className="border">
                <CardContent className="p-4 space-y-3">
                  {/* 상단: IP 패턴 + 상태 배지 */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-medium">{item.ipPattern}</span>
                    {item.isActive ? (
                      <Badge variant="destructive">활성</Badge>
                    ) : (
                      <Badge variant="secondary">비활성</Badge>
                    )}
                  </div>

                  {/* 사유 */}
                  {item.reason && <p className="text-sm">{item.reason}</p>}

                  {/* 메타 정보: 차단일, 만료일 */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>차단일: {formatDate(item.blockedAt)}</span>
                    <span>만료일: {formatDate(item.expiresAt)}</span>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                      수정
                    </Button>
                    <Button
                      variant={item.isActive ? 'secondary' : 'default'}
                      size="sm"
                      onClick={() => handleToggleActive(item)}
                    >
                      {item.isActive ? '비활성화' : '활성화'}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                      삭제
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
                <TableHead className="w-[180px]">IP 패턴</TableHead>
                <TableHead>사유</TableHead>
                <TableHead className="w-[100px]">차단일</TableHead>
                <TableHead className="w-[100px]">만료일</TableHead>
                <TableHead className="w-[80px]">상태</TableHead>
                <TableHead className="w-[150px] text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    로딩 중...
                  </TableCell>
                </TableRow>
              ) : blockedIps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    차단된 IP가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                blockedIps.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">{item.ipPattern}</TableCell>
                    <TableCell>{item.reason || '-'}</TableCell>
                    <TableCell>{formatDate(item.blockedAt)}</TableCell>
                    <TableCell>{formatDate(item.expiresAt)}</TableCell>
                    <TableCell>
                      {item.isActive ? (
                        <Badge variant="destructive">활성</Badge>
                      ) : (
                        <Badge variant="secondary">비활성</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                          수정
                        </Button>
                        <Button
                          variant={item.isActive ? 'secondary' : 'default'}
                          size="sm"
                          onClick={() => handleToggleActive(item)}
                        >
                          {item.isActive ? '비활성화' : '활성화'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          삭제
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

        {/* 수정 다이얼로그 */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>IP 차단 수정</DialogTitle>
              <DialogDescription>차단 정보를 수정합니다.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editIpPattern">IP 패턴 *</Label>
                <Input
                  id="editIpPattern"
                  placeholder="192.168.1.0/24 또는 10.0.0.1"
                  value={formData.ipPattern}
                  onChange={(e) => setFormData({ ...formData, ipPattern: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editReason">차단 사유</Label>
                <Input
                  id="editReason"
                  placeholder="스팸 댓글"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editExpiresAt">만료일</Label>
                <Input
                  id="editExpiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="editIsActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="editIsActive">활성화</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleEdit}>수정</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
