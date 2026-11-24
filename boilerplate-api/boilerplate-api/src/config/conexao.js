import mongoose from "mongoose";
import dotenv from "dotenv"
import path from "node:path"
import { fileURLToPath } from "node:url";

const ___dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config({path:path.join(___dirname,".env")})

await mongoose.connect(process.env.MONGO_URI,{dbName:"Adega"})
console.log("Conectado ao MongoDB")

export default mongoose
