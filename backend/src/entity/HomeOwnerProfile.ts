import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { ServiceRequest } from "./ServiceRequest";
import { Review } from "./Review";
import { Job } from "./Job";

@Entity()
export class HomeOwnerProfile {
  @PrimaryGeneratedColumn()
  h_id!: number;

  @Column()
  contactNumber!: string;

  @Column()
  address!: string;

  @Column({ type: "timestamp", nullable: true })
  createdAt?: Date;

  //! one to one with user
  @OneToOne(() => User, (usr) => usr.homeownerprofile, { cascade: true })
  @JoinColumn() // <- Tells TypeORM this is the owning side (good)
  user!: User;

  //TODO One to many with service request
  @OneToMany(() => ServiceRequest, (src) => src.homeownerprofile)
  servicerequests!: ServiceRequest[];

  // TODO can give review by using jobs
  @OneToMany(() => Review, (rvw) => rvw.homeownerprofile)
  reviews!: Review[];

  @OneToMany(() => Job, (job) => job.homeownerprofile)
  jobs!: Job[];
}
