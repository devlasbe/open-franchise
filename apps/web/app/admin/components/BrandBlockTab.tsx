'use client';

import { useEffect, useState } from 'react';
import { BrandService } from '@/services/brand';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Brand, RejectedBrand } from '@/types/apiTypes';

export default function BrandBlockTab() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<Brand[]>([]);
  const [rejectedBrands, setRejectedBrands] = useState<RejectedBrand[]>([]);
  const [rejectionLoading, setRejectionLoading] = useState(false);

  const fetchRejectedBrands = async () => {
    try {
      const res = await BrandService.getRejectedBrandList({
        pageNo: 1,
        pageSize: 100,
      });
      if (res?.payload) {
        setRejectedBrands(res.payload);
      }
    } catch (error) {
      console.error('차단 브랜드 목록 로딩 실패:', error);
    }
  };

  const handleSearchBrand = async () => {
    if (!searchKeyword) return;
    setRejectionLoading(true);
    try {
      const res = await BrandService.getBrandList({
        pageNo: 1,
        pageSize: 10,
        name: searchKeyword,
      });
      if (res?.payload) {
        setSearchResults(res.payload);
      }
    } catch (error) {
      console.error('브랜드 검색 실패:', error);
    } finally {
      setRejectionLoading(false);
    }
  };

  const handleAddRejection = async (brandNm: string) => {
    if (!confirm(`${brandNm} 브랜드를 차단하시겠습니까?`)) return;
    try {
      await BrandService.addRejectedBrand(brandNm);
      alert('차단되었습니다.');
      fetchRejectedBrands();
    } catch (error) {
      console.error('차단 추가 실패:', error);
      alert('차단 추가 실패');
    }
  };

  const handleDeleteRejection = async (brandNm: string) => {
    if (!confirm(`${brandNm} 차단을 해제하시겠습니까?`)) return;
    try {
      await BrandService.deleteRejectedBrand(brandNm);
      alert('차단이 해제되었습니다.');
      fetchRejectedBrands();
    } catch (error) {
      console.error('차단 해제 실패:', error);
      alert('차단 해제 실패');
    }
  };

  useEffect(() => {
    fetchRejectedBrands();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>브랜드 차단 관리</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 검색 영역 */}
        <div className="flex gap-4">
          <Input
            placeholder="차단할 브랜드 검색..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchBrand()}
            className="max-w-sm"
          />
          <Button onClick={handleSearchBrand} disabled={rejectionLoading}>
            검색
          </Button>
        </div>

        {/* 검색 결과 테이블 */}
        {searchResults.length > 0 && (
          <div className="border rounded-md p-4">
            <h3 className="font-bold mb-2">검색 결과</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>브랜드명</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead className="w-[100px] text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((brand) => (
                  <TableRow key={brand.brandNm}>
                    <TableCell>{brand.brandNm}</TableCell>
                    <TableCell>{brand.indutyMlsfcNm}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleAddRejection(brand.brandNm)}
                      >
                        차단
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* 차단된 브랜드 목록 */}
        <div className="border rounded-md p-4">
          <h3 className="font-bold mb-2">차단된 브랜드 목록</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>브랜드명</TableHead>
                <TableHead className="w-[100px] text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rejectedBrands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-4">
                    차단된 브랜드가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                rejectedBrands.map((item) => (
                  <TableRow key={item.brandNm}>
                    <TableCell>{item.brandNm}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRejection(item.brandNm)}
                      >
                        해제
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
