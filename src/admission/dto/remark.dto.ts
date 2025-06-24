import { IsString } from 'class-validator';

export class RemarkDto {
    @IsString()
    remark: string;
}
