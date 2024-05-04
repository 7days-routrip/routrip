import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Routes } from "./routes.model";
import { Users } from "./users.model";
@Entity()
export class Journeys {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @ManyToOne((type) => Users)
  @JoinColumn({
    name: "userId",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fkUsersJourneysId",
  })
  userId!: Users | number;

  @ManyToOne((type) => Routes)
  @JoinColumn({
    name: "routeId",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fkRoutesJourneysId",
  })
  routeId!: Routes | number;

  @Column("date")
  startDate!: string;

  @Column("date")
  endDate!: string;
}

// @OneToOne((type) => Users)
// @JoinColumn({
//   name: "user_id",
//   referencedColumnName: "id",
//   foreignKeyConstraintName: "fk_users_journeys_id",
// })
// hotelId!: Users;
