import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetHeadReq } from './dto/head.dto';
import { Head } from './entities/head.entity';
import { OpenApiResponseDto } from 'src/openApis/dto/openApi.dto';

@Injectable()
export class HeadsService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}
  private key = this.configService.get<string>('OPENAPI_KEY');
  private year = this.configService.get<string>('DEFAULT_YEAR');
  private endPoint =
    'https://apis.data.go.kr/1130000/FftcJnghdqrtrsGnrlDtl2_Service/getjnghdqrtrsGnlinfo';

  create(data: Head) {
    return this.prisma.head.create({ data });
  }

  async findOne(jnghdqrtrsMnno: string) {
    const params = {
      jnghdqrtrsMnno: jnghdqrtrsMnno,
      jngBizCrtraYr: this.year,
    };
    const dbResult = await this.prisma.head.findUnique({
      where: { jnghdqrtrsMnno },
    });
    if (dbResult) return dbResult;

    // DB에 없으면 공공데이터 호출 -> 저장 -> return
    let response: Head;
    response = await this.findOneByOpenApi(params);
    // 해당년도 없으면 전년도 데이터 호출
    if (!response) {
      response = await this.findOneByOpenApi({
        ...params,
        jngBizCrtraYr: +this.year - 1 + '',
      });
    }
    if (!response) return;
    const result = this.create(response);
    result.then((data) => console.log('save head', data));
    return response;
  }

  async findOneByOpenApi(params: GetHeadReq & { jngBizCrtraYr: string }) {
    try {
      const response = await this.httpService.axiosRef.get<
        OpenApiResponseDto<Head>
      >(this.endPoint, {
        params: {
          resultType: 'json',
          serviceKey: this.key,
          pageNo: 1,
          numOfRows: 1,
          ...params,
        },
      });
      console.log(`Head OpenApi -> year: ${this.year}`, response.data);
      const data = response?.data?.items;
      if (data?.length) return data[0];
    } catch (error) {
      throw error;
    }
  }
}
