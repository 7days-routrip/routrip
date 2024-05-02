import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.model";

@Entity()
export class Journeys {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  title!: string;

  @OneToOne((type) => Users)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_users_journeys_id",
  })
  userId!: Users;

  @OneToOne((type) => Routes)
  @JoinColumn({
    name: "routes_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_routes_journeys_id",
  })
  routeId!: Routes;

  @Column("datetime")
  startDate!: string;

  @Column("datetime")
  endDate!: string;
}

@Entity()
export class Routes {
  @PrimaryGeneratedColumn()
  id!: number;
}

// @OneToOne((type) => Users)
// @JoinColumn({
//   name: "user_id",
//   referencedColumnName: "id",
//   foreignKeyConstraintName: "fk_users_journeys_id",
// })
// hotelId!: Users;
