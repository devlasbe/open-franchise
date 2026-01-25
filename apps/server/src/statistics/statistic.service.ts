import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetStatisticByFilterReq } from './dto/statistic.dto';
import { PaginationUtil, TextUtil } from 'src/common/utils';

@Injectable()
export class StatisticService {
  constructor(private readonly prisma: PrismaService) {}

  findByName(name: string) {
    return this.prisma.statistic.findMany({
      where: { brandNm: { equals: name } },
      orderBy: { yr: 'asc' },
    });
  }

  findByFilter({ pageNo, pageSize, name, category, orderCol, orderSort }: GetStatisticByFilterReq) {
    const buildWhereQuery = (): Prisma.StatisticWhereInput => {
      const where: Prisma.StatisticWhereInput = {};
      if (name) where.brandNm = { contains: name, mode: 'insensitive' };
      if (category) where.indutyMlsfcNm = { contains: TextUtil.escapeRegex(category) };
      return where;
    };
    const buildOrderQuery = () => {
      if (!orderCol || !orderSort) return {};
      if (orderCol === 'smtnAmt') return { startup: { smtnAmt: orderSort } };
      return { [orderCol]: orderSort };
    };
    const where = buildWhereQuery();
    const orderBy = buildOrderQuery();
    const { skip, take } = PaginationUtil.getSkipTake({ pageNo, pageSize });
    const result = this.prisma.statistic.findMany({
      distinct: ['brandNm'],
      where: {
        frcsCnt: { not: 0 },
        avrgSlsAmt: { not: 0 },
        startup: { smtnAmt: { not: 0 } },
        ...where,
      },
      orderBy: [{ yr: 'desc' }, orderBy],
      skip,
      take,
      include: { brand: true, startup: true },
    });

    return result;
  }

  findRank() {
    return this.prisma.statistic.findMany({
      distinct: ['brandNm'],
      where: { indutyMlsfcNm: '치킨', brandNm: '비비큐' },
      orderBy: [{ yr: 'desc' }, { frcsCnt: 'desc' }],
    });
  }
}
