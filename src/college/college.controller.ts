import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Query, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseMessage } from 'src/Helper/constants';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { CollegeService } from './college.service';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';
import { FilterDto } from 'src/Helper/dto/filter.dto';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';

@Controller('college')
export class CollegeController {
  constructor(private readonly collegeService: CollegeService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post(API_ENDPOINT.CREATE_COLLEGE)
  @ResponseMessage(MESSAGES.COLLEGE_CREATED)
  create(@Req() req: RequestWithUser, @Body() createCollegeDto: CreateCollegeDto) {
    return this.collegeService.create(req.user, createCollegeDto);
  }

  @ResponseMessage(MESSAGES.ALL_COLLEGE_FETCHED)
  @Get(API_ENDPOINT.GET_ALL_COLLEGE)
  findAll(@Query() filterDto: FilterDto) {
    return this.collegeService.findAll(filterDto);
  }

  @Get(`${API_ENDPOINT.GET_COLLEGE}/:id`)
  @ResponseMessage(MESSAGES.COLLEGE_FETCHED)
  findOne(@Param('id') id: string) {
    return this.collegeService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${API_ENDPOINT.UPDATE_COLLEGE}/:id`)
  @ResponseMessage(MESSAGES.COLLEGE_UPDATED)
  update(@Req() req: RequestWithUser, @Param('id') id: string, @Body() updateCollegeDto: UpdateCollegeDto) {
    return this.collegeService.update(req.user, id, updateCollegeDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(`${API_ENDPOINT.DELETE_COLLEGE}/:id`)
  @ResponseMessage(MESSAGES.COLLEGE_DELETED)
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.collegeService.remove(req.user, id);
  }
}
