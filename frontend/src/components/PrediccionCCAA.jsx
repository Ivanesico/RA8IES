import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { codigos_ccaa } from "../constants/diccionarios";
import aemetLogo from "../assets/aemetLogo.png";

export function PrediccionCCAA() {
  const { ccaa } = useParams(); //Lee el parámetro :ccaa de la url
  const [datos, setDatos] = useState(null); //Estado para guardar los datos recibidos del backend
  const [error, setError] = useState(null); //Estado para guardar un mensaje de error

  // Se ejecuta al montar el componente o cada vez que cambie ccaa
  useEffect(() => {
    // Si no hay ccaa no hace petición
    if (!ccaa) return;
    // Normaliza lo mandado por el usuario
    const codigo = codigos_ccaa[ccaa];

    // Llamada al backend
    fetch(`/api/aemet/prediccion/ccaa/hoy/${codigo}`)
      // Recoge el json
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`HTTP ${res.status}: ${txt}`);
        }
        return res.json();
      })
      .then((json) => {
        // Si success es false lanza error
        if (!json.success) throw new Error(json.error || "Error desconocido");
        // Si no establece data del json a datos
        setDatos(json.data);
      })
      .catch((e) => setError(e.message));
  }, [ccaa]);
  // Si hay error manda un mensaje con el error
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  // Si no hay datos devuelve un texto
  if (!datos) return <div className="text-center mt-5">Cargando...</div>;

  return (
    <div>
      {/*Cabecera*/}
      <div>
        <h1>Tiempo en España</h1>
        <img src={aemetLogo} alt="logo de AEMET" />
        <Link to="/">
          <button>Volver al inicio</button>
        </Link>
      </div>
      {/*Subcabecera*/}
      <div>
        <ul class="nav">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href={`/prediccion/ccaa/hoy/${ccaa}`}>
              Hoy
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href={`/prediccion/ccaa/manana/${ccaa}`}>
              Mañana
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              
            </a>
          </li>
        </ul>
      </div>
      {/*Datos de predicciones*/}
      <div className="container my-4">
        <h1>Predicción en {datos.ccaa}</h1>
        <p className="text-muted">
          {datos.validaPara} · Actualizado a las {datos.hora}
        </p>

        <h3>Fenómenos significativos</h3>
        <ul>
          {/*Recorre el array de fenomenos*/}
          {datos.fenomenos.map((f, i) => (
            // se usa key porque ayuda a react a identificar cada elemento de la lista
            <li key={i}>{f}</li>
          ))}
        </ul>

        <h3>Predicción</h3>
        <ul>
          {/*Recorre el array de predicciones*/}
          {datos.prediccion.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>

        <p className="text-muted mt-3">Fuente: {datos.fuente}</p>
      </div>
      {/*Pie de página*/}
      <div className="row sin-m">
        <div className="col-12 pie">
          <p className="textoPie">&copy;AEMET METEO IVÁN ESCOBAR</p>
        </div>
      </div>
    </div>
  );
}
