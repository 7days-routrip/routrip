import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(["email"])
export class Users {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "email" })
  email!: string;

  @Column()
  nickName!: string;

  @Column()
  password!: string;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  createdAt!: string;

  @Column("varchar", { default: "일반", length: 50 })
  type!: string;
}
