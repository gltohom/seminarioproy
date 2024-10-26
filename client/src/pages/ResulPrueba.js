import '../App.css';
import { useEffect, useState} from "react"; //useEffects sirve para recuperar los items del listado para labelSelect, desde la BD 
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2'; // para los mensajes de alerta o confirmacion

function ResulPrueba() {
  // Configurar el token para cada solicitud
  Axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Para listar el SELECT para los tipos de resultados
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/api/resulPrueba/tipoResultado");
        setItems(response.data);
      } catch (error) {
        console.error("Error de items", error);
      }
    };
    fetchItems();
  }, []);

  // Métodos para ingreso de datos
  const [descResultado, setDescResultado] = useState();
  const [fechaRealiz, setFechaRealiz] = useState();
  const [idRegPrueba, setIdRegPrueba] = useState();
  const [idTResultado, setIdTResultado] = useState();
  const [idResulPrueba, setIdResulPrueba] = useState();
  const [nombre, setNombre] = useState();
  const [tipoPrueba, setTipoPrueba] = useState();
  const [duracionPrueba, setDuracionPrueba] = useState();
  
  const [editar, setEditar] = useState(false);
  const [resulPruebaList, setResulPrueba] = useState([]);

  const update = () => {
    if (!descResultado || !fechaRealiz || idTResultado === 4) {
      Swal.fire({
        icon: "warning",
        title: "Completar formulario",
        text: "Debe llenar todos los campos.",
      });
      return;
    }
    Axios.put(`http://localhost:3001/api/resulPrueba/update`, {
      descResultado,
      fechaRealiz,
      idRegPrueba,
      idTResultado,
      idResulPrueba
    }).then(() => {
      getResulPrueba();
      limpiarCampos();
      Swal.fire({
        title: "<strong>Actualización exitosa</strong>",
        html: `<i>El resultado de la prueba <strong>Cod-Res-${idResulPrueba}</strong> fue actualizado con éxito</i>`,
        icon: 'success',
        timer: 3000
      });
    }).catch(function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message === "Network Error" ? "Intente más tarde" : error.message
      });
    });
  };

  const deleteResulPrueba = (val) => {
    Swal.fire({
      title: "Eliminar registro",
      html: `<i>¿Desea eliminar el resultado <strong>Cod-Res-${val.idResulPrueba}</strong>?</i>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar registro"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/api/resulPrueba/delete/${val.idResulPrueba}`).then(() => {
          getResulPrueba();
          limpiarCampos();
          Swal.fire({
            title: "Eliminado",
            html: `<strong>Cod-Res-${val.idResulPrueba}</strong> fue eliminado con éxito`,
            icon: "success",
            timer: 3000
          });
        }).catch(function (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se pudo eliminar el registro",
            footer: error.message === "Network Error" ? "Intente más tarde" : error.message
          });
        });
      }
    });
  };

  const limpiarCampos = () => {
    setIdResulPrueba();
    setDescResultado("");
    setFechaRealiz("");
    setIdRegPrueba("");
    setIdTResultado("");
    setEditar(false);
  };

  const editarResulPrueba = (val) => {
    setEditar(true);
    setDescResultado(val.descResultado);
    setFechaRealiz(val.fechaRealiz);
    setIdRegPrueba(val.idRegPrueba);
    setIdTResultado(val.idTResultado);
    setIdResulPrueba(val.idResulPrueba);
    setNombre(val.nombre);
    setTipoPrueba(val.tipoPrueba);
    setDuracionPrueba(val.duracionPrueba);
  };

  const getResulPrueba = () => {
    Axios.get("http://localhost:3001/api/resulPrueba").then((response) => {
      setResulPrueba(response.data);
    });
  };

  useEffect(() => {
    getResulPrueba();
  }, []);


  
  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">
          REGISTRO DE RESULTADOS DE PRUEBAS REALIZADAS A PROYECTOS
        </div>
        <div className="card-body">          
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Nombre del Proyecto: </span>
            <input type="text" 
              onChange={(event) => setNombre(event.target.value)}
              className="form-control" value={nombre} placeholder="Proyecto al que se realizaron las pruebas" required disabled />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Tipo de prueba: </span>
            <input type="text" 
              onChange={(event) => setTipoPrueba(event.target.value)}
              className="form-control" value={tipoPrueba} placeholder="Tipo de prueba que se realizó al proyecto" required disabled />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Duración de la prueba: </span>
            <input type="text" 
              onChange={(event) => setDuracionPrueba(event.target.value)}
              className="form-control" value={duracionPrueba} placeholder="Semana(s) de duración" required disabled />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Descripción de resultados obtenidos: </span>
            <input type="text" 
              onChange={(event) => setDescResultado(event.target.value)}
              className="form-control" value={descResultado} placeholder="Describa los resultados obtenidos" required />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Fecha de resultados obtenidos: </span>
            <input type="date" 
              onChange={(event) => setFechaRealiz(event.target.value)}
              className="form-control" value={fechaRealiz} placeholder="Ingrese la fecha de los resultados obtenidos" required />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Resultados de la prueba: Cod-Pru-</span>
            <input type="text" 
              onChange={(event) => setIdRegPrueba(event.target.value)}
              className="form-control" value={idRegPrueba} placeholder="Resultados que pertenecen a la prueba" required disabled />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Ingrese el resultado de la prueba: </span>
            <select className="form-select" aria-label="Seleccione una opcion" value={idTResultado} onChange={(event) => setIdTResultado(event.target.value)}>
              <option value="">--Seleccione una opcion--</option>
              {items.map((val) => (
                <option key={val.idTResultado} value={val.idTResultado}>
                  {val.tResultado}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="card-footer text-muted">
          {editar ?
            <div>
              <button className='btn btn-warning m-2' onClick={update}>Actualizar</button>
              <button className='btn btn-info m-2' onClick={limpiarCampos}>Cancelar</button>
            </div>
            : null
          }
        </div>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Proyecto</th>
            <th scope="col">Prueba realizada</th>
            <th scope="col">Resultado</th>
            <th scope="col">Descripción del resultado</th>
            <th scope="col">Fecha de Registro</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {resulPruebaList.map((val) => (
            <tr key={val.idResulPrueba}>
              <th>Cod-Res-{val.idResulPrueba}</th>
              <td>{val.nombre}</td>
              <td>{val.tipoPrueba}</td>
              <td>{val.tResultado}</td>
              <td>{val.descResultado}</td>
              <td>{val.fechaRealiz}</td>
              <td>
                <div className="btn-group" role="group">
                  <button type="button" onClick={() => editarResulPrueba(val)} className="btn btn-info">Actualizar</button>
                  <button type="button" onClick={() => deleteResulPrueba(val)} className="btn btn-danger">Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResulPrueba;
