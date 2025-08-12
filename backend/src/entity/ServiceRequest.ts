import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Quote } from "./Quote";
import { HomeOwnerProfile } from "./HomeOwnerProfile";
import { Job } from "./Job";
import { ServiceCategory } from "../types/types";

@Entity()
export class ServiceRequest {
  @PrimaryGeneratedColumn()
  s_id!: number;

  @Column()
  title!: string;

  @Column("text")
  description!: string;

  @Column({
    type: "enum",
    enum: ServiceCategory,
  })
  category!: ServiceCategory;

  @Column({ default: false })
  urgent!: boolean;

  @Column()
  location!: string;

  @Column("simple-array", { nullable: true })
  photos?: string[];

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  isRecurring!: boolean;

  @Column({
    type: "enum",
    enum: ["weekly", "monthly"],
    nullable: true,
  })
  recurrenceFrequency?: "weekly" | "monthly";

  @Column({ type: "int", nullable: true })
  recurrenceInterval?: number;

  @Column({ type: "date", nullable: true })
  recurrenceEndDate?: Date;
  
  //TODO Many ServiceRequests belong to one Homeowner (User with role HOMEOWNER)
  @ManyToOne(() => HomeOwnerProfile, (user) => user.servicerequests)
  homeownerprofile!: HomeOwnerProfile;

  //! One ServiceRequest can have multiple Quotes
  @OneToMany(() => Quote, (quote) => quote.servicerequest)
  quotes!: Quote[];

  // ! for job
  @OneToOne(() => Job, (job) => job.servicerequest)
  job!: Job;
}
