import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class EVENT {
  @PrimaryGeneratedColumn()
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

  @Column({ default: 10 })
  max_seats: number;

  @Column()
  available_seats: number;

  @Column({ nullable: true })
  image_url: string;

  @Column('text', { array: true, nullable: true })
  tag?: string[];
}
