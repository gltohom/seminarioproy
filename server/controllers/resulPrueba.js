const db = require("./db");
const express = require("express");
const router = express.Router(); // para rutas
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

// Insertar datos a la tabla resulPrueba
router.post("/resulPrueba/create", verifyToken, (req, res) => {
    const { descResultado, fechaRealiz, idRegPrueba, idTResultado } = req.body;

    db.query('CALL guardarResulPrueba(?, ?, ?, ?)', [descResultado, fechaRealiz, idRegPrueba, idTResultado],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            } else {
                res.status(201).send(result);
            }
        }
    );
});

// Listar datos de la tabla resulPrueba con combinación de tablas (JOIN)
router.get("/resulPrueba", verifyToken, (req, res) => {
    db.query('SELECT resP.idResulPrueba, proy.nombre, pru.tipoPrueba, tr.tResultado, resP.descResultado, resP.fechaRealiz, resP.idRegPrueba, resP.idTResultado, regP.idRegPrueba, pru.duracionPrueba FROM resulPrueba AS resP INNER JOIN regPrueba AS regP ON resP.idRegPrueba = regP.idRegPrueba INNER JOIN proyecto AS proy ON proy.idProyecto = regP.idProyecto INNER JOIN prueba AS pru ON pru.idPrueba = regP.idPrueba INNER JOIN tipoResultado AS tr ON tr.idTResultado = resP.idTResultado ORDER BY resP.idResulPrueba ASC',
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

// Actualizar datos de la tabla resulPrueba
router.put("/resulPrueba/update", verifyToken, (req, res) => {
    const { idResulPrueba, descResultado, fechaRealiz, idRegPrueba, idTResultado } = req.body;

    db.query('UPDATE resulPrueba SET descResultado=?, fechaRealiz=?, idRegPrueba=?, idTResultado=? WHERE idResulPrueba=?', 
        [descResultado, fechaRealiz, idRegPrueba, idTResultado, idResulPrueba],
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

// Eliminar datos de la tabla resulPrueba
router.delete("/resulPrueba/delete/:id", verifyToken, (req, res) => {
    const idResulPrueba = req.params.id;

    db.query('DELETE FROM resulPrueba WHERE idResulPrueba=?', idResulPrueba,
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

// Listar los tipos de resultado para registro
router.get("/resulPrueba/tipoResultado", verifyToken, (req, res) => {
    db.query('SELECT * FROM tipoResultado WHERE idTResultado <> 4', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

// Exportar el router
module.exports = router;
