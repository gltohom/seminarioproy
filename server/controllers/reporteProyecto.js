const db = require("./db");
const express = require("express");
const router = express.Router(); // para manejar rutas
const jwt = require('jsonwebtoken'); // para manejar tokens

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(403);

    jwt.verify(token, 'tu_clave_secreta', (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.userId = decoded.id; // O el id que estés usando
        next();
    });
};

// Listar los proyectos para registro de prueba
router.get("/proyectos", verifyToken, (req, res) => {
    db.query('SELECT idProyecto, nombre FROM proyecto', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

// Insertar idProyecto para generar la búsqueda
router.post("/select", verifyToken, (req, res) => {
    const { idProyecto } = req.body; // Captura el idProyecto desde el cuerpo de la solicitud

    db.query('SELECT pru.tipoPrueba, pru.duracionPrueba, tRes.tResultado, resPru.fechaRealiz, resPru.descResultado FROM proyecto AS proy INNER JOIN regPrueba AS regPru ON proy.idProyecto = regPru.idProyecto INNER JOIN prueba AS pru ON pru.idPrueba = regPru.idPrueba INNER JOIN resulPrueba AS resPru ON regPru.idRegPrueba = resPru.idRegPrueba INNER JOIN tipoResultado AS tRes ON tRes.idTResultado = resPru.idTResultado WHERE proy.idProyecto = ? ORDER BY resPru.idResulPrueba ASC;', 
    [idProyecto], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        res.send(result); // Envía los resultados de vuelta al frontend
    });
});

// Exportar el router
module.exports = router;
