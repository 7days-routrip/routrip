import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Posts } from "./posts.model";
import { Users } from "./users.model";

@Entity()
export class Journeys {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  content!: string;

  @Column("datetime")
  startDate!: string;

  @Column("datetime")
  endDate!: string;

  @OneToOne((type) => Users)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_users_comments_id",
  })
  userId!: Users;

  @OneToOne((type) => Posts)
  @JoinColumn({
    name: "routes_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_posts_comments_id",
  })
  postId!: Posts;
}
