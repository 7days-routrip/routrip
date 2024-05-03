import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Continents {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 30 })
  name!: string;
}
