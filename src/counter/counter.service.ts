import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Counter } from './counter.entity';

@Injectable()
export class CounterService {
  constructor(
    @InjectRepository(Counter)
    private counterRepository: Repository<Counter>,
  ) {}

  async getNextStudentId(): Promise<string> {
    let [counter] = await this.counterRepository.find();

    if (!counter) {
      counter = this.counterRepository.create();
      counter.lastStudentId = 1000;
      await this.counterRepository.save(counter);
    }

    const nextId = counter.lastStudentId + 1;
    counter.lastStudentId = nextId;
    await this.counterRepository.save(counter);

    return `CD_${nextId}`;
  }
}
