import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Routes {
  @PrimaryGeneratedColumn()
  id!: number;
}
