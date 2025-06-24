import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseMessage } from 'src/Helper/constants';
import { FilterDto } from 'src/Helper/dto/filter.dto';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';
import { AdmissionService } from './admission.service';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { UpdateAdmissionDto } from './dto/update-admission.dto';
import { RemarkDto } from './dto/remark.dto';

@Controller('admission')
export class AdmissionController {
  constructor(private readonly admissionService: AdmissionService) { }

  @UseGuards(OptionalAuthGuard)
  @Post(API_ENDPOINT.CREATE_ADMISSION)
  @ResponseMessage(MESSAGES.ADMISSION_CREATED)
  create(@Body() createAdmissionDto: CreateAdmissionDto) {
    return this.admissionService.create(createAdmissionDto);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get(API_ENDPOINT.GET_ALL_ADMISSION)
  @ResponseMessage(MESSAGES.ALL_ADMISSION_FETCHED)
  findAll(@Query() filterDto: FilterDto) {
    return this.admissionService.findAll(filterDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(`${API_ENDPOINT.GET_ADMISSION}/:id`)
  @ResponseMessage(MESSAGES.ADMISSION_FETCHED)
  findOne(@Param('id') id: string) {
    return this.admissionService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${API_ENDPOINT.UPDATE_ADMISSION}/:id`)
  @ResponseMessage(MESSAGES.ADMISSION_UPDATED)
  update(
    @Param('id') id: string,
    @Body() updateAdmissionDto: UpdateAdmissionDto) {
    return this.admissionService.update(id, updateAdmissionDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${API_ENDPOINT.APPEND_REMARK}/:id`)
  @ResponseMessage(MESSAGES.ADMISSION_UPDATED)
  appendRemark(
    @Param('id') id: string,
    @Body() remarkDto: RemarkDto) {
    return this.admissionService.appendRemark(id, remarkDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(`${API_ENDPOINT.DELETE_ADMISSION}/:id`)
  @ResponseMessage(MESSAGES.ADMISSION_DELETED)
  remove(@Param('id') id: string) {
    return this.admissionService.remove(id);
  }
}
