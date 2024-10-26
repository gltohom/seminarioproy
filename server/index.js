const express = require("express");
const cors = require("cors");

// Importando archivos desde la carpeta CONTROLLERS y GRAPHICSCOMPLEMENTS
const proyectos = require('./controllers/proyectos');
const regPrueba = require('./controllers/regPrueba');
const reporteProyecto = require('./controllers/reporteProyecto');
const resulPrueba = require('./controllers/resulPrueba');
const registroLogin = require('./controllers/registroLogin');
const graficaCircular = require('./graphicsComponents/graficaCircular');
const graficaLineal = require('./graphicsComponents/graficaLineal');

const app = express();
const PORT = 3001; // Para todos los archivos

app.use(cors());
app.use(express.json());

// Rutas de los componentes para trabajar las apis
app.use("/api", registroLogin); 
app.use("/api", proyectos);
app.use("/api", regPrueba);
app.use("/api", reporteProyecto);
app.use("/api", resulPrueba);
app.use("/api", graficaCircular);
app.use("/api", graficaLineal);

// Iniciar el servidor del puerto de escucha para todos los archivos
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
