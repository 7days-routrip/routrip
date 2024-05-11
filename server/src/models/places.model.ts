import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Picks } from "./picks.model";

@Entity()
export class Places {
  @OneToMany(() => Picks, (picks) => picks.place)
  @PrimaryColumn({ type: "varchar", length: 50 })
  id!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 512 })
  address!: string;

  @Column({ length: 255, nullable: true })
  tel!: string;

  @Column({ length: 255 })
  location!: string;

  @Column({ length: 255, nullable: true })
  openingHours!: string;

  @Column({ length: 512, nullable: true })
  siteUrl!: string;

  @Column({ length: 512, nullable: true })
  img!: string;
}
