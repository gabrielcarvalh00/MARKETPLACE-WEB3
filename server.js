import express from "express";
import mysql from "mysql";

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'BlockChain'
});

// state.js
const state = {
    minLat: null,
    maxLat: null,
    minLng: null,
    maxLng: null
};

export default state;


con.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.stack);
        return;
    }
    console.log('Conexão bem-sucedida ao banco de dados');
});

const app = express();
app.use(express.json());
app.use(express.static('./public'));

// Função para gerar um UUID (identificador único universal) simples para o endereço
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Função para selecionar um item aleatório de um array
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/*
//pega o imput da imagem e insere tabele imagem;
app.post('/rota', (req, res) => {
    console.log("Chegou aqui na rota /rota");

    const { latitude, longitude } = req.body;

    if (latitude !== undefined && longitude !== undefined) {
       // console.log('Dados recebidos do HTML:');
        //console.log('Latitude:', latitude);
        //console.log('Longitude:', longitude);

        // --- VALORES ALEATÓRIOS GERADOS AQUI ---
        const imageAddress = `/images/${generateUUID()}.jpg`; // Endereço de imagem aleatório
        const imageDescriptions = [
            "Vista aérea de campo verde",
            "Detalhe de floresta amazônica",
            "Imagem de área urbana movimentada",
            "Área rural com rio",
            "Ponto turístico famoso"
        ];
        const imageDescription = getRandomItem(imageDescriptions);

        const droneManufacturers = [
            "DJI",
            "Parrot",
            "Autel Robotics",
            "Skydio",
            "Xiaomi"
        ];
        const droneManufacturer = getRandomItem(droneManufacturers);

        // ATENÇÃO: seller_id deve ser um ID existente na sua tabela 'Seller'
        // Para fins de teste, estou usando um valor fixo. Você deve ter uma forma de obter um seller_id válido.
        const sellerId = 1; // Exemplo: Supondo que existe um seller com ID 1.

        const sql = `
            INSERT INTO Image (address, description, drone_manufacturer, location_lat, location_lon, seller_id, registrationdata)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;

        con.query(sql, [imageAddress, imageDescription, droneManufacturer, latitude, longitude, sellerId], (err, result) => {
            if (err) {
                console.error('Erro ao inserir coordenadas no banco de dados:', err);
                return res.status(500).json({ message: 'Erro ao salvar coordenadas no banco de dados.' });
            }
            console.log('Coordenadas inseridas com sucesso na tabela Image! ID:', result.insertId);
            res.status(200).json({
                message: 'Dados de latitude e longitude recebidos e salvos com sucesso!',
                data: { latitude, longitude, insertedId: result.insertId }
            });
        });

    } else {
        res.status(400).json({ message: 'Dados de latitude ou longitude ausentes na requisição.' });
    }
});
*/


/*
//traz todas as cordenadas do bd de todas as imagens
app.get('/coordenadas', (req, res) => {
    console.log("chegou aqui");
    const sql = 'SELECT id, location_lat, location_lon FROM Image WHERE location_lat IS NOT NULL AND location_lon IS NOT NULL';

    con.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar coordenadas no banco de dados:', err);
            return res.status(500).json({ message: 'Erro ao buscar coordenadas das imagens.' });
        }

        console.log('Coordenadas de imagens recuperadas com sucesso.');

        // --- DECLARANDO AQUI FORA DO FOR EACH ---
        const todasAsCoordenadas = []; // Este array vai guardar todos os dados de todas as imagens
        // --- FIM DA DECLARAÇÃO FORA ---

        results.forEach(image => {
            const idDaImagem = image.id; // Esta ainda é uma const LOCAL ao forEach
            const latitudeDaImagem = image.location_lat; // LOCAL ao forEach
            const longitudeDaImagem = image.location_lon; // LOCAL ao forEach

            console.log(`ID: ${idDaImagem}, Latitude: ${latitudeDaImagem}, Longitude: ${longitudeDaImagem}`);

            // Adiciona um objeto com os dados de cada imagem ao array
            todasAsCoordenadas.push({
                id: idDaImagem,
                latitude: latitudeDaImagem,
                longitude: longitudeDaImagem
            });
        });

        // --- AGORA VOCÊ PODE MANIPULAR "todasAsCoordenadas" AQUI FORA DO FOR EACH ---
        console.log('Array completo de coordenadas:', todasAsCoordenadas);
        // Por exemplo, você pode passar este array para outra função ou processá-lo.
        // A linha abaixo já fazia isso, enviando o 'results' original,
        // que é idêntico ao que 'todasAsCoordenadas' conteria nesse caso.
        // Mas se você fizesse outras manipulações, usaria 'todasAsCoordenadas' aqui.
        // --- FIM DA MANIPULAÇÃO FORA ---

        res.status(200).json(results); // Ou res.status(200).json(todasAsCoordenadas);
    });
});
*/


app.get('/imagens-por-area', (req, res) => {

    const { latMin, latMax, lngMin, lngMax } = req.query;

    if (
        latMin === undefined || latMax === undefined ||
        lngMin === undefined || lngMax === undefined ||
        isNaN(parseFloat(latMin)) || isNaN(parseFloat(latMax)) ||
        isNaN(parseFloat(lngMin)) || isNaN(parseFloat(lngMax))
    ) {
        return res.status(400).json({ message: 'Parâmetros de coordenadas (latMin, latMax, lngMin, lngMax) são obrigatórios e devem ser números.' });
    }

     //pegando as latitude e longitudess=
    const minLat = parseFloat(latMin);//13
    const maxLat = parseFloat(latMax);//15
    const minLng = parseFloat(lngMin);//39
    const maxLng = parseFloat(lngMax);//41

/*
    console.log(minLat)
    console.log(maxLat)
    console.log(minLng)
    console.log(maxLng)
    //console.log("----------------------------");
  */ 

    const sql = `
        SELECT * FROM Image
        WHERE location_lat BETWEEN ? AND ?
          AND location_lon BETWEEN ? AND ?
    `;

    con.query(sql, [minLat, maxLat, minLng, maxLng], (err, results) => {
        if (err) {
            console.error('Erro ao buscar imagens:', err);
            return res.status(500).json({ message: 'Erro no banco de dados.' });
        }

        console.log("Resultados encontrados:", results); // <-- Aqui imprime no terminal

        res.status(200).json(results);
    });
});




app.listen(3030, () => {
    console.log('Servidor rodando em http://localhost:3030');
});

