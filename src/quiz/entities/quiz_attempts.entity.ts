import { BaseEntity } from "src/Helper/base.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Quiz } from "./quiz.entity";
import { Answer } from "./answer.entity";

@Entity()
export class QuizAttempts extends BaseEntity {
    @Column({ type: "timestamptz" })
    start_time: Date;

    @Column({ type: "timestamptz" })
    submitted_at: Date;

    @Column({ type: "double precision", nullable: true })
    score: number;

    @ManyToOne(() => User, (student) => student.quiz_attempts, { eager: false })
    @JoinColumn({ name: 'student_id' })
    student: User;

    @ManyToOne(() => Quiz, (quiz) => quiz.quiz_attempts, { eager: false })
    @JoinColumn({ name: 'quiz_id' })
    quiz: Quiz;

    @OneToMany(() => Answer, (answers) => answers.attempt,)
    answers: Answer[];
}
