// Importar bibliotecas
const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const cors = require("cors")

// Configurar servidor
const app = express()
const PORT = 3000
app.use(cors())
app.use(express.json())

// Criar banco sqlite 
const db = new sqlite3.Database("./database.db")

// Criar tabela usuarios
db.run(`CREATE TABLE IF NOT EXISTS livros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    autor TEXT,
    anopubli TEXT,
    genero TEXT,
    idioma TEXT,
    preco REAL
    )
`)

app.get("/", async (req, res) => {
    res.json({
        "teste": "ok"
    })
})

// Cadastrar usuário
app.post("/livros", async (req, res) => {
    console.log(req.body);    

    let titulo = req.body.titulo
    let autor = req.body.autor
    let anopubli = req.body.anopubli
    let genero = req.body.genero
    let idioma = req.body.idioma
    let preco = req.body.preco

    // inserir no banco de dados
    db.run(`INSERT INTO livros (titulo, autor, anopubli, genero, idioma, preco) VALUES (?, ?, ?, ?, ?, ?)`,
        [titulo, autor, anopubli, genero, idioma, preco],
        function () {
            res.json({
                id: this.lastID,
                titulo, 
                autor, 
                anopubli, 
                genero, 
                idioma, 
                preco
            })
        }
    )
})

// Listar todos os usuários
app.get("/livros", (req, res) => {
    db.all(`SELECT id, titulo, autor, anopubli, genero, idioma, preco FROM livros`, [], (err, rows) =>{
        res.json(rows)
    })
})

// Selecionar um usuário
app.get("/livros/:id", (req, res) => {
    let idLivro = req.params.id;

    db.get(`SELECT id, titulo, autor, anopubli, genero, idioma, preco FROM livros
        WHERE id = ?`,
    [idLivro], (err, result) => {
        if(result){
            res.json(result)
        } else {
            res.status(404).json({
                "message" : "livro não encontrado."
            })
        }
    })
})

// Deletar usuário
app.delete("/livros/:id", (req, res) => {
    let idLivro = req.params.id

    db.run(`DELETE FROM livros WHERE id = ?`, 
    [idLivro], function(){
        // verifica se houve alteração no DB
        if(this.changes === 0){
            res.status(404).json({
                "message" : "livro não encontrado"
            })
        }

        res.json({
            "message" : "livro retirado da listagem"
        })
    })    
})

// Editar usuário
app.put("/livros/:id", async (req, res) => {
    let idLivro = req.params.id

    console.log(req.body);

    let titulo = req.body.novoTitulo
    let autor = req.body.novoAutor
    let anopubli = req.body.novoAnoPubli
    let genero = req.body.novoGenero
    let idioma = req.body.novoIdioma
    let preco = req.body.novoPreco

    db.run(`UPDATE livros SET titulo = ?, autor = ?, anopubli = ?, genero = ?, idioma = ?, preco = ?
        WHERE id = ?`, [titulo, autor, anopubli, genero, idioma, preco, idLivro],
        function(){
            res.json({
                "message" : "livro atualizado com sucesso"
            })
        })
})


// Iniciar o server
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));