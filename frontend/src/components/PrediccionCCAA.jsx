import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { codigos_ccaa } from "../constants/diccionarios";
import aemetLogo from "../assets/aemetLogo.png";

export function PrediccionCCAA() {
  const { ccaa } = useParams(); //Lee el parámetro :ccaa de la url
  const [datos, setDatos] = useState(null); //Estado para guardar los datos recibidos del backend
  const [error, setError] = useState(""); //Estado para guardar un mensaje de error
  const [loading, setLoading] = useState(true); // estado para manejar el estado de carga

  // Busca el codigo del texto pasado por el usuario
  const codigo = codigos_ccaa[ccaa];

  // Se ejecuta al montar el componente o cada vez que cambie ccaa
  useEffect(() => {
    // Si la ccaa no se encuentra en el diccionario
    if (!codigo) {
      setLoading(false);
      setError("No se ha encontrado una CCAA llamada " + ccaa);
      setDatos(null);
      return;
    }

    // Encapsulamos la carga de forma async
    const cargarDatos = async () => {
      try {
        // LLamada al backend
        const res = await fetch(`/api/aemet/prediccion/ccaa/hoy/${codigo}`);

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`HTTP ${res.status}: ${txt}`);
        }

        const json = await res.json();

        if (!json.success) {
          throw new Error(json.error || "Error desconocido");
        }
        setDatos(json.data);
      } catch (e) {
        setError("No se pudieron obtener los datos. " + e.message);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [codigo]);

  return (
    <>
      {/*Cabecera*/}
      <header className="bg-primary text-white py-4">
        <div className="container d-flex flex-column flex-md-row align-items-center gap-3">
          <img src={aemetLogo} alt="logo AEMET" height="70" />
          <h1 className="m-0 fw-bold">El Tiempo en España</h1>
          <Link to="/" className="ms-auto">
            <button className="btn btn-light">Volver al inicio</button>
          </Link>
        </div>
      </header>
      {/*Subcabecera*/}
      <div className="container my-4">
        <div>
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <Link
                className="nav-link active"
                to={`/prediccion/ccaa/hoy/${ccaa}`}
              >
                Hoy
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={`/prediccion/ccaa/manana/${ccaa}`}>
                Mañana
              </Link>
            </li>
          </ul>
        </div>
        {/*Datos de predicciones*/}
        <div className="row mt-4">
          {/* Loading */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          )}
          {/* Error */}
          {error && (
            <div
              className="alert alert-primary d-flex align-items-center shadow"
              role="alert"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"
                viewBox="0 0 16 16"
                role="img"
                aria-label="Warning:"
              >
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
              </svg>
              <div>{error}</div>
            </div>
          )}
          {/*Si no está cargando, hay datos y no hay error, muestra los datos*/}
          {!loading && !error && datos && (
            <div className="card shadow">
              <div className="card-body">
                <div
                  className="d-flex flex-column "
                >
                  <h1>Predicción en {datos.ccaa}</h1>
                  <span className="text-muted small">
                    {datos.validaPara} · Actualizado a las {datos.hora}
                  </span>
                </div>
                {datos.fenomenos.length > 0 && (
                  <div className="alert alert-warning">
                    <h5 className="alert-heading mb-2">
                      Fenómenos significativos
                    </h5>
                    <ul className="mb-0">
                      {datos.fenomenos.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
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
          )}
        </div>
      </div>
      {/*Pie de página*/}
      <footer className="bg-light py-3 mt-5">
        <div className="container text-center">
          <p className="mb-0 textoPie">&copy;AEMET METEO IVÁN ESCOBAR</p>
        </div>
      </footer>
    </>
  );
}
