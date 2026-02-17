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
    <div className="container sin-p">
      {/*Cabecera*/}
      <header className="bg-primary text-white py-4 mb-4">
        <div className="container d-flex flex-column flex-md-row align-items-center gap-3">
          <img src={aemetLogo} alt="logo AEMET" height="70" />
          <h1 className="m-0 fw-bold">El Tiempo en España</h1>
          <Link to="/" className="ms-auto">
            <button className="btn btn-light">Volver al inicio</button>
          </Link>
        </div>
      </header>
      {/*Subcabecera*/}
      <div>
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <Link
              className="nav-link active"
              to={`/prediccion/ccaa/hoy/${ccaa}`}
            >
              Hoy
            </Link>
          </li>
          <li class="nav-item">
            <Link className="nav-link" to={`/prediccion/ccaa/manana/${ccaa}`}>
              Mañana
            </Link>
          </li>
        </ul>
      </div>
      {/*Datos de predicciones*/}
      <div className="container my-4">
        <div className="card shadow">
          <div className="card-body">
            <div className="d-flex flex-column jusitfy-content-betweeen align-items-start">
              <h1>Predicción en {datos.ccaa}</h1>
              <span className="text-muted small">
                {datos.validaPara} · Actualizado a las {datos.hora}
              </span>
            </div>
            {datos.fenomenos.length > 0 && (
              <div className="alert alert-warning">
                <h5 className="alert-heading mb-2">Fenómenos significativos</h5>
                <ul className="mb-0">
                  {datos.fenomenos.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
            <div >
              <h5>Predicción</h5>
              <ul className="list-group ">
                {/*Recorre el array de predicciones*/}
                {datos.prediccion.map((p, i) => (
                  <li className="list-group-item" key={i}>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
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
