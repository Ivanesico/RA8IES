import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { toSlug } from "../utils/textUtils.js";
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
    const provinciaTocod = toSlug(provincia);
    const codigo = codigos_provincia[provinciaTocod];
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
  if (!datos)
    return <div className="text-center mt-5">Cargando...</div>;

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
      {/* Datos de predicciones */}
      <div className="container my-4">
        {/* En provincia: "zona" en vez de "ccaa" */}
        <h1>Predicción en {datos.zona}</h1>

        {/* Aquí tienes fecha/hora/validez (si quieres mostrar fecha también) */}
        <p className="text-muted">
          {datos.validaPara} · {datos.fecha} · Actualizado a las {datos.hora}
        </p>

        {/* Predicción es un string largo */}
        <h3>Predicción</h3>
        <p>{datos.prediccion}</p>

        {/* Tabla/Lista de temperaturas */}
        <h3>Temperaturas mínimas y máximas</h3>

        {datos.temperaturas?.length > 0 ? (
          <ul>
            {datos.temperaturas.map((t, i) => (
              <li key={i}>
                {t.localidad}: {t.min}°C / {t.max}°C
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No hay temperaturas disponibles.</p>
        )}

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
