import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column({ length: 100 })
  email!: string;

  @Index({ unique: true })
  @Column({ length: 50 })
  nickName!: string;

  @Column()
  password!: string;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  createdAt!: string;

  @Column("varchar", { length: 10, default: "일반"})
  type!: string;
}
