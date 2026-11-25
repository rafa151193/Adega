//teste
import mongoose from "mongoose";
import * as UsuarioMod from "./UsuarioRepository.js";
import * as DegustadorMod from "./DegustadorRepository.js";
import * as BebidaMod from "./BebidaRepository.js";
import * as ComentarioMod from "./ComentarioRepository.js";

// Usa export default se existir; caso contrário, usa o named export com o mesmo nome
const UsuarioRepository = UsuarioMod.default ?? UsuarioMod.UsuarioRepository;
const DegustadorRepository = DegustadorMod.default ?? DegustadorMod.DegustadorRepository;
const BebidaRepository = BebidaMod.default ?? BebidaMod.BebidaRepository;
const ComentarioRepository = ComentarioMod.default ?? ComentarioMod.ComentarioRepository;

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/adega";

await mongoose.connect(mongoUri);
console.log("Conectado ao MongoDB:", mongoUri);

try {
    // USUÁRIOS
    console.log("\n--- criarUsuario: 2 usuários");
    const ana = await UsuarioRepository.criarUsuario({
        nome: "Ana Souza",
        email: "ana@email.com",
        senha: "senhaSegura123",
        perfil: "usuario",
    });
    const admin = await UsuarioRepository.criarUsuario({
        nome: "Carlos Admin",
        email: "carlos@email.com",
        senha: "adminPassword123",
        perfil: "admin",
    });
    console.log(ana.nome, "|", admin.nome);

    console.log("\n--- listarUsuarios");
    const usuarios = await UsuarioRepository.listarUsuarios();
    console.log(usuarios.length, "usuário(s) cadastrado(s)");

    console.log("\n--- buscarUsuarioPorEmail: ana@email.com");
    const anaEncontrada = await UsuarioRepository.buscarUsuarioPorEmail("ana@email.com");
    console.log("Encontrado:", anaEncontrada?.nome);

    // DEGUSTADORES
    console.log("\n--- criarDegustador: vinculando à Ana");
    const degustadorAna = await DegustadorRepository.criarDegustador({
        nome: "Ana Sommelier",
        apelido: "Aninha",
        especialidade: "Vinhos e Destilados",
        biografia: "Apaixonada por sabores intensos.",
        usuarioId: ana._id,
    });
    console.log("Degustador criado:", degustadorAna.nome, "-", degustadorAna.especialidade);

    // BEBIDAS
    console.log("\n--- criarBebida: 3 bebidas");
    const vinho = await BebidaRepository.criarBebida({
        nome: "Malbec Reserva",
        tipo: "Vinho Tinto",
        categoriaBacklog: "Prateleira",
        preco: 89.9,
        emDesconto: false,
        percentualDesconto: 0,
        combinacoesComidas: ["Carnes vermelhas", "Queijos curados"],
        descricao: "Encorpado com notas de ameixa.",
    });
    const gin = await BebidaRepository.criarBebida({
        nome: "Gin Botânico",
        tipo: "Destilado",
        categoriaBacklog: "Aguardo",
        preco: 120.0,
        emDesconto: true,
        percentualDesconto: 20,
        possibilidadesDrinks: ["Gin Tônica", "Negroni"],
        descricao: "Aromático com zimbro e cítricos.",
    });
    const cerveja = await BebidaRepository.criarBebida({
        nome: "Pilsen Comum",
        tipo: "Cerveja",
        categoriaBacklog: "Lixo",
        preco: 8.5,
        descricao: "Leve e refrescante para o dia a dia.",
    });
    console.log(vinho.nome, "|", gin.nome, "|", cerveja.nome);

    console.log("\n--- listarBebidas");
    const bebidas = await BebidaRepository.listarBebidas();
    console.log(bebidas.length, "bebida(s) no catálogo");

    console.log("\n--- listarBebidasComDesconto");
    const comDesconto = await BebidaRepository.listarBebidasComDesconto();
    comDesconto.forEach((b) => {
        console.log(b.nome, "- Preço final: R$", b.precoFinal);
    });

    console.log("\n--- atualizarBebida: Malbec com 15% de desconto");
    const malbecAtualizada = await BebidaRepository.atualizarBebida(vinho._id, {
        emDesconto: true,
        percentualDesconto: 15,
    });
    console.log("Atualizada:", malbecAtualizada.nome, "- Desconto:", malbecAtualizada.percentualDesconto + "%");

    console.log("\n--- buscarBebidasPorID: _id que não existe");
    const bebidaNaoExiste = await BebidaRepository.buscarBebidasPorID("665f1c2e9b1d4a3f8c7e9999");
    console.log(bebidaNaoExiste);

    // COMENTÁRIOS
    console.log("\n--- criarComentario e listaComentarioPorBebida: avaliações do Malbec");
    await ComentarioRepository.criarComentario({
        bebidaId: vinho._id,
        degustadorId: degustadorAna._id,
        nota: 9.5,
        texto: "Excelente custo-benefício e final longo.",
    });
    const comentarios = await ComentarioRepository.listaComentarioPorBebida(vinho._id);
    comentarios.forEach((c) => {
        console.log(c.degustadorId?.nome ?? c.degustadorId, "- Nota:", c.nota, "-", c.texto);
    });

    // REMOVER
    console.log("\n--- deletarBebida: Pilsen Comum");
    const removida = await BebidaRepository.deletarBebida(cerveja._id);
    console.log("Removida:", removida?.nome);
    const removidaDeNovo = await BebidaRepository.deletarBebida(cerveja._id);
    console.log("Removendo de novo:", removidaDeNovo);

    console.log("\n--- buscarBebidasPorID: _id com formato errado");
    try {
        await BebidaRepository.buscarBebidasPorID("abc");
    } catch (erro) {
        console.log("ERRO:", erro.message);
    }
} finally {
    await mongoose.disconnect();
    console.log("\nConexão encerrada.");
}

