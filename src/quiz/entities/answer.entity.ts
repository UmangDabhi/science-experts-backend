import { BaseEntity } from "src/Helper/base.entity";
import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { QuizAttempts } from "./quiz_attempts.entity";
import { Question } from "./question.entity";
import { Option } from "./option.entity";

@Entity()
export class Answer extends BaseEntity {
    @ManyToOne(() => QuizAttempts, (attempt) => attempt.answers)
    @JoinColumn({ name: 'attempt_id' })
    attempt: QuizAttempts;

    @ManyToOne(() => Question, (question) => question.attemptedAnswers, { onDelete: "CASCADE" })
    @JoinColumn({ name: "question_id" })
    question: Question;

    @ManyToOne(() => Option, (selectedOption) => selectedOption.answers, { eager: true })
    @JoinColumn({ name: "selected_option_id" })
    selectedOption: Option;
}
