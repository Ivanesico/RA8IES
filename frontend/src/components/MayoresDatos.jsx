import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import aemetLogo from "../assets/aemetLogo.png";

// Función para ordenar de mayor a menor
function top5(items, campo, n = 5) {
  return items
    .filter((s) => Number.isFinite(Number(s[campo])))
    .slice()
    .sort((a, b) => Number(b[campo]) - Number(a[campo]))
    .slice(0, n);
}

//Función para ordenar de menor a mayor
function top5menos(items, campo, n = 5) {
  return items
    .filter((s) => Number.isFinite(Number(s[campo])))
    .slice()
    .sort((a, b) => Number(a[campo]) - Number(b[campo]))
    .slice(0, n);
}

// Función para obtener la hora
function soloHora(fint) {
  // convierte +0000 -> +00:00
  const iso = fint.replace(/([+-]\d{2})(\d{2})$/, "$1:$2");
  const d = new Date(iso);
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

export function MayoresDatos() {
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
  // Guarda los resultados que calcula solo si cambia la estación
  const highlights = useMemo(() => {
    // Si estaciones no contiene nada devuelve los array vacíos
    if (!estaciones.length) {
      return {
        topPrec: [],
        topVmax: [],
        topVv: [],
        topTamax: [],
        topTamin: [],
      };
    }
    // Si no devuelve las 5 máximas de cada
    return {
      topPrec: top5(estaciones, "prec", 5),
      topVmax: top5(estaciones, "vmax", 5),
      topVv: top5(estaciones, "vv", 5),
      topTamax: top5(estaciones, "tamax", 5),
      topTamin: top5menos(estaciones, "tamin", 5),
    };
  }, [estaciones]);

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
      {/*Texto presentación*/}
      <h3 className="mb-4">Observación en tiempo real</h3>
      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status" />
        </div>
      )}
      {error && (
        <div className="alert alert-danger text-center">Error: {error}</div>
      )}

      {/*Cards*/}
      <div className="row g-4">
        {/*Card precipitaciones*/}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card h-100 shadow">
            <div className="card-body">
              <h5 className="card-title">Mayores precipitaciones</h5>
              <ul className="list-group list-group-flush">
                {highlights.topPrec.map((s, i) => (
                  <li
                    key={`${s.idema}-${s.fint}-${i}`}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>{s.ubi}</span>
                    <div className="text-end">
                      <strong>{s.prec.toFixed(2)} mm</strong>
                      <div className="small text-muted">{soloHora(s.fint)}{" h"}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/*Card media vientos*/}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card h-100 shadow">
            <div className="card-body">
              <h5 className="card-title">Mayores medias de viento</h5>
              <ul className="list-group list-group-flush">
                {highlights.topVv.map((s, i) => (
                  <li
                    key={`${s.idema}-${s.fint}-${i}`}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>{s.ubi}</span>
                    <div className="text-end">
                      <strong>{s.vv} km/h</strong>
                      <div className="small text-muted">
                        {soloHora(s.fint)}{" h"}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/*Card max viento*/}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card h-100 shadow">
            <div className="card-body">
              <h5 className="card-title">Mayores rachas de viento</h5>
              <ul className="list-group list-group-flush">
                {highlights.topVmax.map((s, i) => (
                  <li
                    key={`${s.idema}-${s.fint}-${i}`}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>{s.ubi}</span>
                    <div className="text-end">
                      <strong>{s.vmax} km/h</strong>
                      <div className="text-muted small">
                        {soloHora(s.fint)}{" h"}
                      </div>{" "}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/*Card temp altas*/}
        <div className="col-12 col-md-6 col-lg-4 offset-lg-2">
          <div className="card shadow h-100">
            <div className="card-body">
              <h5 className="card-title">Temperaturas más altas</h5>

              <ul className="list-group list-group-flush">
                {highlights.topTamax.map((s, i) => (
                  <li
                    key={`${s.idema}-${s.fint}-${i}`}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>{s.ubi}</span>
                    <div className="text-end">
                      <strong>{s.tamax} º</strong>

                      <div className="text-muted small">
                        {soloHora(s.fint)}{" h"}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/*Card temp bajas*/}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow h-100">
            <div className="card-body">
              <h5 className="card-title">Temperatuas más bajas</h5>

              <ul className="list-group list-group-flush">
                {highlights.topTamin.map((s, i) => (
                  <li
                    key={`${s.idema}-${s.fint}-${i}`}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>{s.ubi}</span>
                    <div className="text-end">
                      <strong>{s.tamin} º</strong>
                      <div className="text-muted small">
                        {soloHora(s.fint)}{" h"}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
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