//Bebida.js
import mongoose from "mongoose";

const schemaBebida = new mongoose.Schema(
    {
        nome:{type:String,
            required:[true,"o nome da bebida é obrigatório."],
            trim:true
        },
        tipo:{
            type:String,
            required:[true,"O tipo da bebida é obrigatorio."],
            trim:true
        },
        categoriaBacklog:{
            type:String,
            enum:{
                values:["Aguardo","Lixo","Pratilheira"],
                message:"A categoria deve ser Aguardo,Lixo ou Pratilheira."
            },
            default:"Aguardo"
        },
        preco:{
            type:Number,
            required:[true,"O preço da bebida é obrigatorio."],
            min:[0,"O preoc não pode ser negativo."]
        },
        emDesconto:{
            type:Boolean,
            default:false
        },
        percentualDesconto:{
            type:Number,
            default:0,
            min:[0,"O desconto naõ pode ser menor que 0%."],
            max:[100,"O desconto não pode ser mais que 100%."]
        },
        possibilidadesDrinks:{
            type:[String],
            default:[]
        },
        combinacoesComidas:{
            type:[String],
            default:[]
        },
        mediaNota:{
            type:Number,
            default:0,
            min:0,
            max:10
        },
        totalAvaliacoes:{
            type:Number,
            default:0,
            min:0
        },
        descricao:{
            type:String,
            trim:true
        }
    },
    {timestamps: true}
)

schemaBebida.virtual("precoFinal").get(function(){
    if (!this.emDesconto || this.percentualDesconto <= 0){
        return this.preco
    }
    const valorDesconto = (this.preco * this.percentualDesconto)/100
    return Number((this.preco - valorDesconto).toFixed(2))
})

schemaBebida.set("toJSON",{virtuals:true})
schemaBebida.set("toObject",{virtuals:true})

const Bebida = mongoose.model("Bebida", schemaBebida);
export default Bebida
//comentario.js
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

//Degustador.js
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

//Usuario.js

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
        return 
    }
    const saltGerado = await bcryptjs.genSalt(10)
    this.senha = await bcryptjs.hash(this.senha,saltGerado)
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

//BebidaRepository.js

import Bebida from '../models/Bebida.js'

export async function criarBebida(dadosBebida){
    const novaBebida = new Bebida(dadosBebida)
    return await novaBebida.save()
}
export async function  listarBebidas(filtros = {}){
    return await Bebida.find(filtros).sort({createdAt:-1})
}
export async function buscarBebidasPorID(bebidaId){
    return await Bebida.findById(bebidaId)
} 
export async function listarBebidasComDesconto(){
    return await Bebida.find({desconto:true}).sort({createdAt:-1})
}
export async function listarBebidasPorStatusBacklog(statusBacklog){
    return await Bebida.find({backlog:statusBacklog}).sort({createdAt: -1})
}
export async function listarBebidasPorNotaMinima(notaMinima){
    return await Bebida.find({notaMedia:{$gte:notaminima}}).sort({
        notaMedia:-1,
    })
}
export async function atualizarBebida(bebidaIs,dadosAtualizado){
    return await Bebida.findByIdAndUpdate(bebidaId,dadosAtualizado,{
        new:true,
        runValidators:true
     })
}
export async function deletarBebida(bebidaId){
    return await Bebida.findByIdAndDelete(bebidaId)
}
//ComentarioRepository.js

