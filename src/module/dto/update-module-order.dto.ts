// update-module-order.dto.ts
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ModuleOrderDto {
  @Type(() => Number)
  id: number;

  @Type(() => Number)
  order: number;
}

export class UpdateModuleOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleOrderDto)
  modules: ModuleOrderDto[];
}
