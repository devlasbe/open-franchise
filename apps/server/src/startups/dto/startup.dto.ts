import { TypeUtil } from 'src/common/utils/type.util';
import { Startup } from '../entities/startup.entity';

export class GetStartupRes extends TypeUtil.getSuccessResponse(Startup) {}
