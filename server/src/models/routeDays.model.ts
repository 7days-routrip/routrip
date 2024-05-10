import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Routes } from "./routes.model";

@Entity()
export class RouteDays {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne((type) => Routes)
  route!: Routes;

  @Column("integer", { nullable: true })
  day!: number;
}
