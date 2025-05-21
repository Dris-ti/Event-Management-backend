import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Unique,
  JoinColumn,
  OneToOne
} from 'typeorm';
import { USER } from './user.entity';
import { EVENT } from './event.entity';

@Entity()
export class BOOKING {
  @PrimaryGeneratedColumn()
  id: string;

  @OneToOne(() => USER, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user_id: USER;

  @OneToOne(() => EVENT, (event) => event.id, { nullable: false })
  @JoinColumn({ name: 'event_id' })
  event_id: EVENT;

  @Column()
  seats_booked: number;

  @CreateDateColumn()
  booked_at: Date;
}
