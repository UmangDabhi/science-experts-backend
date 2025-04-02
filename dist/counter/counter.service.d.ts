import { Repository } from 'typeorm';
import { Counter } from './counter.entity';
export declare class CounterService {
    private counterRepository;
    constructor(counterRepository: Repository<Counter>);
    getNextStudentId(): Promise<string>;
}
