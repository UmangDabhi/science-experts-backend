import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { Question } from './entities/question.entity';
import { Option } from './entities/option.entity';
import { Answer } from './entities/answer.entity';
import { QuizAttempts } from './entities/quiz_attempts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, Question, Option, Answer, QuizAttempts])],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule { }
