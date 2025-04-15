export class MaterialPaidDto {
  id: string;
  title: string;
  description: string;
  material_url: string;
  thumbnail_url?: string;
  amount: number;
  categories: any[];
}
