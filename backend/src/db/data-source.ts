import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { HomeOwnerProfile } from "../entity/HomeOwnerProfile";
import { ProviderProfile } from "../entity/ProviderProfile";
import { ServiceRequest } from "../entity/ServiceRequest";
import { Quote } from "../entity/Quote";
import { Job } from "../entity/Job";
import { Payment } from "../entity/Payment";
import { Review } from "../entity/Review";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "userhomehero",
  password: "userhomehero",
  database: "taskhomehero_db",
  synchronize: true,
  logging: false,
  entities: [
    User,
    HomeOwnerProfile,
    ProviderProfile,
    ServiceRequest,
    Quote,
    Job,
    Payment,
    Review,
  ],
});
