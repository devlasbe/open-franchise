import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetBrandListReq } from './dto/brand.dto';
import { Brand } from './entities/brand.entity';
import { HeadsService } from 'src/heads/heads.service';

const escapeRegex = (str: string) => str.replace(/\//g, '\\/');

@Injectable()
export class BrandService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly headsService: HeadsService,
  ) {}

  async findOne(brandNm: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { brandNm },
      include: { statistics: true },
    });
    const isRejectedBrand = !!(await this.prisma.rejectedBrand.findFirst({
      where: { brandNm },
    }));

    if (!brand?.jnghdqrtrsMnno) return { brand, head: {} };
    const head = await this.headsService.findOne(brand.jnghdqrtrsMnno);
    return { brand, head, isRejectedBrand };
  }

  findByFilter({
    pageNo,
    pageSize,
    category,
    name,
    orderCol,
    orderSort,
  }: GetBrandListReq) {
    const buildWhereQuery = () => {
      const where: any = {};
      if (name) where.brandNm = { contains: name, mode: 'insensitive' };
      if (category) where.indutyMlsfcNm = { contains: escapeRegex(category) };
      return where;
    };
    const buildOrderQuery = () => {
      if (!orderCol || !orderSort) return;
      if (!(orderCol in ({} as Brand))) return;
      return { [orderCol]: orderSort };
    };
    const where = buildWhereQuery();
    const orderBy = buildOrderQuery();
    const result = this.prisma.brand.findMany({
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
      where,
      orderBy,
      include: {
        statistics: { take: 1, orderBy: { yr: 'desc' } },
      },
    });
    return result;
  }

  findAll() {
    return this.prisma.brand.findMany();
  }

  async findAllRejected({ pageNo, pageSize, name }: GetBrandListReq) {
    const where: any = {};
    if (name) where.brandNm = { contains: name, mode: 'insensitive' };

    return this.prisma.rejectedBrand.findMany({
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
      where,
    });
  }

  async addRejected(brandNm: string) {
    return this.prisma.rejectedBrand.create({ data: { brandNm } });
  }

  async removeRejected(brandNm: string) {
    return this.prisma.rejectedBrand.delete({ where: { brandNm } });
  }
}
