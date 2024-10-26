const db = require("./db");
const express = require("express");
const router = express.Router(); // uso de router p
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

// Insertar datos a la tabla regPrueba
router.post("/regPrueba/create", verifyToken, (req, res) => {
    const { descripcion, fechaReg, idPrueba, idProyecto } = req.body;

    db.query('CALL guardarRegPrueba(?,?, ?, ?)', [descripcion, fechaReg, idPrueba, idProyecto],
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

// Listar datos de la tabla registro de pruebas
router.get("/regPrueba", verifyToken, (req, res) => {
    db.query('SELECT rp.idRegPrueba, p.nombre, rp.descripcion, rp.fechaReg, rp.idPrueba, rp.idProyecto, pb.tipoPrueba, pb.duracionPrueba FROM regPrueba AS rp INNER JOIN proyecto AS p ON rp.idProyecto = p.idProyecto INNER JOIN prueba AS pb ON rp.idPrueba = pb.idPrueba ORDER BY rp.idRegPrueba ASC',
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

// Actualizar datos de la tabla regPrueba
router.put("/regPrueba/update", verifyToken, (req, res) => {
    const { idRegPrueba, descripcion, fechaReg, idPrueba, idProyecto } = req.body;

    db.query('UPDATE regPrueba SET descripcion=?, fechaReg=?, idPrueba=?, idProyecto=? WHERE idRegPrueba=?', 
        [descripcion, fechaReg, idPrueba, idProyecto, idRegPrueba],
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

// Eliminar datos de la tabla regPrueba
router.delete("/regPrueba/delete/:id", verifyToken, (req, res) => {
    const idRegPrueba = req.params.id;

    db.query('DELETE FROM regPrueba WHERE idRegPrueba=?', idRegPrueba,
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

// Listar los tipos de prueba
router.get("/prueba", verifyToken, (req, res) => {
    db.query('SELECT idPrueba, tipoPrueba FROM prueba', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});



//listaa
// Listar loos proyectos
router.get("/proyectos", verifyToken, (req, res) => {
    db.query('SELECT idProyecto, nombre FROM proyecto', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

// Exportar el router
module.exports = router;