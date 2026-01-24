---
description: NestJS 새 모듈 생성 가이드
---

# NestJS 새 모듈 생성

NestJS 프로젝트에 새 모듈을 추가하는 가이드입니다.

## 디렉토리 구조 생성

```bash
cd apps/server
mkdir -p src/[module-name]/dto
mkdir -p src/[module-name]/entities
```

## 파일 생성

### 1. 모듈 정의

`src/[module-name]/[module-name].module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { [Name]Controller } from './[module-name].controller';
import { [Name]Service } from './[module-name].service';

@Module({
  controllers: [[Name]Controller],
  providers: [[Name]Service],
  exports: [[Name]Service],
})
export class [Name]Module {}
```

### 2. 컨트롤러

`src/[module-name]/[module-name].controller.ts`:

```typescript
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { [Name]Service } from './[module-name].service';

@ApiTags('[module-name]')
@Controller('[module-name]')
export class [Name]Controller {
  constructor(private readonly service: [Name]Service) {}

  @Get()
  @ApiOperation({ summary: '목록 조회' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '단건 조회' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
```

### 3. 서비스

`src/[module-name]/[module-name].service.ts`:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class [Name]Service {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.[model].findMany();
  }

  async findOne(id: string) {
    const item = await this.prisma.[model].findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`[Name] #${id} not found`);
    }

    return item;
  }
}
```

### 4. DTO

`src/[module-name]/dto/create-[module-name].dto.ts`:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class Create[Name]Dto {
  @ApiProperty({ description: '이름' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
```

## AppModule에 등록

`src/app.module.ts`:

```typescript
import { [Name]Module } from './[module-name]/[module-name].module';

@Module({
  imports: [
    // ... 기존 모듈들
    [Name]Module,
  ],
})
export class AppModule {}
```

## Prisma 스키마 추가 (필요 시)

`prisma/schema.prisma`:

```prisma
model [Name] {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

마이그레이션 실행:

```bash
pnpm prisma:migrate:dev
```
