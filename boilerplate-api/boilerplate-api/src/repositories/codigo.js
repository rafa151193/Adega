import mongoose from "mongoose";
import Comentario from "../models/Comentario.js";
import Bebida from "../models/Bebida.js";

function validarObjectId(id, entidade = "registro") {
    if (!mongoose.isValidObjectId(id)) {
        throw new Error(`ID de ${entidade} inválido.`);
    }
}

export async function calcularMediaNotasPorBebida(
    bebidaId
) {
    validarObjectId(bebidaId, "bebida");

    const resultado = await Comentario.aggregate([
        {
            $match: {
                bebidaId: new mongoose.Types.ObjectId(
                    bebidaId
                ),
            },
        },
        {
            $group: {
                _id: "$bebidaId",
                mediaNota: { $avg: "$nota" },
                totalAvaliacoes: { $sum: 1 },
            },
        },
    ]);

    const media =
        resultado.length > 0
            ? resultado[0]
            : {
                  mediaNota: 0,
                  totalAvaliacoes: 0,
              };

    return {
        mediaNota: Number(media.mediaNota.toFixed(2)),
        totalAvaliacoes: media.totalAvaliacoes,
    };
}

async function atualizarMediaDaBebida(bebidaId) {
    const dados = await calcularMediaNotasPorBebida(
        bebidaId
    );

    await Bebida.findByIdAndUpdate(bebidaId, dados);
}

export async function criarComentario(dadosComentario) {
    const novoComentario = new Comentario(
        dadosComentario
    );

    const comentarioSalvo = await novoComentario.save();

    await atualizarMediaDaBebida(
        comentarioSalvo.bebidaId
    );

    return comentarioSalvo;
}

export async function listaComentarioPorBebida(
    bebidaId
) {
    validarObjectId(bebidaId, "bebida");

    return Comentario.find({ bebidaId })
        .populate("degustadorId", "nome apelido")
        .sort({ createdAt: -1 });
}

export async function buscarComentarioPorId(
    comentarioId
) {
    validarObjectId(comentarioId, "comentário");

    return Comentario.findById(comentarioId)
        .populate("bebidaId")
        .populate("degustadorId", "nome apelido");
}

export async function atualizarComentario(
    comentarioId,
    dadosAtualizados
) {
    validarObjectId(comentarioId, "comentário");

    const comentario = await Comentario.findByIdAndUpdate(
        comentarioId,
        dadosAtualizados,
        {
            new: true,
            runValidators: true,
        }
    );

    if (comentario) {
        await atualizarMediaDaBebida(
            comentario.bebidaId
        );
    }

    return comentario;
}

export async function deletarComentario(comentarioId) {
    validarObjectId(comentarioId, "comentário");

    const comentario =
        await Comentario.findByIdAndDelete(comentarioId);

    if (comentario) {
        await atualizarMediaDaBebida(
            comentario.bebidaId
        );
    }

    return comentario;
}
//deguxstador
import mongoose from "mongoose";
import Degustador from "../models/Degustador.js";

const listasPermitidas = [
    "aguardo",
    "lixo",
    "prateleira",
];

function validarObjectId(id, entidade = "registro") {
    if (!mongoose.isValidObjectId(id)) {
        throw new Error(`ID de ${entidade} inválido.`);
    }
}

function validarNomeLista(nomeLista) {
    if (!listasPermitidas.includes(nomeLista)) {
        throw new Error(
            "Lista inválida. Use aguardo, lixo ou prateleira."
        );
    }
}

export async function criarDegustador(
    dadosDegustador
) {
    const novoDegustador = new Degustador(
        dadosDegustador
    );

    return novoDegustador.save();
}

export async function listarDegustadores() {
    return Degustador.find()
        .populate("usuarioId", "nome email")
        .sort({ createdAt: -1 });
}

// Alias para preservar o nome usado anteriormente.
export const listaDegustador = listarDegustadores;

export async function buscarDegustadorPorID(
    degustadorId
) {
    validarObjectId(degustadorId, "degustador");

    return Degustador.findById(degustadorId)
        .populate("usuarioId", "nome email")
        .populate("aguardo")
        .populate("lixo")
        .populate("prateleira");
}

export async function buscarDegustadorPorUsuarioId(
    usuarioId
) {
    validarObjectId(usuarioId, "usuário");

    return Degustador.findOne({ usuarioId })
        .populate("usuarioId", "nome email")
        .populate("aguardo")
        .populate("lixo")
        .populate("prateleira");
}

export async function adicionarBebidaNaLista(
    degustadorId,
    nomeLista,
    bebidaId
) {
    validarObjectId(degustadorId, "degustador");
    validarObjectId(bebidaId, "bebida");
    validarNomeLista(nomeLista);

    return Degustador.findByIdAndUpdate(
        degustadorId,
        {
            $addToSet: {
                [nomeLista]: bebidaId,
            },
        },
        {
            new: true,
            runValidators: true,
        }
    ).populate(nomeLista);
}

export async function removerBebidaDaLista(
    degustadorId,
    nomeLista,
    bebidaId
) {
    validarObjectId(degustadorId, "degustador");
    validarObjectId(bebidaId, "bebida");
    validarNomeLista(nomeLista);

    return Degustador.findByIdAndUpdate(
        degustadorId,
        {
            $pull: {
                [nomeLista]: bebidaId,
            },
        },
        {
            new: true,
            runValidators: true,
        }
    ).populate(nomeLista);
}

export async function atualizarDegustador(
    degustadorId,
    dadosAtualizados
) {
    validarObjectId(degustadorId, "degustador");

    return Degustador.findByIdAndUpdate(
        degustadorId,
        dadosAtualizados,
        {
            new: true,
            runValidators: true,
        }
    );
}

export async function deletarDegustador(
    degustadorId
) {
    validarObjectId(degustadorId, "degustador");

    return Degustador.findByIdAndDelete(
        degustadorId
    );
}
//usuario
import mongoose from "mongoose";
import Usuario from "../models/Usuario.js";

function validarObjectId(id) {
    if (!mongoose.isValidObjectId(id)) {
        throw new Error("ID de usuário inválido.");
    }
}

export async function criarUsuario(dadosUsuario) {
    const novoUsuario = new Usuario(dadosUsuario);
    return novoUsuario.save();
}

export async function listarUsuarios() {
    return Usuario.find().sort({ createdAt: -1 });
}

export async function buscarUsuarioPorId(usuarioId) {
    validarObjectId(usuarioId);
    return Usuario.findById(usuarioId);
}

export async function buscarUsuarioPorEmail(email) {
    return Usuario.findOne({
        email: email.toLowerCase().trim(),
    });
}

export async function buscarUsuarioComSenhaPorEmail(
    email
) {
    return Usuario.findOne({
        email: email.toLowerCase().trim(),
    }).select("+senha");
}

export async function atualizarUsuario(
    usuarioId,
    dadosAtualizados
) {
    validarObjectId(usuarioId);

    const usuario = await Usuario.findById(usuarioId);

    if (!usuario) {
        return null;
    }

    Object.assign(usuario, dadosAtualizados);
    await usuario.save();

    return usuario;
}

export async function deletarUsuario(usuarioId) {
    validarObjectId(usuarioId);
    return Usuario.findByIdAndDelete(usuarioId);
}
