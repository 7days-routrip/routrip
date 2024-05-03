import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class Places {
  @PrimaryColumn({type:"varchar", length:50})
  id!: string;

  @Column({length:255})
  name!: string;

  @Column({length:512})
  address!: string;

  @Column({length:255, nullable:true})
  tel!: string;

  @Column({length:255})
  location!: string;

  @Column({length:255, nullable:true})
  openingHours!: string;

  @Column({length:512, nullable:true})
  siteUrl!: string;

  @Column({type:"blob", nullable:true})
  img!: Blob; //base64 데이터로 변경 
}
