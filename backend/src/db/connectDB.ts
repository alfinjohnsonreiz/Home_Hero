import { AppDataSource } from "./data-source"

export const connectDB=async()=>{
   try {
    await AppDataSource.initialize()
    console.log("data source initialized")
    
   } catch (error) {
    console.log(error)
   } 
}
