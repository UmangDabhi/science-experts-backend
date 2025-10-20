import { BaseEntity } from 'src/Helper/base.entity';
import { EMAIL_TEMPLATE_TYPE } from 'src/Helper/constants';
import { Column, Entity } from 'typeorm';

@Entity()
export class EmailTemplate extends BaseEntity {
  @Column({
    type: 'enum',
    enum: EMAIL_TEMPLATE_TYPE,
    unique: true,
  })
  type: EMAIL_TEMPLATE_TYPE;

  @Column({ type: 'varchar', length: 200 })
  subject: string;

  @Column({ type: 'text' })
  html_body: string;

  @Column({ type: 'text', nullable: true })
  text_body: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;
}