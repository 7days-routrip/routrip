import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Continents } from "./continents.model";

@Entity()
export class Countries {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne((type) => Continents)
  continent!: Continents;

  @Column("varchar", { length: 100 })
  name!: string;
}
