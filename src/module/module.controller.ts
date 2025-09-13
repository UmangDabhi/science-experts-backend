import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SignedUrlInterceptor } from 'src/interceptors/signed-url.interceptor';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResponseMessage } from 'src/Helper/constants';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleOrderDto } from './dto/update-module-order.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModuleService } from './module.service';

@Controller('module')
@UseInterceptors(SignedUrlInterceptor)
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @UseGuards(JwtAuthGuard)
  @Post(API_ENDPOINT.CREATE_MODULE)
  @ResponseMessage(MESSAGES.MODULE_CREATED)
  create(@Body() createModuleDto: CreateModuleDto) {
    return this.moduleService.create(createModuleDto);
  }

  @Get(API_ENDPOINT.GET_ALL_MODULE)
  @ResponseMessage(MESSAGES.ALL_MOUDLE_FETCHED)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.moduleService.findAll(paginationDto);
  }

  @Get(`${API_ENDPOINT.GET_COURSE_MODULE}/:courseId`)
  @ResponseMessage(MESSAGES.MODULE_FETCHED)
  findAllByCourseId(@Param('courseId') courseId: string) {
    return this.moduleService.findAllByCourseId(courseId);
  }

  @Get(`${API_ENDPOINT.GET_MODULE}/:id`)
  @ResponseMessage(MESSAGES.MODULE_FETCHED)
  findOne(@Param('id') id: string) {
    return this.moduleService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(`${API_ENDPOINT.UPDATE_MODULE_ORDER}`)
  @ResponseMessage(MESSAGES.MODULE_UPDATED)
  updateOrder(@Body() updateModuleOrderDto: UpdateModuleOrderDto) {
    return this.moduleService.updateOrder(updateModuleOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(`${API_ENDPOINT.UPDATE_MODULE}/:id`)
  @ResponseMessage(MESSAGES.MODULE_UPDATED)
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.moduleService.update(id, updateModuleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(`${API_ENDPOINT.DELETE_MODULE}/:id`)
  @ResponseMessage(MESSAGES.MODULE_DELETED)
  remove(@Param('id') id: string) {
    return this.moduleService.remove(id);
  }
}
