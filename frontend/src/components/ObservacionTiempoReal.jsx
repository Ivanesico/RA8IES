import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import aemetLogo from "../assets/aemetLogo.png";

// Función para convertir grados a radianes
function toRad(v) {
  return (v * Math.PI) / 180;
}
// Función que devuelve la distancia entre lat1-lat2 y lon1-lon2
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Función para obtener el tiempo en tiempo real
export function ObservacionTiempoReal() {
  const [searchParams] = useSearchParams(); //Da acceso a los params de la ruta
  const lat = Number(searchParams.get("lat")); //Obtiene lat de la ruta
  const lon = Number(searchParams.get("lon")); //Obtiene lon de la ruta

  const [estaciones, setEstaciones] = useState([]); //estado de las estaciones
  const [loading, setLoading] = useState(true); //estado para controlar si se esta esperando la respuesta del fetch
  const [error, setError] = useState(""); //estado para guardar el error

  // pide las estaciones al backend
  // se hace solo una vez ya que devuelve muchas y ya ahí hacemos la busqueda por coord
  useEffect(() => {
    let cancelled = false;

    // Se crea la función load para encapsular el fetch y poder llamarlo de forma async
    async function load() {
      try {
        setLoading(true);
        setError("");
        // Hace la llamada a la api
        const res = await fetch("/api/aemet/observacion/convencional/todas");
        if (!res.ok) throw new Error("HTTP " + res.status);
        // Recoge el json
        const json = await res.json();
        // Recoge el array de estaciones de data del json
        const estacionesArray = Array.isArray(json?.data) ? json.data : [];

        if (!cancelled) {
          setEstaciones(estacionesArray);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);
  // Calcula la estación mas cercana
  const nearest = useMemo(() => {
    //useMemo guarda el resultado que solo recalcula si cambia la estacion
    console.log("lat/lon query:", lat, lon);
    console.log("estaciones length:", estaciones.length);
    // Si estaciones no contiene nada devuelve null
    if (!estaciones.length) return null;

    // Ca
    let mejorEstacion = null; // guarda la mejor estación encontrada
    let mejorDistancia = Infinity; // guarda la distancia mas corta, se declara infinito para que en cuanto haya un numero de menor valor se aplique

    // recorre las estaciones
    for (const estacion of estaciones) {
      const sLat = Number(estacion.lat);
      const sLon = Number(estacion.lon);
      if (!Number.isFinite(sLat) || !Number.isFinite(sLon)) continue;
      // Calcula la distancia
      const distancia = haversineKm(lat, lon, sLat, sLon);
      if (distancia < mejorDistancia) {
        mejorDistancia = distancia;
        mejorEstacion = estacion;
      }
    }

    console.log(
      "mejorEstacion:",
      mejorEstacion?.ubi,
      "mejorDistancia:",
      mejorDistancia,
    );
    return mejorEstacion
      ? { estacion: mejorEstacion, distanciaKm: mejorDistancia }
      : null;
  }, [estaciones, lat, lon]);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">
          Faltan coordenadas (lat/lon) en la URL.
        </div>
      </div>
    );
  }

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

      {/*Datos*/}
      <div className="row">
        <div className="col-12">
          <h3 className="text-dark">Observación en tiempo real</h3>
          <p className="text-muted">
            Datos actuales de la estación más cercana a su ubicación
          </p>
        </div>
      </div>

      {loading && (
        <div className="text-center">
          <span className="spinner-border text-primary" role="status" />
        </div>
      )}
      {error && <div className="alert alert-danger shadow">Error: {error}</div>}

      {!loading && !error && nearest?.estacion && (
        <div className="card shadow-sm border-0">
          <div className="card-body">
            {/* Cabecera estación */}
            <div className="mb-4">
              <h3 className="fw-bold text-primary mb-1">
                {nearest.estacion.ubi}
              </h3>

              <div className="text-muted small">
                Estación: {nearest.estacion.idema} · A{" "}
                {nearest.distanciaKm.toFixed(1)} km
              </div>

              <div className="text-muted small">
                Última medición: {nearest.estacion.fint}
              </div>
            </div>

            {/* Métricas en GRID */}
            <div className="row g-3">
              <div className="col-12 col-md-6 col-lg-4">
                <div className="p-3 bg-primary bg-opacity-10 rounded text-center">
                  <div className="fw-semibold text-primary">Temperatura</div>
                  <div className="fs-4 fw-bold">
                    {nearest.estacion.ta ?? "—"} ºC
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-4">
                <div className="p-3 bg-secondary bg-opacity-10 rounded text-center">
                  <div className="fw-semibold text-secondary">Humedad</div>
                  <div className="fs-4 fw-bold">
                    {nearest.estacion.hr ?? "—"} %
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-4">
                <div className="p-3 bg-info bg-opacity-10 rounded text-center">
                  <div className="fw-semibold text-info">Precipitación</div>
                  <div className="fs-4 fw-bold">
                    {nearest.estacion.prec ?? "—"} mm
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-4">
                <div className="p-3 bg-warning bg-opacity-10 rounded text-center">
                  <div className="fw-semibold text-warning">Viento</div>
                  <div className="fs-4 fw-bold">
                    {nearest.estacion.vv ?? "—"} m/s
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-4">
                <div className="p-3 bg-dark bg-opacity-10 rounded text-center">
                  <div className="fw-semibold text-dark">Racha máxima</div>
                  <div className="fs-4 fw-bold">
                    {nearest.estacion.vmax ?? "—"} m/s
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && !nearest?.estacion && (
        <div className="alert alert-warning shadow">
          No se encontró estación cercana.
        </div>
      )}
      {/*Pie de página*/}
      <div className="row sin-m mt-5">
        <div className="col-12 pie">
          <p className="textoPie">&copy;AEMET METEO IVÁN ESCOBAR</p>
        </div>
      </div>
    </div>
  );
}
