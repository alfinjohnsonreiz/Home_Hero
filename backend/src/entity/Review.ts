import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Job } from "./Job";
import { User } from "./User";
import { ProviderProfile } from "./ProviderProfile";
import { HomeOwnerProfile } from "./HomeOwnerProfile";

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  r_id!: number;

  @Column({
    type: "int",
  })
  stars!: number;

  @Column("text", {
    nullable: true,
  })
  comment!: string;

  //TODO one review for one job
  @OneToOne(() => Job, (job) => job.review,{onDelete:"CASCADE"})
  @JoinColumn()
  job!: Job;

  // Reviw given by home owner
  @ManyToOne(() => HomeOwnerProfile, (prpf) => prpf.reviews)
  homeownerprofile!: HomeOwnerProfile;

  // Review about the provider
  @ManyToOne(() => ProviderProfile, (prpf) => prpf.reviews)
  providerprofile!: ProviderProfile;
}
