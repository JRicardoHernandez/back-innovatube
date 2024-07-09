const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require("dotenv").config();
const PORT = process.env.PORT || 8080;
// Importar las rutas
const router = require("./src/routes");
// Cors
const corsOptions = {
    origin: '*',
    credentials: true,
    methods: 'POST,GET,PUT,OPTIONS,DELETE',
    optionsSuccessStatus: 200,
};

//Iniciar express
const app = express();
app.use(express.json())
app.use(cookieParser())

// Use CORS middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});
app.use(cors(corsOptions));

// Cargar las rutas
app.use(router);

// Ruta inicial
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Se inicia el Servidor en el puerto
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

