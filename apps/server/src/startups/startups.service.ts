import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StartupsService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(name: string) {
    return this.prisma.startup.findUnique({ where: { brandNm: name } });
  }
}
