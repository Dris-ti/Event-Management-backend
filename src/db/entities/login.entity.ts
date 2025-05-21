import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import {USER} from './user.entity';

@Entity()
export class LOGIN{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique : true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => USER, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user_id: USER;
}