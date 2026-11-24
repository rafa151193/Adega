import mongoose from "mongoose";

const schemaDegustador = new mongoose.Schema(
    {
        nome:{
            type:String,
            required:[true,"o nome do degustador é obrigatório."],
            trim:true
        },
        apelido:{
            type:String,
            trim:true
        },
        especialidade:{
            type:String,
            default:"Geral",
            trim:true
        },
        biografia:{
            type:String,
            maxlength:[300,"a biografia deve ter no maximo 300 caracteres."],
            trim:true
        },
        usuarioId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Usuario",
            required:[true,"O degustador deve estar vinculado a um usuário."]
        },
        ativo:{type:Boolean,
        default:true
    }
        
    },
    {timestamps:true}
)
const Degustador = mongoose.model("Degustador",schemaDegustador)
export default Degustador