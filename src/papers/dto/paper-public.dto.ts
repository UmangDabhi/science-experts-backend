import { Expose } from 'class-transformer';

export class PaperPublicDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  thumbnail_url?: string;

  @Expose()
  is_paid: boolean;

  @Expose()
  amount: number;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
