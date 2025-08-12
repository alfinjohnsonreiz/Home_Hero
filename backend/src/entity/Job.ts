import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Quote } from "./Quote";
import { ServiceRequest } from "./ServiceRequest";
import { ProviderProfile } from "./ProviderProfile";
import { Review } from "./Review";
import { HomeOwnerProfile } from "./HomeOwnerProfile";

export enum JobStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
}
export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
}
@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  j_id!: number;

  @Column({
    type: "enum",
    enum: JobStatus,
    default: JobStatus.SCHEDULED,
  })
  status!: JobStatus;

  @Column({ type: "date", nullable: true })
  startDate?: Date;

  @Column({ type: "date", nullable: true })
  endDate?: Date;

  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus!: PaymentStatus;

  @Column("decimal", { nullable: true })
  price!: number;

  @Column({ default: false })
  isRecurring!: boolean;

  @Column({
    type: "enum",
    enum: ["weekly", "monthly"],
    nullable: true,
  })
  recurrenceFrequency?: "weekly" | "monthly";

  @Column({ type: "int", nullable: true, default: 1 })
  recurrenceInterval?: number;

  @Column({ type: "date", nullable: true })
  recurrenceEndDate?: Date;

  // ! next date of recurrence
  @Column("simple-array", { nullable: true })
   expectedRecurrenceDates?: string[];
   
  @Column("simple-array", { nullable: true })
    providerAvailableDates ?: string[];

  //TODO One to one with quote
  @OneToOne(() => Quote)
  @JoinColumn()
  quote!: Quote;

  // //TODO job links to service requests
  @OneToOne(() => ServiceRequest,{onDelete:"CASCADE"})
  @JoinColumn()
  servicerequest!: ServiceRequest;

  //TODO Many to one with provider and also homeowner
  @ManyToOne(() => ProviderProfile) //! Job assigned to one Provider
  providerprofile!: ProviderProfile;

  @ManyToOne(() => HomeOwnerProfile) //! Job belongs to one Homeowner
  homeownerprofile!: HomeOwnerProfile;

  //   TODO Review
  @OneToOne(() => Review, (review) => review.job)
  review!: Review;
}
