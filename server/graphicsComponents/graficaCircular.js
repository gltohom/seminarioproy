const db = require("../controllers/db");
const express = require("express");
const router = express.Router(); // par las rutas
const jwt = require('jsonwebtoken'); // Si necesitas manejar tokens

// Middleware para verificar el token (opcional, si lo necesitas)
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(403);

    jwt.verify(token, 'tu_clave_secreta', (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.userId = decoded.id; // O el id que estés usando
        next();
    });
};

// Ruta para la gráfica circular
//recuperacuion de los datos desde bd
router.get("/graficaCircular", verifyToken, (req, res) => {
    // Llamando los campos para mostrar en la gráfica de pastel
    db.query('SELECT p.tipoPrueba AS tipo, COUNT(rp.idPrueba) AS total FROM prueba AS p LEFT JOIN regPrueba AS rp ON p.idPrueba = rp.idPrueba GROUP BY tipoPrueba',
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