import mongoose from "mongoose";

const schemaComentario = new  mongoose.Schema(
    {
        bebidaId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Bebida",
            required:true
        },
        degustadorId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Degustador",
            required:true
        },
        nota:{
            type:Number,
            required:true,
            min:0,
            max:10
        },
        texto:{
            type:String,
            required:true,
            trim:true
        }
    },
    {timestamps : true}
)
export default mongoose.model("Comentario",schemaComentario)