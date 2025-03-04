import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ModuleService } from './module.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { AuthGuard } from '@nestjs/passport';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { ResponseMessage } from 'src/Helper/constants';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';

@Controller('module')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post(API_ENDPOINT.CREATE_MODULE)
  @ResponseMessage(MESSAGES.MODULE_CREATED)
  create(@Body() createModuleDto: CreateModuleDto) {
    return this.moduleService.create(createModuleDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(API_ENDPOINT.GET_ALL_MODULE)
  @ResponseMessage(MESSAGES.ALL_MOUDLE_FETCHED)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.moduleService.findAll(paginationDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(`${API_ENDPOINT.GET_COURSE_MODULE}/:courseId`)
  @ResponseMessage(MESSAGES.MODULE_FETCHED)
  findAllByCourseId(@Param('courseId') courseId: string) {
    return this.moduleService.findAllByCourseId(courseId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(`${API_ENDPOINT.GET_MODULE}/:id`)
  @ResponseMessage(MESSAGES.MODULE_FETCHED)
  findOne(@Param('id') id: string) {
    return this.moduleService.findOne(id);
  }


  @UseGuards(AuthGuard('jwt'))
  @Patch(`${API_ENDPOINT.UPDATE_MODULE}/:id`)
  @ResponseMessage(MESSAGES.MODULE_UPDATED)
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.moduleService.update(id, updateModuleDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(`${API_ENDPOINT.DELETE_MODULE}/:id`)
  @ResponseMessage(MESSAGES.MODULE_DELETED)
  remove(@Param('id') id: string) {
    return this.moduleService.remove(id);
  }
}
