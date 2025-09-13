// material-public.dto.ts
import { Expose } from 'class-transformer';

export class MaterialPublicDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  // thumbnail_url removed - use download API instead

  @Expose()
  amount: number;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
