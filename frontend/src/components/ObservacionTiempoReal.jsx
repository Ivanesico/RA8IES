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
  const MAX_DISTANCIA = 150; // distancia máxima permitida

  const coordsValidas = Number.isFinite(lat) && Number.isFinite(lon);
  // se hace solo una vez ya que devuelve muchas y ya ahí hacemos la busqueda por coord
  useEffect(() => {
    if (!coordsValidas) {
      setLoading(false);
      setError("Faltan coordenadas en la URL.");
      return;
    }
    // Se crea la función load para encapsular el fetch y poder llamarlo de forma async
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError("");
        setEstaciones([]);

        const res = await fetch("/api/aemet/observacion/convencional/todas");

        if (!res.ok) throw new Error("HTTP " + res.status);

        const json = await res.json();

        if (!json.success) throw new Error(json.error || "Error desconocido");

        const estacionesArray = Array.isArray(json?.data) ? json.data : [];

        setEstaciones(estacionesArray);
      } catch (e) {
        setError("No se pudieron obtener los datos. " + e.message);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [coordsValidas]);

  // Calcula la estación mas cercana
  const nearest = useMemo(() => {
    //useMemo guarda el resultado que solo recalcula si cambia la estacion

    // Si estaciones no contiene nada devuelve null
    if (!estaciones.length || !coordsValidas) return null;

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

    if (mejorDistancia > MAX_DISTANCIA) {
      return null;
    }
    return mejorEstacion
      ? { estacion: mejorEstacion, distanciaKm: mejorDistancia }
      : null;
  }, [estaciones, lat, lon, coordsValidas]);

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
      <div className="container my-4">
        {/*Datos*/}
        <div className="row">
          <div className="col-12">
            <h3 className="text-dark">Observación en tiempo real</h3>
            <p className="text-muted">
              Datos actuales de la estación más cercana a su ubicación
            </p>
          </div>
        </div>

        {/*Loading */}
        {loading && (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        )}
        {/*Error */}
        {!loading && error && (
          <div
            className="alert alert-primary d-flex align-items-center shadow-sm"
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
          <div className="alert alert-primary shadow">
            La ubicación seleccionada no parece estar en España.
          </div>
        )}
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
