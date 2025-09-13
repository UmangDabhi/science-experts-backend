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
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';
import { ResponseMessage } from 'src/Helper/constants';
import { FilterDto } from 'src/Helper/dto/filter.dto';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { CACHE_KEY } from 'src/Helper/message/cache.const';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { CacheService } from 'src/Helper/services/cache.service';
import { GeneralCacheInterceptor } from 'src/interceptors/general-cache.interceptor';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { MaterialService } from './material.service';

@Controller('material')
export class MaterialController {
  constructor(
    private readonly materialService: MaterialService,
    private readonly cacheService: CacheService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(API_ENDPOINT.CREATE_MATERIAL)
  @ResponseMessage(MESSAGES.MATERIAL_CREATED)
  create(
    @Req() req: RequestWithUser,
    @Body() createMaterialDto: CreateMaterialDto,
  ) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.DASHBOARD_DETAILS,
      CACHE_KEY.MATERIALS,
      CACHE_KEY.MANAGE_MATERIALS,
    ]);
    return this.materialService.create(req.user, createMaterialDto);
  }

  @UseInterceptors(GeneralCacheInterceptor(CACHE_KEY.MANAGE_MATERIALS))
  @UseGuards(JwtAuthGuard)
  @Get(API_ENDPOINT.MANAGE_ALL_MATERIAL)
  @ResponseMessage(MESSAGES.ALL_MATERIAL_FETCHED)
  manageAllCourse(@Req() req: RequestWithUser, @Query() filterDto: FilterDto) {
    return this.materialService.manageAllMaterial(req.user, filterDto);
  }

  @UseInterceptors(GeneralCacheInterceptor(CACHE_KEY.MATERIALS))
  @UseGuards(OptionalAuthGuard)
  @Get(API_ENDPOINT.GET_ALL_MATERIAL)
  @ResponseMessage(MESSAGES.ALL_MATERIAL_FETCHED)
  findAll(@Req() req: RequestWithUser, @Query() filterDto: FilterDto) {
    return this.materialService.findAll(req?.user, filterDto);
  }

  @UseGuards(OptionalAuthGuard)
  @Get(`${API_ENDPOINT.GET_COURSE_MATERIAL}/:courseId`)
  @ResponseMessage(MESSAGES.MATERIAL_FETCHED)
  findAllByCourseId(@Param('courseId') courseId: string) {
    return this.materialService.findAllByCourseId(courseId);
  }

  @UseGuards(OptionalAuthGuard)
  @Get(`${API_ENDPOINT.GET_MATERIAL}/:id`)
  @ResponseMessage(MESSAGES.MATERIAL_FETCHED)
  findOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.materialService.findOne(req?.user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(`${API_ENDPOINT.UPDATE_MATERIAL}/:id`)
  @ResponseMessage(MESSAGES.MATERIAL_UPDATED)
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.DASHBOARD_DETAILS,
      CACHE_KEY.MATERIALS,
      CACHE_KEY.MANAGE_MATERIALS,
    ]);
    return this.materialService.update(req.user, id, updateMaterialDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(`${API_ENDPOINT.DELETE_MATERIAL}/:id`)
  @ResponseMessage(MESSAGES.MATERIAL_DELETED)
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.DASHBOARD_DETAILS,
      CACHE_KEY.MATERIALS,
      CACHE_KEY.MANAGE_MATERIALS,
    ]);
    return this.materialService.remove(req.user, id);
  }
}
