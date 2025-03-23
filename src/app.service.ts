import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class AppService {
  constructor() {
    console.log(join(__dirname, '..', 'public'));
  }
  getHello(): string {
    return 'Hello World!';
  }
}
