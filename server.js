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

app.post('/insert', (req, res) => {
  const { AddressServer, Value, Description, NameOwer, WalletAddress, DroneBrand, LocalLat, LocalLong, DateRegister } = req.body;

  const query = `INSERT INTO Image (address, description, drone_manufacturer, location_lat, location_lon, seller_id, registrationdata) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  con.query(query, [AddressServer, Description, DroneBrand, LocalLat, LocalLong, NameOwer, DateRegister], (err, result) => {
    if (err) {
      return res.status(500).send('Erro ao inserir dados'); // Resposta de erro
    }
    res.status(200).send('Dados inseridos com sucesso'); // Resposta de sucesso
  });
});




app.listen(3030, () => {
  console.log('Running server');
});
