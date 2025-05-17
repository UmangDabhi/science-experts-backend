import { BaseEntity } from "src/Helper/base.entity";
import { QUESTION_TYPE } from "src/Helper/constants";
import { Quiz } from "src/quiz/entities/quiz.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Option } from "./option.entity";
import { Answer } from "./answer.entity";

@Entity()
export class Question extends BaseEntity {
    @Column()
    question_text: string;

    @Column({
        enum: QUESTION_TYPE,
        default: QUESTION_TYPE.MCQ,
    })
    question_type: string;

    @Column({
        type: "int",
        default: 10,
    })
    marks: number;

    @ManyToOne(() => Quiz, (quiz) => quiz.questions)
    @JoinColumn({ name: 'quiz_id' })
    quiz: Quiz;

    @OneToMany(() => Option, (options) => options.question, { eager: true })
    options: Option[];

    @OneToMany(() => Answer, (attemptedAnswers) => attemptedAnswers.question)
    attemptedAnswers: Answer[];
}
