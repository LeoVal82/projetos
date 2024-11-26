import fs from "fs";
import {getTodosOsPosts, criarPost, atualizarPost} from "../models/postsModels.js";
import gerarDescricaoComGemini from "../services/geminiService.js";

export async function listarPosts(req, res) {
    // Chama a função para obter os posts e armazena o resultado.
        const posts = await getTodosOsPosts();
    // Envia os posts como resposta em formato JSON com status 200 (sucesso).
        res.status(200).json(posts);
}
// Exporta uma função assíncrona para criar um novo post.
export async function postarNovoPost(req, res) {
    // Obtém os dados do novo post enviados no corpo da requisição.
    const novoPost = req.body;
  
    // Bloco try-catch para tratamento de erros.
    try {
      // Chama a função criarPost para inserir o novo post no banco de dados.
      const postCriado = await criarPost(novoPost);
  
      // Retorna um status HTTP 200 (sucesso) e o post criado como JSON.
      res.status(200).json(postCriado);
    } catch (erro) {
      // Registra o erro no console para depuração.
      console.error(erro.message);
  
      // Retorna um status HTTP 500 (erro interno do servidor) e uma mensagem de erro genérica.
      res.status(500).json({ "Erro": "Falha na requisição" });
    }
  }

// Exporta uma função assíncrona para fazer upload de uma imagem e criar um novo post.
export async function uploadImagem(req, res) {
    // Cria um objeto para representar o novo post, com a descrição e o texto alternativo vazios.
    // A URL da imagem é definida como o nome original do arquivo enviado.
    const novoPost = {
      descricao: "",
      imgUrl: req.file.originalname,
      alt: ""
    };
  
    // Bloco try-catch para tratamento de erros.
    try {
      // Chama a função criarPost para inserir o novo post no banco de dados.
      const postCriado = await criarPost(novoPost);
  
      // Constrói o caminho completo para salvar a imagem.
      const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
  
      // Renomeia o arquivo temporário da imagem para o caminho definido.
      fs.renameSync(req.file.path, imagemAtualizada);
  
      // Retorna um status HTTP 200 (sucesso) e o post criado como JSON.
      res.status(200).json(postCriado);
    } catch (erro) {
      // Registra o erro no console para depuração.
      console.error(erro.message);
  
      // Retorna um status HTTP 500 (erro interno do servidor) e uma mensagem de erro genérica.
      res.status(500).json({ "Erro": "Falha na requisição" });
    }
  }

  export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`;
    
    
    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`)
        const descricao = await gerarDescricaoComGemini(imgBuffer);

        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }
        const postCriado = await atualizarPost(id, post);
        res.status(200).json(postCriado);
  
    } catch (error) {
        console.error(error.message);
        res.status(500).json({"Erro": "Falha na requisição"})
    }
  }

