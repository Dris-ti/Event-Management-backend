import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Unique
} from 'typeorm';
import { USER } from './user.entity';
import { EVENT } from './event.entity';

@Entity()
@Unique(['user', 'event'])

export class BOOKING {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => USER, user => user.id, { onDelete: 'CASCADE' })
  user: USER;

  @ManyToOne(() => EVENT, event => event.bookings, { onDelete: 'CASCADE' })
  event: Event;

  @Column()
  seats_booked: number;

  @CreateDateColumn()
  booked_at: Date;
}
