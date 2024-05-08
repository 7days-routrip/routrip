import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Places {
  @PrimaryColumn({ type: "varchar", length: 50 })
  id!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 512 })
  address!: string;

  @Column({ length: 255, nullable: true })
  tel!: string;

  @Column({ length: 255 })
  location!: string;

  @Column({ length: 255, nullable: true })
  openingHours!: string;

  @Column({ length: 512, nullable: true })
  siteUrl!: string;

  @Column({ length: 512, nullable: true })
  img!: string; //base64 데이터로 변경
}
