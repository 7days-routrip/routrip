
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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

  @Column("timestamp", { default: () => "ON UPDATE CURRENT_TIMESTAMP" })
  updatedAt!: string;

  @ManyToOne((type) => Users)
  @JoinColumn({
    name: "userId",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fkUsersCommentsId",
  })
  userId!: Users | number;

  @ManyToOne((type) => Posts)
  @JoinColumn({
    name: "postId",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fkPostsCommentsId",
  })
  postId!: Posts | number;
}

