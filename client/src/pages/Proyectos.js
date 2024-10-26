import '../App.css';
import { useState, useEffect } from "react";
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

function Proyectos({ userId }) {
    // Estado para los campos del formulario
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaEntrega, setFechaEntrega] = useState("");
    const [idProyecto, setIdProyecto] = useState(null);
    const [editar, setEditar] = useState(false);
    const [proyectosList, setProyectos] = useState([]);

    // Configurar el token para cada solicitud
    Axios.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = token;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Función para obtener proyectos
    const getProyectos = async () => {
        try {
            const response = await Axios.get("http://localhost:3001/api/proyectos");
            setProyectos(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    useEffect(() => {
        getProyectos();
    }, []);

    const add = async () => {
        if (!nombre || !descripcion || !fechaInicio || !fechaEntrega) {
            return Swal.fire({
                icon: "warning",
                title: "Completar formulario",
                text: "Debe llenar todos los campos.",
            });
        }

        try {
            await Axios.post("http://localhost:3001/api/proyectos/create", {
                nombre,
                descripcion,
                fechaInicio,
                fechaEntrega,
                idUsuario: userId
            });
            getProyectos();
            limpiarCampos();
            Swal.fire({
                title: "<strong>Registro realizado</strong>",
                html: `<i>El proyecto <strong>${nombre}</strong> fue registrado con éxito</i>`,
                icon: 'success',
                timer: 3000
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message || "Intente más tarde"
            });
        }
    };

    const update = async () => {
        if (!nombre || !descripcion || !fechaInicio || !fechaEntrega) {
            return Swal.fire({
                icon: "warning",
                title: "Completar formulario",
                text: "Debe llenar todos los campos.",
            });
        }

        try {
            await Axios.put("http://localhost:3001/api/proyectos/update", {
                idProyecto,
                nombre,
                descripcion,
                fechaInicio,
                fechaEntrega,
                idUsuario: userId
            });
            getProyectos();
            limpiarCampos();
            Swal.fire({
                title: "<strong>Actualización exitosa</strong>",
                html: `<i>El proyecto <strong>${nombre}</strong> fue actualizado con éxito</i>`,
                icon: 'success',
                timer: 3000
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message || "Intente más tarde"
            });
        }
    };

    const deleteProyectos = async (val) => {
        const result = await Swal.fire({
            title: "Eliminar registro",
            html: `<i>¿Desea eliminar el proyecto <strong>${val.nombre}</strong>?</i>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminar registro"
        });

        if (result.isConfirmed) {
            try {
                await Axios.delete(`http://localhost:3001/api/proyectos/delete/${val.idProyecto}`);
                getProyectos();
                limpiarCampos();
                Swal.fire({
                    title: "Eliminado",
                    html: `<strong>${val.nombre}</strong> fue eliminado con éxito`,
                    icon: "success",
                    timer: 3000
                });
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "No se pudo eliminar el registro",
                    footer: error.message || "Intente más tarde"
                });
            }
        }
    };

    const limpiarCampos = () => {
        setIdProyecto(null);
        setNombre("");
        setDescripcion("");
        setFechaInicio("");
        setFechaEntrega("");
        setEditar(false);
    };

    const editarProyectos = (val) => {
        setEditar(true);
        setNombre(val.nombre);
        setDescripcion(val.descripcion);
        setFechaInicio(val.fechaInicio);
        setFechaEntrega(val.fechaEntrega);
        setIdProyecto(val.idProyecto);
    };

    return (
        <div className="container">
            <div className="card text-center">
                <div className="card-header">
                    REGISTRO DE PROYECTOS
                </div>
                <form onSubmit={(e) => { e.preventDefault(); editar ? update() : add(); }}>
                    <div className="card-body">
                        <div className="input-group mb-3">
                            <span className="input-group-text">Nombre del proyecto:</span>
                            <input type="text" 
                                   className="form-control" 
                                   value={nombre} 
                                   placeholder="Ingrese el nombre del proyecto" 
                                   onChange={(e) => setNombre(e.target.value)} 
                                   required />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Descripción del proyecto:</span>
                            <input type="text" 
                                   className="form-control" 
                                   value={descripcion} 
                                   placeholder="Ingrese la descripción del proyecto" 
                                   onChange={(e) => setDescripcion(e.target.value)} 
                                   required />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Fecha de inicio:</span>
                            <input type="date" 
                                   className="form-control" 
                                   value={fechaInicio} 
                                   onChange={(e) => setFechaInicio(e.target.value)} 
                                   required />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Fecha de entrega:</span>
                            <input type="date" 
                                   className="form-control" 
                                   value={fechaEntrega} 
                                   onChange={(e) => setFechaEntrega(e.target.value)} 
                                   required />
                        </div>
                    </div>
                    <div className="card-footer text-muted">
                        {editar ? (
                            <>
                                <button className='btn btn-warning m-2' type="submit">Actualizar</button>
                                <button className='btn btn-info m-2' onClick={limpiarCampos}>Cancelar</button>
                            </>
                        ) : (
                            <button className='btn btn-success' type="submit">Registrar</button>
                        )}
                    </div>
                </form>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Código</th>
                        <th scope="col">Proyecto</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Fecha de Inicio</th>
                        <th scope="col">Fecha de Entrega</th>
                        <th scope="col">Registrado por:</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {proyectosList.map((val) => (
                        <tr key={val.idProyecto}>
                            <th>Cod-Proy-{val.idProyecto}</th>
                            <td>{val.nombre}</td>
                            <td>{val.descripcion}</td>
                            <td>{val.fechaInicio}</td>
                            <td>{val.fechaEntrega}</td>
                            <td>{val.usuario}</td>
                            <td>
                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <button type="button" className="btn btn-info" onClick={() => editarProyectos(val)}>Editar</button>
                                    <button type="button" className="btn btn-danger" onClick={() => deleteProyectos(val)}>Eliminar</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Proyectos;
