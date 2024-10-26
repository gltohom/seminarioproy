import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = ({ setUser }) => {
    const [credentials, setCredentials] = useState({ usuario: "", contrasena: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3001/api/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();
            if (response.ok) {
                Swal.fire({
                    title: 'Inicio de sesión exitoso',
                    text: data.message,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                localStorage.setItem('token', data.token); // Almacenar el token en el localStorage
                setUser({ id: data.idUsuario }); // Guardar el ID del usuario
                navigate('/'); // Redirigir a la página principal después de iniciar sesión
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.message,
                    icon: 'error',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema con la conexión. Intente más tarde.',
                icon: 'error',
            });
        }
    };

    return (
        <div className="container">
            <div className="card text-center">
                <div className="card-header">
                    Inicio de Sesión
                </div>
                <form onSubmit={handleSubmit} className="card-body">
                    <div className="mb-3">
                        <label className="form-label">Ingrese su usuario</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="usuario" 
                            placeholder="Usuario" 
                            onChange={handleChange} 
                            required 
                            aria-describedby="usuarioHelp"
                        />   
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Ingrese su contraseña</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            name="contrasena" 
                            placeholder="Contraseña" 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
                        <br /><br />
                        <button 
                            type="button" 
                            className="btn btn-success" 
                            onClick={() => navigate('/registro')}
                        >
                            Registrarse
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
