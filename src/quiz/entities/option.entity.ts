import { BaseEntity } from "src/Helper/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Question } from "./question.entity";
import { Answer } from "./answer.entity";

@Entity()
export class Option extends BaseEntity {

    @Column()
    option_text: string;

    @Column({ default: false })
    is_correct: boolean;

    @ManyToOne(() => Question, (question) => question.options)
    @JoinColumn({ name: 'question_id' })
    question: Question;

    @OneToMany(() => Answer, (answers) => answers.selectedOption)
    answers: Answer[];
}
