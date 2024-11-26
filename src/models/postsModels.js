import 'dotenv/config';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbconfig.js";

// Conecta ao banco de dados usando a string de conexão fornecida como variável de ambiente.
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO)

// Função assíncrona para obter todos os posts do banco de dados.
export async function getTodosOsPosts() {
    // Obtém o banco de dados 'imersao-projetobkend' da conexão.
        const db = conexao.db("imersao-projetobkend");
    // Obtém a coleção 'posts' dentro do banco de dados.
        const colecao = db.collection("posts");
    // Retorna um array com todos os documentos da coleção.
        return colecao.find().toArray();
}

export async function criarPost(novoPost) {
    const db = conexao.db("imersao-projetobkend");
    const colecao = db.collection("posts");
    return colecao.insertOne(novoPost);
}

export async function atualizarPost(id, novoPost) {
    const db = conexao.db("imersao-projetobkend");
    const colecao = db.collection("posts");
    const objID = ObjectId.createFromHexString(id);
    return colecao.updateOne({_id: new ObjectId(objID)}, {$set:novoPost});
}