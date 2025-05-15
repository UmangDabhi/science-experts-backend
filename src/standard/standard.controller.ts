import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { StandardService } from './standard.service';
import { CreateStandardDto } from './dto/create-standard.dto';
import { UpdateStandardDto } from './dto/update-standard.dto';
import { AuthGuard } from '@nestjs/passport';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { ResponseMessage } from 'src/Helper/constants';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';

@Controller('standard')
export class StandardController {
  constructor(private readonly standardService: StandardService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(API_ENDPOINT.CREATE_STANDARD)
  @ResponseMessage(MESSAGES.STANDARD_CREATED)
  create(@Body() createStandardDto: CreateStandardDto) {
    return this.standardService.create(createStandardDto);
  }

  @Get(API_ENDPOINT.GET_ALL_STANDARD)
  @ResponseMessage(MESSAGES.ALL_STANDARD_FETCHED)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.standardService.findAll(paginationDto);
  }

  @Get(`${API_ENDPOINT.GET_STANDARD}/:id`)
  @ResponseMessage(MESSAGES.STANDARD_FETCHED)
  findOne(@Param('id') id: string) {
    return this.standardService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${API_ENDPOINT.UPDATE_STANDARD}/:id`)
  @ResponseMessage(MESSAGES.STANDARD_UPDATED)
  update(
    @Param('id') id: string,
    @Body() updateStandardDto: UpdateStandardDto,
  ) {
    return this.standardService.update(id, updateStandardDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(`${API_ENDPOINT.DELETE_STANDARD}/:id`)
  @ResponseMessage(MESSAGES.STANDARD_DELETED)
  remove(@Param('id') id: string) {
    return this.standardService.remove(id);
  }
}
