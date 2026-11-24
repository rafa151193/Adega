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
    return await Bebida.findByIdAndUpdate(bebidaIs,dadosAtualizado,{
        new:true,
        runValidators:true
     })
}
export async function deletarBebida(bebidaId){
    return await Bebida.findByIdAndDelete(bebidaId)
}