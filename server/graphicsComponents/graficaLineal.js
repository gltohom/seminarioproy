const db = require("../controllers/db");
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken'); // Si necesitas manejar tokens

// Middleware para verificar el token (opcional)
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(403);

    jwt.verify(token, 'tu_clave_secreta', (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.userId = decoded.id; // O el id que estés usando
        next();
    });
};

// Ruta para la gráfica lineal
//recuperacinoo de datos desde bd, datos de resultados de todas las pruebas realizadas
router.get("/graficaLineal", verifyToken, (req, res) => {
    // Llamando los campos para mostrar en la gráfica de líneas
    db.query('SELECT tr.tResultado AS tipo, COUNT(rp.idResulPrueba) AS total FROM tipoResultado AS tr LEFT JOIN resulPrueba AS rp ON tr.idTResultado = rp.idTResultado GROUP BY tr.tResultado',
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            } else {
                res.send(result);
            }
        }
    );
});




// Exportar el router
module.exports = router;
