import { Continents } from "@/models/continents.model";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

  @Column("varchar", { length: 512, nullable: true })
  postsImg!: string | undefined;

  @ManyToOne((type) => Users, { eager: true })
  user!: Users;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  createdAt!: string;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  @UpdateDateColumn()
  updatedAt!: string;

  @Column("integer")
  expense!: number;

  @Column("date")
  startDate!: string;

  @Column("date")
  endDate!: string;

  @ManyToOne((type) => Journeys, { eager: true })
  journey!: Journeys;

  @ManyToOne((type) => Continents, { eager: true })
  continent!: Continents;

  @ManyToOne((type) => Countries, { eager: true })
  country!: Countries;
}
