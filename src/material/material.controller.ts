import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseMessage } from 'src/Helper/constants';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { MaterialService } from './material.service';

@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post(API_ENDPOINT.CREATE_MATERIAL)
  @ResponseMessage(MESSAGES.MATERIAL_CREATED)
  create(
    @Req() req: RequestWithUser,
    @Body() createMaterialDto: CreateMaterialDto,
  ) {
    return this.materialService.create(req.user, createMaterialDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(API_ENDPOINT.GET_ALL_MATERIAL)
  @ResponseMessage(MESSAGES.ALL_MATERIAL_FETCHED)
  findAll(
    @Req() req: RequestWithUser,

    @Query() paginationDto: PaginationDto) {
    return this.materialService.findAll(req.user, paginationDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(`${API_ENDPOINT.GET_COURSE_MATERIAL}/:courseId`)
  @ResponseMessage(MESSAGES.MATERIAL_FETCHED)
  findAllByCourseId(@Param('courseId') courseId: string) {
    return this.materialService.findAllByCourseId(courseId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(`${API_ENDPOINT.GET_MATERIAL}/:id`)
  @ResponseMessage(MESSAGES.MATERIAL_FETCHED)
  findOne(@Param('id') id: string) {
    return this.materialService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${API_ENDPOINT.UPDATE_MATERIAL}/:id`)
  @ResponseMessage(MESSAGES.MATERIAL_UPDATED)
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    return this.materialService.update(req.user, id, updateMaterialDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(`${API_ENDPOINT.DELETE_MATERIAL}/:id`)
  @ResponseMessage(MESSAGES.MATERIAL_DELETED)
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.materialService.remove(req.user, id);
  }
}
