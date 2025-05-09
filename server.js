import express from "express";
import mysql from "mysql";


const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'BlockChain'
});

con.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.stack);
        return;
    }
    console.log('Conexão bem-sucedida ao banco de dados');
});
// Middleware para processar o corpo da requisição como JSON

const app = express();
const port = 3030;

// Middleware para interpretar o corpo da requisição como JSON
app.use(express.json());

// Especificando onde está a pasta HTML
app.use(express.static('./public'));

app.post('/insert', (req, res) => {
  const nomeAluno = req.body.nome;

  // Verifica se o nome foi enviado
  if (!nomeAluno) {
      return res.status(400).send('Nome do aluno é obrigatório');
  }

  // Inserção no banco de dados
  const query = 'INSERT INTO Aluno (nome) VALUES (?)';
  con.query(query, [nomeAluno], (err, result) => {
      if (err) {
          console.error('Erro ao inserir dados:', err);
          return res.status(500).send('Erro ao inserir dados');
      }
      res.send(`Aluno ${nomeAluno} inserido com sucesso!`);
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});