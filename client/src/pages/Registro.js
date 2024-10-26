// archivo css
import '../App.css';
// importación de bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import Axios from "axios";
import { useNavigate } from 'react-router-dom'; // para poder pasar de una pestaña a otra
import Swal from 'sweetalert2'; // importación de SweetAlert2

const Registro = () => {
    const navigate = useNavigate();
    // para listar el SELECT para los tipos de resultados
    const [items, setItems] = useState([]);
    
    // recuperando la información
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await Axios.get("http://localhost:3001/api/puesto");
                setItems(response.data);
            } catch (error) {
                console.error("Error de items", error);
            }
        };
        fetchItems();
    }, []);

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        correo: '',
        idPuesto: '',
        usuario: '',
        contrasena: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:3001/api/registro", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            Swal.fire({
                title: 'Registro exitoso',
                text: data.message,
                icon: 'success',
                timer: 3000,
                showConfirmButton: false
            });
            // Limpiar los campos del formulario
            setFormData({
                nombre: "",
                apellido: "",
                telefono: "",
                correo: "",
                idPuesto: "",
                usuario: "",
                contrasena: "",
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: data.message,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            // Limpiar los campos del formulario si hay error
            setFormData({
                ...formData, // mantén los valores actuales en caso de error
                idPuesto: "", // restablece solo idPuesto si se requiere
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="containerRegistro">
                <div className="card-header text-center">REGISTRO DE PERSONAL NUEVO</div>
                <div className="card-body">
                    {['nombre', 'apellido', 'telefono', 'correo', 'usuario', 'contrasena'].map((field, index) => (
                        <div className="input-group mb-3" key={index}>
                            <span className="input-group-text" id={`basic-addon${index}`}>Ingrese su {field}: </span>
                            <input
                                type={field === 'contrasena' ? 'password' : (field === 'correo' ? 'email' : 'text')}
                                className="form-control"
                                name={field}
                                value={formData[field]} // Vincular el valor del input con el estado
                                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon-puesto">Seleccione su puesto: </span>
                        <select className="form-select" aria-label="Seleccione una opción" name="idPuesto" value={formData.idPuesto} onChange={handleChange} required>
                            <option value="">--Seleccione una opción--</option>
                            {items.map((val) => (
                                <option key={val.idPuesto} value={val.idPuesto}>
                                    {val.puesto}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="text-center">
                        <button className='btn btn-success' type="submit">Registrar</button>
                        <br /><br />
                        <button className='btn btn-danger' onClick={() => navigate('/')}>Volver a Login</button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Registro;
