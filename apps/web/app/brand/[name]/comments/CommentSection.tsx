import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommentList from './CommentList';
import fetchService from '@/utils/fetchService';
import { QueryParamsUtil } from '@/utils/queryParams';
import type { GetCommentsRes, CommentListPayload } from '@/types/apiTypes';

type CommentSectionPropsType = {
  brandNm: string;
};

const PAGE_SIZE = 20;

async function getInitialComments(brandNm: string): Promise<CommentListPayload> {
  try {
    const response = await fetchService<GetCommentsRes>({
      path: QueryParamsUtil.convert(`brands/${encodeURIComponent(brandNm)}/comments`, {
        pageNo: 1,
        pageSize: PAGE_SIZE,
      }),
      init: { cache: 'no-store' },
      isClient: false,
    });
    return response.payload;
  } catch {
    return {
      comments: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }
}

export default async function CommentSection({ brandNm }: CommentSectionPropsType) {
  const initialData = await getInitialComments(brandNm);

  return (
    <Card id="comment-section" className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">댓글</CardTitle>
      </CardHeader>
      <CardContent>
        <CommentList brandNm={brandNm} initialData={initialData} />
      </CardContent>
    </Card>
  );
}
