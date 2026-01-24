'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataCollectionTab from './components/DataCollectionTab';
import BrandBlockTab from './components/BrandBlockTab';
import CommentsTab from './components/CommentsTab';
import BlockedIpsTab from './components/BlockedIpsTab';

export default function AdminPage() {
  return (
    <div className="p-6">
      <h1 className="text-h1 font-bold mb-6">관리자 대시보드</h1>

      <Tabs defaultValue="data-collection" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="data-collection">데이터 수집</TabsTrigger>
          <TabsTrigger value="brand-block">브랜드 차단</TabsTrigger>
          <TabsTrigger value="comments">댓글 관리</TabsTrigger>
          <TabsTrigger value="blocked-ips">IP 차단</TabsTrigger>
        </TabsList>

        <TabsContent value="data-collection">
          <DataCollectionTab />
        </TabsContent>

        <TabsContent value="brand-block">
          <BrandBlockTab />
        </TabsContent>

        <TabsContent value="comments">
          <CommentsTab />
        </TabsContent>

        <TabsContent value="blocked-ips">
          <BlockedIpsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
