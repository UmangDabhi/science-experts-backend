import { BaseEntity } from 'src/Helper/base.entity';
import { Material } from 'src/material/entities/material.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';

@Entity()
@Unique(['student', 'material'])
export class MaterialPurchase extends BaseEntity {
    @Index()
    @ManyToOne(() => User, (user) => user.material_purchases)
    @JoinColumn({ name: 'student_id' })
    student: User;

    @Index()
    @ManyToOne(() => Material, (material) => material.material_purchases)
    @JoinColumn({ name: 'material_id' })
    material: Material;

    @Column({ nullable: true })
    feedback: string;

    @Index()
    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    enrolled_at: Date;

    @Index()
    @Column({ nullable: true })
    completed_at: Date;
}
