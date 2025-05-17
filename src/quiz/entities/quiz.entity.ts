import { Course } from "src/course/entities/course.entity";
import { BaseEntity } from "src/Helper/base.entity";
import { Question } from "src/quiz/entities/question.entity";
import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { QuizAttempts } from "./quiz_attempts.entity";

@Entity()
export class Quiz extends BaseEntity {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ nullable: true })
    detail_description: string;

    @Column({
        type: 'int',
        default: 100,
    })
    passing_percentage: number;

    @Column({
        type: 'double precision',
        default: 1500,
        comment: "Seconds"
    })
    time_limit: number;

    @ManyToMany(() => Course, (course) => course.quizzes)
    courses: Course[];

    @OneToMany(() => Question, (questions) => questions.quiz, { eager: true })
    questions: Question[];

    @OneToMany(() => QuizAttempts, (quiz_attempts) => quiz_attempts.quiz)
    quiz_attempts: QuizAttempts[];
}
