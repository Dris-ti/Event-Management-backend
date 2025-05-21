import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { BOOKING } from './booking.entity';

@Entity('events')
export class EVENT {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time', nullable: true })
  time: string;

  @Column()
  total_seats: number;

  @Column()
  available_seats: number;

  @Column({ nullable: true })
  image_url: string;

  @OneToMany(() => BOOKING, booking => booking.event)
  bookings: BOOKING[];
}
