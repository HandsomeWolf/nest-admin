import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { AdminGuard } from '@/common/guards/admin.guard';
import { CaslGuard } from '@/common/guards/casl.guard';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { CheckPolices, Can } from '@/common/decorators/casl.decorator';
import { Action } from '@/enum/action.enum';
import { LogsDto, PublicLogsDto } from './dto/get-log.dto';
import { Serialize } from '@/common/decorators/serialize.decorator';

class LogResource {}

@Controller('logs')
// @UseGuards(JwtGuard, AdminGuard, CaslGuard)
@CheckPolices((ability) => ability.can(Action.Read, LogResource))
@Can(Action.Read, LogResource)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}
  @Get()
  @Can(Action.Read, LogResource)
  getTest() {
    return 'test';
  }

  @Post()
  @Can(Action.Create, LogResource)
  @Serialize(PublicLogsDto)
  // @UseInterceptors(new SerializeInterceptor(PublicLogsDto))
  postTest(@Body() dto: LogsDto) {
    console.log(
      '🚀 ~ file: logs.controller.ts ~ line 15 ~ LogsController ~ postTest ~ dto',
      dto,
    );
    return dto;
  }
}
