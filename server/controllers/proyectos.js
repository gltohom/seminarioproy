const db = require("./db");
const express = require("express");
const router = express.Router(); // para uso de rutas
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

// Insertar datos a la tabla EMPLEADOS
router.post("/proyectos/create", verifyToken, (req, res) => {
    const { nombre, descripcion, fechaInicio, fechaEntrega, idUsuario } = req.body;
    
    db.query('INSERT INTO proyecto(nombre, descripcion, fechaInicio, fechaEntrega, idUsuario) VALUES (?,?,?,?,?)', 
        [nombre, descripcion, fechaInicio, fechaEntrega, idUsuario],
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

// Listar datos de la tabla PROYECTOS
router.get("/proyectos", verifyToken, (req, res) => {
    db.query('SELECT p.idProyecto, p.nombre, p.descripcion, p.fechaInicio, p.fechaEntrega, u.idUsuario, u.usuario FROM proyecto AS p INNER JOIN usuario AS u ON p.idUsuario = u.idUsuario ORDER BY p.idProyecto ASC',
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

// Actualizar datos de la tabla EMPLEADOS
router.put("/proyectos/update", verifyToken, (req, res) => {
    const { idProyecto, nombre, descripcion, fechaInicio, fechaEntrega, idUsuario } = req.body;

    db.query('UPDATE proyecto SET nombre=?, descripcion=?, fechaInicio=?, fechaEntrega=?, idUsuario=? WHERE idProyecto=?', 
        [nombre, descripcion, fechaInicio, fechaEntrega, idUsuario, idProyecto],
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

// Eliminar datos de la tabla EMPLEADOS
router.delete("/proyectos/delete/:id", verifyToken, (req, res) => {
    const idProyecto = req.params.id;

    db.query('DELETE FROM proyecto WHERE idProyecto=?', idProyecto,
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
