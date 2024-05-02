import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Continents, Countries } from "@/models/categories.model";
import { Journeys } from "./trips.model";
import { Users } from "./users.model";

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  title!: string;

  @Column("text")
  content!: string;

  @ManyToOne((type) => Users)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_users_posts_id",
  })
  userId!: Users;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  createdAt!: string;

  @Column("timestamp", { default: () => "ON UPDATE CURRENT_TIMESTAMP" })
  updatedAt!: string;

  @Column("varchar")
  expense!: string;

  @Column("datetime")
  startDate!: string;

  @Column("datetime")
  endDate!: string;

  @OneToOne((type) => Journeys)
  @JoinColumn({
    name: "journey_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_journeys_posts_id",
  })
  journeyId!: Journeys;

  @ManyToOne((type) => Continents)
  @JoinColumn({
    name: "coutinental_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_coutinental_posts_id",
  })
  continent!: Continents;

  @ManyToOne((type) => Countries)
  @JoinColumn({
    name: "country_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_country_posts_id",
  })
  country!: Countries;
}
