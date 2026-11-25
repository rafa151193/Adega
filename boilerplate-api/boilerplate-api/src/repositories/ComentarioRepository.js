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