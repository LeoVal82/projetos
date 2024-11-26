import express from "express";
import multer from "multer";
import cors from "cors";
import {listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost} from "../controlers/postsControles.js";

const corsOptions = {
    origin: "http://localhost:8000",
    optionSuccssesStatus: 200
}

// Configura o armazenamento de arquivos utilizando o multer.
const storage = multer.diskStorage({
    // Define o diretório de destino para os arquivos carregados.
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    // Define o nome do arquivo. Neste caso, mantém o nome original.
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });

const upload = multer({ dest: "./uploads" , storage})

const routes = (app) => {
// Permite que o Express entenda requisições com corpo no formato JSON.
    app.use(express.json());
    app.use(cors(corsOptions));
    // Rota para obter todos os posts.
    app.get("/posts", listarPosts);
    //Rota para criar um novo post.
    app.post("/posts", postarNovoPost);
    app.post("/upload", upload.single("imagem"), uploadImagem);

    app.put("/upload/:id", atualizarNovoPost)
};



export default routes;