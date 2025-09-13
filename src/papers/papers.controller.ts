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
import { SecureDownloadService } from 'src/Helper/services/secure-download.service';
import { GeneralCacheInterceptor } from 'src/interceptors/general-cache.interceptor';
import { SignedUrlInterceptor } from 'src/interceptors/signed-url.interceptor';
import { CreatePaperDto } from './dto/create-paper.dto';
import { UpdatePaperDto } from './dto/update-paper.dto';
import { PapersService } from './papers.service';

@Controller('papers')
@UseInterceptors(SignedUrlInterceptor)
export class PapersController {
  constructor(
    private readonly papersService: PapersService,
    private readonly cacheService: CacheService,
    private readonly secureDownloadService: SecureDownloadService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(API_ENDPOINT.CREATE_PAPER)
  @ResponseMessage(MESSAGES.PAPER_CREATED)
  create(@Req() req: RequestWithUser, @Body() createPaperDto: CreatePaperDto) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.DASHBOARD_DETAILS,
      CACHE_KEY.PAPERS,
      CACHE_KEY.MANAGE_PAPERS,
    ]);
    return this.papersService.create(req.user, createPaperDto);
  }

  @UseInterceptors(GeneralCacheInterceptor(CACHE_KEY.MANAGE_PAPERS))
  @UseGuards(JwtAuthGuard)
  @Get(API_ENDPOINT.MANAGE_ALL_PAPER)
  @ResponseMessage(MESSAGES.ALL_PAPER_FETCHED)
  manageAllCourse(@Req() req: RequestWithUser, @Query() filterDto: FilterDto) {
    return this.papersService.manageAllPaper(req.user, filterDto);
  }

  @UseInterceptors(GeneralCacheInterceptor(CACHE_KEY.PAPERS))
  @UseGuards(OptionalAuthGuard)
  @Get(API_ENDPOINT.GET_ALL_PAPER)
  @ResponseMessage(MESSAGES.ALL_PAPER_FETCHED)
  findAll(@Req() req: RequestWithUser, @Query() filterDto: FilterDto) {
    return this.papersService.findAll(req?.user, filterDto);
  }

  @UseGuards(OptionalAuthGuard)
  @Get(`${API_ENDPOINT.GET_PAPER}/:id`)
  @ResponseMessage(MESSAGES.PAPER_FETCHED)
  findOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.papersService.findOne(req?.user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(`${API_ENDPOINT.UPDATE_PAPER}/:id`)
  @ResponseMessage(MESSAGES.PAPER_UPDATED)
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updatePaperDto: UpdatePaperDto,
  ) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.DASHBOARD_DETAILS,
      CACHE_KEY.PAPERS,
      CACHE_KEY.MANAGE_PAPERS,
    ]);
    return this.papersService.update(req.user, id, updatePaperDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(`${API_ENDPOINT.DELETE_PAPER}/:id`)
  @ResponseMessage(MESSAGES.PAPER_DELETED)
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.DASHBOARD_DETAILS,
      CACHE_KEY.PAPERS,
      CACHE_KEY.MANAGE_PAPERS,
    ]);
    return this.papersService.remove(req.user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(`${API_ENDPOINT.DONWLOAD_URL}/:id`)
  @ResponseMessage('Paper download URL generated')
  async getDownloadUrl(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.secureDownloadService.getPaperDownloadUrl(id, req.user);
  }
}
