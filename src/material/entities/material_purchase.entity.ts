import { BaseEntity } from 'src/Helper/base.entity';
import { Material } from 'src/material/entities/material.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

@Entity()
@Unique(['student', 'material'])
export class MaterialPurchase extends BaseEntity {
    @ManyToOne(() => User, (user) => user.material_purchases)
    @JoinColumn({ name: 'student_id' })
    student: User;

    @ManyToOne(() => Material, (material) => material.material_purchases)
    @JoinColumn({ name: 'material_id' })
    material: Material;

    @Column({ nullable: true })
    feedback: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    enrolled_at: Date;

    @Column({ nullable: true })
    completed_at: Date;
}
