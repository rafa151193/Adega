import mongoose from "mongoose";

import * as UsuarioRepository from "./repositories/UsuarioRepository.js";
import * as DegustadorRepository from "./repositories/DegustadorRepository.js";
import * as BebidaRepository from "./repositories/BebidaRepository.js";
import * as ComentarioRepository from "./repositories/ComentarioRepository.js";

import Usuario from "./models/Usuario.js";
import Degustador from "./models/Degustador.js";
import Bebida from "./models/Bebida.js";
import Comentario from "./models/Comentario.js";

const mongoUri =
    process.env.MONGODB_URI ??
    "mongodb://localhost:27017/adega";

async function limparDadosDoTeste() {
    const usuarios = await Usuario.find({
        email: {
            $in: [
                "ana@email.com",
                "carlos@email.com",
            ],
        },
    }).select("_id");

    const usuariosIds = usuarios.map(
        (usuario) => usuario._id
    );

    const degustadores = await Degustador.find({
        usuarioId: { $in: usuariosIds },
    }).select("_id");

    const degustadoresIds = degustadores.map(
        (degustador) => degustador._id
    );

    const bebidas = await Bebida.find({
        nome: {
            $in: [
                "Malbec Reserva",
                "Gin Botânico",
                "Pilsen Comum",
            ],
        },
    }).select("_id");

    const bebidasIds = bebidas.map(
        (bebida) => bebida._id
    );

    await Comentario.deleteMany({
        $or: [
            { degustadorId: { $in: degustadoresIds } },
            { bebidaId: { $in: bebidasIds } },
        ],
    });

    await Degustador.deleteMany({
        _id: { $in: degustadoresIds },
    });

    await Bebida.deleteMany({
        _id: { $in: bebidasIds },
    });

    await Usuario.deleteMany({
        _id: { $in: usuariosIds },
    });
}

