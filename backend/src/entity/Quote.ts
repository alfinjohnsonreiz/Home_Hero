import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ServiceRequest } from "./ServiceRequest";
import { ProviderProfile } from "./ProviderProfile";

export enum QuoteStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

@Entity()
export class Quote {
  @PrimaryGeneratedColumn()
  q_id!: number;

  @Column("decimal")
  price!: number;

  // @Column()
  // estimatedCompletionDays!:number;

  @Column({ type: "date", nullable: true })
  startDate?: Date;

  @Column({ type: "date", nullable: true })
  endDate?: Date;

  @Column("text", {
    nullable: true,
  })
  message?: string;

  @Column({
    type: "enum",
    enum: QuoteStatus,
    default: QuoteStatus.PENDING,
  })
  status!: QuoteStatus;

  //TODO Many quotes to one provider
  @ManyToOne(() => ProviderProfile, (providerprf) => providerprf.quotes)
  @JoinColumn({
    name: "providerprofileId",
  })
  providerprofile!: ProviderProfile;

  @Column()
  providerprofileId!: number;// fk

  //TODO !Many quotes belong to one serviceRequest
  @ManyToOne(() => ServiceRequest, (srvrq) => srvrq.quotes,{onDelete:"CASCADE"})
  @JoinColumn({
    name: "servicerequestId",
    
  })
  servicerequest!: ServiceRequest;
  @Column()
  servicerequestId!: number;//fk
}
