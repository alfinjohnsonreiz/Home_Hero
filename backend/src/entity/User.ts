import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { HomeOwnerProfile } from "./HomeOwnerProfile";
import { ProviderProfile } from "./ProviderProfile";

export enum Role {
  HOMEOWNER = "homeowner",
  PROVIDER = "provider",
  ADMIN = "admin",
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  u_id!: number;

  @Column()
  name!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: "enum",
    enum: Role,
  })
  role!: Role;

  // ! one to one with homeowner
  @OneToOne(() => HomeOwnerProfile, (hm) => hm.user)
  homeownerprofile!: HomeOwnerProfile;
  // ! one to one with ProviderProfile
  @OneToOne(() => ProviderProfile, (prprf) => prprf.user)
  providerprofile!: ProviderProfile;
}
