import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Picks } from "./picks.model";

@Entity()
export class Places {
  @PrimaryColumn({ type: "varchar", length: 50 })
  id!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 512 })
  address!: string;

  @Column({ length: 255, nullable: true })
  tel!: string;

  @Column({
    length: 255,
    transformer: { from: (value) => value.split(","), to: (value) => value },
  })
  location!: string;

  @Column({ length: 255, nullable: true })
  openingHours!: string;

  @Column({ length: 512, nullable: true })
  siteUrl!: string;

  @Column({ length: 512, nullable: true })
  img!: string;
}
