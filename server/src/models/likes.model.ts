import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Posts } from "./posts.model";
import { Users } from "./users.model";

@Entity()
export class Likes {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne((type) => Users, { eager: true })
  user!: Users;

  @ManyToOne((type) => Posts, { eager: true })
  post!: Posts;
}
