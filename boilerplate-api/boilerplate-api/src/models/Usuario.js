import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const usuarioSchema = new mongoose.Schema(
    {
    nome:{
        type:String,
        required:[true,"o nome do usuário é obrigatorio."],
        trim:true,
    },
    email:{
        type:String,
        required:[true,"O e-mail é obrigatorio."],
        unique:true,
        lowercase:true,
        trim:true
    },
    senha:{
        type:String,
        required:[true,"A senha do usuário é obrigatória."],
        minlength:[6,"a senha deve tem pelo menos 6 caracteres."]
},
perfil:{
    type:String,
    enum:["admin","usuario"],
    default:"usuario"
},
ativo:{
    type:Boolean,
    default:true
}
},
{timestamps:true
}
)
usuarioSchema.pre("save",async function(proximo){
    if (!this.isModified("senha")){
        return proximo()
    }
    const saltGerado = await bcryptjs.genSalt(10)
    this.senha = await bcryptjs.hash(this.senha)
    proximo()
})
usuarioSchema.methods.compararSenha = async function(senhaIformada){
    return bcryptjs.compare(senhaIformada,this.senha)
}
usuarioSchema.methods.toJSON = function(){
    const objetoUsuario = this.toObject()
    delete objetoUsuario.senha
    return objetoUsuario
}
const Usuario = mongoose.model("Usuario",usuarioSchema)
export default Usuario

