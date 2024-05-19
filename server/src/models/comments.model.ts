import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Posts } from "./posts.model";
import { Users } from "./users.model";

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 1000, nullable: false })
  content!: string;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  createdAt!: string;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  @UpdateDateColumn()
  updatedAt!: string;

  @ManyToOne((type) => Users, { eager: true })
  user!: Users;

  @ManyToOne((type) => Posts, { eager: true })
  post!: Posts;
}
