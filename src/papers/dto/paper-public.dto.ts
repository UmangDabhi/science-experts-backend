import { Expose } from 'class-transformer';

export class PaperPublicDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  // thumbnail_url removed - use download API instead

  @Expose()
  is_paid: boolean;

  @Expose()
  amount: number;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
