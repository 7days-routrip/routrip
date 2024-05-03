import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Posts } from "./posts.model";
import { Users } from "./users.model";

@Entity()
export class Likes {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne((type) => Users)
  @JoinColumn({
    name: "userId",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fkUsersLikesId",
  })
  userId!: Users;

  @ManyToOne((type) => Posts)
  @JoinColumn({
    name: "postId",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fkPostsLikesId",
  })
  postId!: Posts;
}
