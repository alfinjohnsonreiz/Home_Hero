// import { Entity,PrimaryGeneratedColumn,Column, OneToOne } from "typeorm";
// import { Job } from "./Job";


// export enum PaymentStatus{
//     PENDING="pending",
//     PAID="paid"
// }

// @Entity()
// export class Payment{
//     @PrimaryGeneratedColumn()
//     p_id!:number

//     @Column('decimal')
//     amount!:number;

//     @Column(
//         {
//             type:"enum",
//             enum:PaymentStatus,
//             default:PaymentStatus.PENDING
//         }
//     )
//     status!:PaymentStatus;

//     @Column(
//         {
//             type:"timestamp",
//             nullable:true
//         }
//     )
//     paidAt?:Date

//     //TODO one payment to one job
//     @OneToOne(
//         ()=>Job
//     )
//     job!:Job;

// }