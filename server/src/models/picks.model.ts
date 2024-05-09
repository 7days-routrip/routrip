import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Places } from "./places.model";
import { Users } from "./users.model";

@Entity()
export class Picks {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne((type) => Users)
  user!: Users;

  @ManyToOne((type) => Places)
  place!: Places;
}
