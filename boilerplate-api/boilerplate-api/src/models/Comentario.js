import mongoose from "mongoose";

const comentarioSchema = new  mongoose.Schema(
    {
        bebidaId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Bebida",
            required:[true,"A bebida é obrigatoria."],
        },
        degustadorId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Degustador",
            required:[true,"O degustador é obrigatorio."]
        },
        nota:{
            type:Number,
            required:[true,"A nota é obrigatorio."],
            min:[0,"A nota minima é 0"],
            max:[10,"a nota maxima é 10"],
        },
        texto:{
            type:String,
            required:[true,"O texto é obrigatorio."],
            trim:true
        }
    },
    {timestamps : true}
)
const Comentario = mongoose.model("Comentario",comentarioSchema)
export default Comentario