// material-public.dto.ts
import { Expose } from 'class-transformer';

export class MaterialPublicDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  thumbnail_url?: string;

  @Expose()
  amount: number;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
