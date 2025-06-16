import { College } from "src/college/entities/college.entity";
import { BaseEntity } from "src/Helper/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

export enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
    OTHERS = 'Others',
}

export enum AdmissionType {
    NIOS = 'NIOS',
    COLLEGE = 'COLLEGE',
    MBBS = 'MBBS',
}

export enum NiosClassType {
    TENTH = '10TH_CLASS',
    TWELFTH = '12TH_CLASS',
}

export enum MbbsLocation {
    INDIA = 'INDIA',
    ABROAD = 'ABROAD',
}

type RemarkEntry = {
    remark: string;
    time: string;
};


@Entity()
export class Admission extends BaseEntity {
    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    phone_no: string;

    @Column({ type: 'enum', enum: Gender })
    gender: Gender;

    @Column()
    dob: string;

    @Column({ type: 'enum', enum: AdmissionType })
    type: AdmissionType;

    @Column({ type: 'enum', enum: NiosClassType, nullable: true })
    nios_class_type?: NiosClassType;

    @Column({ type: 'enum', enum: MbbsLocation, nullable: true })
    mbbs_location?: MbbsLocation;

    @Column({ type: 'text', nullable: true })
    course_list?: string;

    @ManyToOne(() => College, (college) => college.admissions, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'college_id' })
    college?: College;

    @Column({ nullable: true })
    address?: string;

    @Column({ nullable: true })
    city?: string;

    @Column({ nullable: true })
    state?: string;

    @Column({ nullable: true })
    pincode?: string;

    @Column({ type: 'json', nullable: true })
    remarks?: RemarkEntry[];
}