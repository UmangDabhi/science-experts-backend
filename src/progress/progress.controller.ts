import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResponseMessage } from 'src/Helper/constants';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { CreateProgressDto } from './dto/create-progress.dto';
import { ProgressService } from './progress.service';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @UseGuards(JwtAuthGuard)
  @Post(API_ENDPOINT.CREATE_PROGRESS)
  @ResponseMessage(MESSAGES.PROGRESS_CREATED)
  create(
    @Req() req: RequestWithUser,
    @Body() createProgressDto: CreateProgressDto,
  ) {
    return this.progressService.create(req.user, createProgressDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(`${API_ENDPOINT.DELETE_PROGRESS}/:id`)
  @ResponseMessage(MESSAGES.PROGRESS_DELETED)
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.progressService.remove(req.user, id);
  }
}
