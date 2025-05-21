import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class USER{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: true})
  name: string;

  @Column({ length: 100, unique : true })
  email: string;

  @Column()
  user_type: string;
}