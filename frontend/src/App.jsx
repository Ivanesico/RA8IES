import "./App.css";
import { Radar } from "./components/radar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { toSlug } from "./utils/textUtils";
import aemetLogo from "./assets/aemetLogo.png";
//Imports para el mapa
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function App() {

  const navegar = useNavigate();
  const [ccaa, setCcaa] = useState(""); //estado para mandar la ccaa escrita
  const [provincia, setProvincia] = useState(""); //estado para mandar la provincia escrita
  const [picked, setPicked] = useState(null); //estado para seleccionar la ubicacion clickada en el mapa
  const centerSpain = useMemo(() => [40.4168, -3.7038], []); // sirve para centrar el mapa

  // Evento del botón de ccaa
  const ccaaSubmit = (e) => {
    e.preventDefault();
    const slug = toSlug(ccaa);
    navegar(`/prediccion/ccaa/${slug}`);
  };

  // Evento del botón de provincia
  const provinciaSubmit = (e) => {
    e.preventDefault();
    const slug = toSlug(provincia);
    navegar(`/prediccion/provincia/${slug}`);
  };

  // Método para obtener la ubicación actual de la persona
  const obtenerUbicacion = () => {
    // Si no tenemos acceso mandamos aviso y return
    if (!navigator.geolocation) {
      alert("Tu navegador no tiene acceso a tu ubicación");
      return;
    }
    // Obtiene la lat y lon actual y la manda a observacion
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { lat, lon } = pos.coords;
        navegar(`/observacion/tiempo-real?lat=${lat}&lon=${lon}`);
      },
      (err) => {
        alert("No se pudo obtener tu ubicación: " + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  // A veces en Vite no salen los markers si no se configura el fix icon
  const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  // Función para manejar el evento del click en el mapa y obtener sus coordenadas
  function ClickPicker({ onPick }) {
    useMapEvents({
      click(e) {
        onPick(e.latlng); // { lat, lng }
      },
    });
    return null;
  }

  // Evento para mandar la ubicación del mapa
  const mandarUbicacionMapa = () => {
    if (!picked) return;
    navegar(`/observacion/tiempo-real?lat=${picked.lat}&lon=${picked.lng}`);
  };

  return (
    <>
      {/*Cabecera*/}
      <div>
        <h1>Tiempo en España</h1>
        <img src={aemetLogo} alt="logo de AEMET" />
      </div>

      {/* Cards*/}
      <div>

        {/*Card prediccion ccaa*/}
        <div id="tiempoCcaa" className="card cards" style={{ width: "18rem" }}>
          <h3>Tiempo en tu CCAA</h3>
          <form onSubmit={ccaaSubmit}>
            <input
              type="search"
              onChange={(e) => setCcaa(e.target.value)}
              placeholder="Buscar ccaa..."
            />
            <button type="submit">Buscar</button>
          </form>
        </div>
        {/*Card prediccion provincia*/}
        <div
          id="tiempoProvincia"
          className="card cards"
          style={{ width: "18rem" }}
        >
          <h3>Tiempo en tu provincia</h3>
          <form onSubmit={provinciaSubmit}>
            <input
              type="search"
              onChange={(e) => setProvincia(e.target.value)}
              placeholder="Buscar provincia..."
            />
            <button type="submit">Buscar</button>
          </form>
        </div>
        {/*Card observación tiempo real*/}
        <div
          id="observacionReal"
          className="card cards"
          style={{ width: "18rem" }}
        >
          <h3>Observación en tiempo real</h3>
          <p>
            Selecciona un punto en el mapa o usa tu ubicación para ver la
            estación mas cercana y sus datos actuales
          </p>

          {/*Botón para obtener la ubicación actual*/}
          <button className="btn btn-primary" onClick={obtenerUbicacion}>
            Usar mi ubicación actual
          </button>
          {/*Botón para abrir el collapse y ver el mapa de españa*/}
          <button
            className="btn btn-primary"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseMapa"
            aria-expanded="false"
            aria-controls="collapseMapa"
          >
            Elegir un punto en el mapa
          </button>
          {/* Collapse donde está el mapa */}
          <div className="collapse" id="collapseMapa">
            <div className="container py-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="ratio ratio-16x9">
                    <div>
                      {/* Mapa */}
                      <MapContainer
                        center={centerSpain}
                        zoom={5}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <TileLayer
                          attribution="&copy; OpenStreetMap"
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <ClickPicker onPick={setPicked} />
                        {picked && (
                          <Marker
                            position={[picked.lat, picked.lng]}
                            icon={markerIcon}
                          />
                        )}
                      </MapContainer>
                    </div>
                  </div>
                </div>
              </div>
              {/*Div donde aparece lo seleccionado y el botón para enviar  */}
              <div className="mt-3 d-flex align-items-center justify-content-between gap-2 flex-wrap">
                <div className="text-secondary">
                  {/* Si hay algo en el picked muestra un mensaje o otro */}
                  {picked ? (
                    <>
                      Seleccionado: lat {picked.lat.toFixed(5)}, lon{" "}
                      {picked.lng.toFixed(5)}
                    </>
                  ) : (
                    <>Haz click en el mapa para seleccionar coordenadas.</>
                  )}
                </div>
                {/* Botón para enviar la ubicación */}
                <button
                  className="btn btn-primary"
                  disabled={!picked}
                  onClick={mandarUbicacionMapa}
                >
                  Ver tiempo
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/*Div radar */}
      <div>
        <Link to="/radar">
          <img
            className="radarImg"
            src="/api/aemet/red/radar/nacional"
            alt="Radar AEMET"
            width={"50%"}
            style={{ width: "220px", height: "auto" }}
          />{" "}
        </Link>
      </div>

      {/* Pie de página*/}
      <div className="row sin-m">
        <div className="col-12 pie">
          <p className="textoPie">&copy;AEMET METEO IVÁN ESCOBAR</p>
        </div>
      </div>
    </>
  );
}

export default App;
