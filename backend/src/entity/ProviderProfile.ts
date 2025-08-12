import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Quote } from "./Quote";
import { Review } from "./Review";
import { Job } from "./Job";
import { ProviderStatus, ServiceCategory } from "../types/types";

@Entity()
export class ProviderProfile {
  @PrimaryGeneratedColumn()
  p_id!: number;

  @Column({
    type: "enum",
    enum: ServiceCategory,
    nullable: true, // <-- important!
  })
  serviceCategory!: ServiceCategory;

  @Column({ type: "timestamp", nullable: true })
  createdAt?: Date;

  @Column()
  skills!: string;

  @Column()
  certification!: string;

  @Column({
    default: 0,
  })
  averageRating!: number;

  // NEW: Status
  @Column({
    type: "enum",
    enum: ProviderStatus,
    default: ProviderStatus.PENDING,
  })
  status!: ProviderStatus;

  //! one to one with user
  @OneToOne(() => User, (usr) => usr.providerprofile, { cascade: true })
  @JoinColumn() // <<< add this here
  user!: User;

  //TODO One to many with quotes
  @OneToMany(() => Quote, (quote) => quote.providerprofile)
  quotes!: Quote[];

  // TODO Review get
  @OneToMany(() => Review, (review) => review.providerprofile)
  reviews!: Review[];

  @OneToMany(() => Job, (job) => job.providerprofile)
  jobs!: Job[];
}
