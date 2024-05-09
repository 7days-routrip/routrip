import { Continents } from "@/models/continents.model";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Countries } from "./countries.model";
import { Journeys } from "./journeys.model";
import { Users } from "./users.model";

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  title!: string;

  @Column("text")
  content!: string;

  @Column("blob", { nullable: true })
  postsImg!: string | undefined;

  @ManyToOne((type) => Users)
  user!: Users;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  createdAt!: string;

  @Column("timestamp", { default: () => "ON UPDATE CURRENT_TIMESTAMP" })
  updatedAt!: string;

  @Column("integer")
  expense!: number;

  @Column("date")
  startDate!: string;

  @Column("date")
  endDate!: string;

  @ManyToOne((type) => Journeys)
  journey!: Journeys;

  @ManyToOne((type) => Continents)
  continent!: Continents;

  @ManyToOne((type) => Countries)
  country!: Countries;
}
