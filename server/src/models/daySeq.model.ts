
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Places } from "./places.model";
import { RouteDays } from "./routeDays.model";
@Entity()
export class DaySeq {
  @PrimaryGeneratedColumn()
  id!: string;

  @ManyToOne((type) => RouteDays)
  @JoinColumn({
    name: "routeDayId",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fkRouteDaysDaySeqId",
  })
  routeDayId!: RouteDays;

  @Column({ type: "integer" })
  seq!: number;

  @ManyToOne(() => Places, (places) => places.id)
  @JoinColumn({
    name: "placeId",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fkDaySeqPlacesId",
  })
  placeId!: Places;
}
