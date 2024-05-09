import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Routes } from "./routes.model";
import { Users } from "./users.model";

@Entity()
export class Journeys {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @ManyToOne((type) => Users)
  user!: Users;

  @ManyToOne((type) => Routes)
  route!: Routes;

  @Column("date")
  startDate!: string;

  @Column("date")
  endDate!: string;
}
