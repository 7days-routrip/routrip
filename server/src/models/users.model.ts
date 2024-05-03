
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id!: number;


  @Column({ length: 100 })
  @Index({ unique: true })
  email!: string;

  @Column({ length: 50 })
  @Index({ unique: true })
  nickName!: string;

  @Column()
  password!: string;


  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  createdAt!: string;

  @Column("varchar", { default: "일반", length: 10 })
  type!: string;
}
