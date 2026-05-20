import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';

export class AdminListQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  profileStatus?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
