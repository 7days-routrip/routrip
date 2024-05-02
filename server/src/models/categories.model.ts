import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Continents {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
}

@Entity()
export class Countries {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne((type) => Continents)
  @JoinColumn({
    name: "continental_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_country_coutinental_id",
  })
  continentalId!: Continents;

  @Column()
  name!: string;
}