try {
    await mongoose.connect(mongoUri);
    console.log("Conectado ao MongoDB:", mongoUri);

    await limparDadosDoTeste();

    console.log("\n--- criarUsuario: 2 usuários");

    const ana = await UsuarioRepository.criarUsuario({
        nome: "Ana Souza",
        email: "ana@email.com",
        senha: "senhaSegura123",
        perfil: "usuario",
    });

    const admin =
        await UsuarioRepository.criarUsuario({
            nome: "Carlos Admin",
            email: "carlos@email.com",
            senha: "adminPassword123",
            perfil: "admin",
        });

    console.log(ana.nome, "|", admin.nome);

    console.log("\n--- listarUsuarios");

    const usuarios =
        await UsuarioRepository.listarUsuarios();

    console.log(
        usuarios.length,
        "usuário(s) cadastrado(s)"
    );

    console.log(
        "\n--- buscarUsuarioPorEmail: ana@email.com"
    );

    const anaEncontrada =
        await UsuarioRepository.buscarUsuarioPorEmail(
            "ana@email.com"
        );

    console.log("Encontrado:", anaEncontrada?.nome);

    console.log(
        "\n--- criarDegustador: vinculando à Ana"
    );

    const degustadorAna =
        await DegustadorRepository.criarDegustador({
            nome: "Ana Sommelier",
            apelido: "Aninha",
            especialidade: "Vinhos e Destilados",
            biografia:
                "Apaixonada por sabores intensos.",
            usuarioId: ana._id,
        });

    console.log(
        "Degustador criado:",
        degustadorAna.nome,
        "-",
        degustadorAna.especialidade
    );

    console.log("\n--- criarBebida: 3 bebidas");

    const vinho =
        await BebidaRepository.criarBebida({
            nome: "Malbec Reserva",
            tipo: "Vinho Tinto",
            categoriaBacklog: "Prateleira",
            preco: 89.9,
            emDesconto: false,
            percentualDesconto: 0,
            combinacoesComidas: [
                "Carnes vermelhas",
                "Queijos curados",
            ],
            descricao:
                "Encorpado com notas de ameixa.",
        });

    const gin = await BebidaRepository.criarBebida({
        nome: "Gin Botânico",
        tipo: "Destilado",
        categoriaBacklog: "Aguardo",
        preco: 120,
        emDesconto: true,
        percentualDesconto: 20,
        possibilidadesDrinks: [
            "Gin Tônica",
            "Negroni",
        ],
        descricao:
            "Aromático com zimbro e cítricos.",
    });

    const cerveja =
        await BebidaRepository.criarBebida({
            nome: "Pilsen Comum",
            tipo: "Cerveja",
            categoriaBacklog: "Lixo",
            preco: 8.5,
            descricao:
                "Leve e refrescante para o dia a dia.",
        });

    console.log(
        vinho.nome,
        "|",
        gin.nome,
        "|",
        cerveja.nome
    );

    console.log("\n--- listarBebidas");

    const bebidas =
        await BebidaRepository.listarBebidas();

    console.log(
        bebidas.length,
        "bebida(s) no catálogo"
    );

    console.log(
        "\n--- listarBebidasComDesconto"
    );

    const comDesconto =
        await BebidaRepository.listarBebidasComDesconto();

    comDesconto.forEach((bebida) => {
        console.log(
            bebida.nome,
            "- Preço final: R$",
            bebida.precoFinal.toFixed(2)
        );
    });

    console.log(
        "\n--- atualizarBebida: Malbec com 15% de desconto"
    );

    const malbecAtualizada =
        await BebidaRepository.atualizarBebida(
            vinho._id,
            {
                emDesconto: true,
                percentualDesconto: 15,
            }
        );

    console.log(
        "Atualizada:",
        malbecAtualizada.nome,
        "- Desconto:",
        `${malbecAtualizada.percentualDesconto}%`
    );

    console.log(
        "\n--- buscarBebidasPorID: ID que não existe"
    );

    const bebidaNaoExiste =
        await BebidaRepository.buscarBebidasPorID(
            new mongoose.Types.ObjectId()
        );

    console.log(bebidaNaoExiste);

    console.log(
        "\n--- criarComentario e listar comentários do Malbec"
    );

    await ComentarioRepository.criarComentario({
        bebidaId: vinho._id,
        degustadorId: degustadorAna._id,
        nota: 9.5,
        texto:
            "Excelente custo-benefício e final longo.",
    });

    const comentarios =
        await ComentarioRepository.listaComentarioPorBebida(
            vinho._id
        );

    comentarios.forEach((comentario) => {
        console.log(
            comentario.degustadorId?.nome ??
                comentario.degustadorId,
            "- Nota:",
            comentario.nota,
            "-",
            comentario.texto
        );
    });

    console.log(
        "\n--- adicionar Malbec à prateleira da Ana"
    );

    const degustadorAtualizado =
        await DegustadorRepository.adicionarBebidaNaLista(
            degustadorAna._id,
            "prateleira",
            vinho._id
        );

    console.log(
        "Itens na prateleira:",
        degustadorAtualizado.prateleira.length
    );

    console.log(
        "\n--- deletarBebida: Pilsen Comum"
    );

    const removida =
        await BebidaRepository.deletarBebida(
            cerveja._id
        );

    console.log("Removida:", removida?.nome);

    const removidaDeNovo =
        await BebidaRepository.deletarBebida(
            cerveja._id
        );

    console.log(
        "Removendo de novo:",
        removidaDeNovo
    );

    console.log(
        "\n--- buscarBebidasPorID: ID com formato errado"
    );

    try {
        await BebidaRepository.buscarBebidasPorID(
            "abc"
        );
    } catch (erro) {
        console.log("ERRO:", erro.message);
    }
} catch (erro) {
    console.error(
        "\nFalha durante o teste:",
        erro.message
    );

    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
    console.log("\nConexão encerrada.");
}
