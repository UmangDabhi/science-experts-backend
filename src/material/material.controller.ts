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
  Req,
} from '@nestjs/common';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { AuthGuard } from '@nestjs/passport';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { ResponseMessage } from 'src/Helper/constants';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';

@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

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
  findAll(@Query() paginationDto: PaginationDto) {
    return this.materialService.findAll(paginationDto);
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
