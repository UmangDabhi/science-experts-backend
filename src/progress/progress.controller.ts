import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { AuthGuard } from '@nestjs/passport';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { ResponseMessage } from 'src/Helper/constants';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(API_ENDPOINT.CREATE_PROGRESS)
  @ResponseMessage(MESSAGES.PROGRESS_CREATED)
  create(
    @Req() req: RequestWithUser,
    @Body() createProgressDto: CreateProgressDto,
  ) {
    return this.progressService.create(req.user, createProgressDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(`${API_ENDPOINT.DELETE_PROGRESS}/:id`)
  @ResponseMessage(MESSAGES.PROGRESS_DELETED)
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.progressService.remove(req.user, id);
  }
}
