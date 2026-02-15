import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function PrediccionCCAA() {
  const [datos, setDatos] = useState(null);
  const { ccaa } = useParams();

  useEffect(() => {
    fetch(`/api/aemet/prediccion/ccaa/hoy/${encodeURIComponent(ccaa)}`)
      .then((res) => res.json())
      .then((json) => setDatos(json.datos));
  }, []);

  if (!datos) return <div className="text-center mt-5">Cargando...</div>;
  return (
    <div className="container my-4">
      <h1>Predicción en {datos.ccaa}</h1>
      <p className="text-muted">
        {datos.validaPara} · Actualizado a las {datos.hora}
      </p>

      

      <p className="text-muted mt-3">Fuente: {datos.fuente}</p>
    </div>
  );
}
