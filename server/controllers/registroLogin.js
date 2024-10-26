const db = require("./db");
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router(); // Usa un router

// Registro de usuario
router.post("/registro", async (req, res) => {
    const { nombre, apellido, telefono, correo, idPuesto, usuario, contrasena } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Registrar en la tabla `personal`
        const result = await new Promise((resolve, reject) => {
            db.query('INSERT INTO personal (nombre, apellido, telefono, correo, idPuesto) VALUES (?, ?, ?, ?, ?)', 
            [nombre, apellido, telefono, correo, idPuesto], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        const idPersonal = result.insertId;

        // Registrar en la tabla `usuarios`
        await new Promise((resolve, reject) => {
            db.query('INSERT INTO usuario (usuario, contrasena, idPersonal) VALUES (?, ?, ?)', 
            [usuario, hashedPassword, idPersonal], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login de usuario
router.post("/login", async (req, res) => {
    const { usuario, contrasena } = req.body;

    db.query('SELECT * FROM usuario WHERE usuario = ?', [usuario], async (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

        const user = results[0];
        const isMatch = await bcrypt.compare(contrasena, user.contrasena);

        if (isMatch) {
            const token = jwt.sign({ 
                idUsuario: user.idUsuario,
                usuario: user.usuario 
            }, 'tu_clave_secreta', { expiresIn: '1h' });
            res.json({ message: 'Login exitoso', token, idUsuario: user.idUsuario });
        } else {
            res.status(401).json({ message: 'Contraseña incorrecta' });
        }
    });
});

// Listar tipos de puestos para registro de personal
router.get("/puesto", (req, res) => {
    db.query('SELECT * FROM puesto', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(403);

    jwt.verify(token, 'tu_clave_secreta', (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.userId = decoded.idUsuario; // Asegúrate de usar el nombre correcto
        next();
    });
};

// Ejemplo de ruta protegida
router.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Acceso permitido', userId: req.userId });
});

// Exportar el router
module.exports = router;
