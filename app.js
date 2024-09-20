// importar express
// importar handlebars
// importar body-parser

const express = require("express");
const app = express();
const handlebars = require("express-handlebars").engine;
const bodyParser = require("body-parser");
const post = require("./models/post");

// Configuração do Handlebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rotas
app.get("/", function(req, res) {
    res.render("primeira_pagina");
});

app.post("/cadastrar", function(req, res) {
    post.create({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    })
    .then(function() {
        console.log("Dados cadastrados com sucesso!");
        res.send("Dados cadastrados com sucesso");
    })
    .catch(function() {
        console.log("Erro ao gravar os dados na entidade");
    });
});

app.get("/consulta", function(req, res) {
    post.findAll().then(function(posts) {
        res.render("segunda_pagina.handlebars", { posts });
        console.log(posts);
    });
});

app.get("/editar/:id", function(req, res) {
    post.findAll({ where: { 'id': req.params.id } }).then(
        function(posts) {
            res.render("terceira_pagina", { posts });
            console.log(posts);
        }
    );
});

app.post('/atualizar', function(req, res) {
    post.update({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }, {
        where: {
            id: req.body.id
        }
    }).then(function() {
        res.send("Dados atualizados com sucesso!");
    });
});

// Rota para confirmar exclusão
app.get('/excluirPerfil/:id', (req, res) => {
    post.findAll({ where: { 'id': req.params.id } }).then(
        function(posts) {
            res.render("confirmar_exclusao", { posts });
            console.log(posts);
        }
    );
});

app.post('/excluir/:id', (req, res) => {
    post.destroy({ where: { id: req.params.id } })
    .then(deleted => {
        if (deleted) {
            console.log("Excluída com sucesso!");
            res.redirect('/consulta'); 
        } else {
            console.log("Post não encontrado.");
        }
    })
});

app.listen(8081, function() {
    console.log("Servidor Ativo!");
});