import mongoose from 'mongoose' 
import Comentario from '../models/Comentario.js'


export async function criarComentario(dadosComentario){
    const novoComentario = new Comentario(dadosComentario)
    return await novoComentario.save()
}

export async function listaComentarioPorBebida(bebidaId){
    return await Comentario.find({bebida:bebidaId})
    .populate('degustador')
    .sort({createAt: -1})
}

export async function buscarComentarioPorId(comentarioId){
    return await Comentario.findById(comentarioId)
    .populate('bebida')
    .populate('degustador')
}

/*export async function calcularMediaNotasPorBebida(bebidaId){
    const resultado = await Comentario.aggregate([
        {$match:{bebida:new mongoose.Types.ObjectId(bebidaId)}},
        {
            $group:{
                _id:'$bebida',
                notaMedia:{$avg:'$nota'},
                totalAvalicoes:{$sum:1},
            },
        },
    ])
    return resultado.length > 0 ? resultado[0]:{notaMedia:0,totalAvalicoes:0}
}*/
export async function atualizarComentario(comentarioId,dadosAtualizados){
    return await Comentario.findByIdAndUpdate(comentarioId,dadosAtualizados,{
        new:true,
        runValidatores:true,
    })
}
export async function deletarComentario(comentarioId){
    return await Comentario.findBydAndDelete(comentarioId)
}

//DegustadorRepository.js
import Degustador from '../models/Degustador.js'

export async function criarDegustador(dadosDegustador){
    const novoDegustador = new Degustador(dadosDegustador)
    return await novoDegustador.save()
}

export async function listaDegustador(){
    return await novoDegustador.find().populate('usuario','nome email')
}

export async function buscarDegustadorPorID(degustadorId){
    return await Degustador.findById(degustadorId)
    .populate('usuario','nome email')
    .populate('agurdo')
    .populate('lixo')
    .populate('prateleira')
}

export async function buscarDegustadorPorUsuarioId(){
    return await Degustador.findOne({usuario: usuarioId})
    .populate('agurdo')
    .populate('lixo')
    .populate('prateleira')
}

export async function adicionarBebidaNaLista(degustadorId,nomeLista,bebidaId){
    return await Degustador.findByIdAndUpdate(
        degustadorId,
        {$addToSet:{[nomeLista]:bebidaId}},
        {new:true}
    )
}

export async function removerBebidaDaLista(degustadorId,nomeLista,bebidaId){
    return await Degustador.findByIdAndUpdate(
        degustadorId,
        {$pull:{[nomeLista]:bebidaId}},
        {new:true}
    )
}

export async function atualizarDegustador(degustadorId,dadosAtualizados){
    return await Degustador.findByIdAndUpdate(buscarDegustadorPorUsuarioId,dadosAtualizados,{
        new:true,
        runValidators:true
    })
}

export async function deletarDegustador(degustadorId){
    return await Degustador.findByIdAndDelete(degustadorId)
}
//UsuarioRepository.js
import Usuario from '../models/Usuario.js'

export async function criarUsuario(dadosUsuario){
    const novoUsuario = new Usuario(dadosUsuario)
    return await novoUsuario.save()
}

export async function listarUsuarios(dadosUsuario){
    return await Usuario.find().select('-senha')
}

export async function buscarUsuarioPorId(usuarioId){
    return await Usuario.findById(usuarioId).select('-senha')
}

export async function buscarUsuarioPorEmail(email){
    return await Usuario.findOne({email})
}

export async function atualizarUsuario(usuarioId,dadosAtualizados){
    return await Usuario.findByIdAndUpdate(usuarioId,dadosAtualizados,{
        new:true,
        runValidators:true,
    }).select('-senha')
}

export async function deletarUsuario(usuarioId){
    return await Usuario.findByIdAndDelete(usuarioId)
}