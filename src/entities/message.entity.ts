/* tslint:disable:variable-name */
import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
export class Message {

  @PrimaryGeneratedColumn()
  message_id: number;

  @Column({length: 250})
  to: string;

  @Column({length: 250})
  subject: string;

  @Column({type: 'text', nullable: true})
  message: string;

  @Column({default: false})
  sent: boolean;
}
