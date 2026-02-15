import "./App.css";
import { Radar } from "./components/radar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function App() {
  const navegar = useNavigate();
  const [ccaa, setCcaa] = useState("");

  const ccaaSubmit = (e) => {
    e.preventDefault();
    // aquí podrías validar q si quieres
    navegar(`/prediccion/${encodeURIComponent(ccaa)}`);
  };
  return (
    <>
      {/*Cabecera*/}
      <div>
        <h1>Tiempo en España</h1>
        <img src="/assets/aemetLogo.png" alt="logo de AEMET" />
      </div>
      {/* Cards*/}
      <div>
        <div id="tiempoCcaa" className="card cards" style={{ width: "18rem" }}>
          <h3>Tiempo en tu municipio</h3>
          <form onSubmit={ccaaSubmit}>
            <input
              type="search"
              
              onChange={(e) => setCcaa(e.target.value)}
              placeholder="Buscar ccaa..."
            />
            <button type="submit">Buscar</button>
          </form>
        </div>
      </div>
      {/* Pie de página*/}
      <div className="row sin-m">
        <div className="col-12 pie">
          <p className="textoPie">&copy;AEMET METEO</p>
        </div>
      </div>
    </>
  );
}

export default App;
