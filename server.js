import express from "express";
import mysql from "mysql";



const con=mysql.createConnection({
    host: 'localhost',
    user:'root',
    password: 'admin123',
    database:'BlockChain'
}
)

  con.connect((err) => {
      if (err) {
          console.error('Erro ao conectar ao banco de dados:', err.stack);
          return;
      }
      console.log('Conexão bem-sucedida ao banco de dados');
  });

const app = express();

//especificing where foldr html
app.use(express.static('./public')); 


app.get('/cidades', (req, res) => {
  const cidade = req.query.cidade;
  con.query('SELECT city, address FROM image WHERE city LIKE ?', [`%${cidade}%`], (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao acessar o banco de dados');
    }
    res.json(results);
  });
});

/*
app.get('/cidades', (req, res) => {
  con.query('SELECT *FROM image', (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao acessar o banco de dados');
    }
    res.json(results); // Ex: [{ city: "Campinas" }, ...]
  });
});
*/

app.listen(3030, () => {
  console.log('Running server');
});
