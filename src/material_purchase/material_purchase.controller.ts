import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateMaterialPurchaseDto } from './dto/create-material_purchase.dto';
import { MaterialPurchaseService } from './material_purchase.service';
import { AuthGuard } from '@nestjs/passport';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { ResponseMessage } from 'src/Helper/constants';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';

@Controller('material_purchase')
export class MaterialPurchaseController {
  constructor(private readonly materialPurchaseService: MaterialPurchaseService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post(API_ENDPOINT.CREATE_MATERIAL_PURCHASE)
  @ResponseMessage(MESSAGES.MATERIAL_PURCHASE_CREATED)
  create(@Req() req: RequestWithUser, @Body() createMaterialPurchaseDto: CreateMaterialPurchaseDto) {
    return this.materialPurchaseService.create(req.user, createMaterialPurchaseDto);
  }


}
