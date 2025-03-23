import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 10, nullable: true })
  method: string; // HTTP method (GET, POST, etc.)

  @Column('varchar', { length: 255, nullable: true })
  url: string; // Request URL

  @Column('json', { nullable: true })
  requestBody: any; // Request body data

  @Column('json', { nullable: true })
  responseBody: any; // Response body data

  @Column('varchar', { nullable: true })
  requestUser: string; // ID or username of the requester

  @Column('int', { nullable: true })
  statusCode: number; // HTTP response status code

  @CreateDateColumn()
  timestamp: Date; // Timestamp of the log entry

  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  executionTime: number; // Time taken for request execution in milliseconds

  @Column('text', { nullable: true })
  error: string; // Error message, if any
}
