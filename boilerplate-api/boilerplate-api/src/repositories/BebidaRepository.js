import mongoose from 'mongoose'
import Bebida from '../models/Bebida.js'

function validarObjectId(id){
    if(!mongoose.isValidObjectId(id)){
        throw new Error("ID bebida invalido.")
    }
}

export async function criarBebida(dadosBebida){
    const novaBebida = new Bebida(dadosBebida)
    return novaBebida.save()
}
export async function  listarBebidas(filtros = {}){
    return  Bebida.find(filtros).sort({createdAt:-1})
}
export async function buscarBebidasPorID(bebidaId){
    validarObjectId(bebidaId)
    return Bebida.findById(bebidaId)
} 
export async function listarBebidasComDesconto(){
    return Bebida.find({
        emDesconto:true,
        percentulDesconto:{$gt:0},
    }).sort({createdAt:-1})
}
export async function listarBebidasPorStatusBacklog(notaMinima){
    return Bebida.find({
        categoriaBacklog:statusBacklog,
    }).sort({createdAt:-1})
}
export async function listaBebidasPorNotaMinima(notaMinima){
    return Bebida.find({mediaNota:{$gte:notaMinima},
    }).sort({mediaNota:-1})
}

export async function atualizarBebida(bebidaIs,dadosAtualizado){
    validarObjectId(bebidaIs)
    return Bebida.findByIdAndUpdate(bebidaId,dadosAtualizado,{
        new:true,
        runValidators:true
     })
}
export async function deletarBebida(bebidaId){
    validarObjectId(bebidaId)
    return await Bebida.findByIdAndDelete(bebidaId)
}