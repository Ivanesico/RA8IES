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
      ? { station: mejorEstacion, distanceKm: mejorDistancia }
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
    <div>
      {/*Cabecera*/}
      <div>
        <h1>Tiempo en España</h1>
        <img  src={aemetLogo} alt="logo de AEMET" />
        <Link to="/">
          <button>Volver al inicio</button>
        </Link>
      </div>
    {/*Datos*/}
      <div className="container py-4">
        <h1 className="h4 mb-3">Observación en tiempo real</h1>

        {loading && (
          <div className="alert alert-info">Cargando estaciones…</div>
        )}
        {error && <div className="alert alert-danger">Error: {error}</div>}

        {!loading && !error && nearest?.station && (
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-1">{nearest.station.ubi}</h2>
              <div className="text-secondary small mb-3">
                Estación: {nearest.station.idema} · A{" "}
                {nearest.distanceKm.toFixed(1)} km · Medida:{" "}
                {nearest.station.fint}
              </div>

              <div className="d-flex gap-2 flex-wrap">
                <span className="badge text-bg-primary">
                  Temp: {nearest.station.ta ?? "—"} ºC
                </span>
                <span className="badge text-bg-secondary">
                  HR: {nearest.station.hr ?? "—"} %
                </span>
                <span className="badge text-bg-info">
                  Lluvia: {nearest.station.prec ?? "—"} mm
                </span>
                <span className="badge text-bg-warning">
                  Viento: {nearest.station.vv ?? "—"} m/s
                </span>
                <span className="badge text-bg-dark">
                  Racha: {nearest.station.vmax ?? "—"} m/s
                </span>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && !nearest?.station && (
          <div className="alert alert-warning">
            No se encontró estación cercana.
          </div>
        )}
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
