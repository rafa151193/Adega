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