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