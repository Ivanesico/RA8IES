import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import aemetLogo from "../assets/aemetLogo.png";
import { codigos_provincia } from "../constants/diccionarios";

export function PrediccionProvincia() {
  const { provincia } = useParams(); //Lee el parámetro :provincia de la url
  const [datos, setDatos] = useState(null); //Estado para guardar los datos recibidos del backend
  const [error, setError] = useState(null); //Estado para guardar un mensaje de error

  // Se ejecuta al montar el componente o cada vez que cambie ccaa
  useEffect(() => {
    // Si no hay ccaa no hace petición
    if (!provincia) return;
    // Normaliza lo mandado por el usuario
    const codigo = codigos_provincia[provincia];
    // Llamada al backend
    fetch(`/api/aemet/prediccion/provincia/hoy/${codigo}`)
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
  }, [provincia]);

  // Si hay error manda un mensaje con el error
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  // Si no hay datos devuelve un texto
  if (!datos) return <div className="text-center mt-5">Cargando...</div>;

  return (
    <div className="container">
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
              to={`/prediccion/provincia/hoy/${provincia}`}
            >
              Hoy
            </Link>
          </li>
          <li class="nav-item ">
            <Link
              className="nav-link"
              to={`/prediccion/provincia/manana/${provincia}`}
            >
              Mañana
            </Link>
          </li>
        </ul>
      </div>
      {/* Datos de predicciones */}
      <div className="row my-4">
        <div className="card shadow">
          <div className="card-body">
            <div className="d-flex flex-column justify-content-between align-items-start">
              <h1>Predicción en {datos.zona}</h1>
              <span className="text-muted small">
                {datos.validaPara} · Actualizado a las {datos.hora}
              </span>
            </div>
            {/* Predicción es un string largo */}
            <div className="mb-2">
              <h5>Predicción</h5>
              <p>{datos.prediccion}</p>
            </div>
            <div>
              {/* Tabla/Lista de temperaturas */}
              <h5>Temperaturas mínimas y máximas</h5>

              {datos.temperaturas?.length > 0 ? (
                <ul className="list-group ">
                  {datos.temperaturas.map((t, i) => (
                    <li className="list-group-item" key={i}>
                      {t.localidad}: {t.min}°C / {t.max}°C
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No hay temperaturas disponibles.</p>
              )}

            </div>
          </div>
        </div>
      </div>
      {/*Pie de página*/}
      <div className="row sin-m mt-5">
        <div className="col-12 pie">
          <p className="textoPie">&copy;AEMET METEO IVÁN ESCOBAR</p>
        </div>
      </div>
    </div>
  );
}
