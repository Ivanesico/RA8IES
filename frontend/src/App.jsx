import "./App.css";
import { Radar } from "./components/radar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function App() {
  const navegar = useNavigate();
  const [municipio, setMunicipio] = useState("");

  const municipioSubmit = (e) => {
    e.preventDefault();
    // aquí podrías validar q si quieres
    navegar(`/prediccion?municipio=${encodeURIComponent(municipio)}`);
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
        <div id="tiempoMunicipio" class="card cards" style={{ width: "18rem" }}>
          <h3>Tiempo en tu municipio</h3>
          <form onSubmit={municipioSubmit}>
            <input
              type="search"
              value="municipio"
              onChange={(e) => setMunicipio(e.target.value)}
              placeholder="Buscar municipio..."
            />
            <button type="submit">Buscar</button>
          </form>
        </div>
      </div>
      {/* Pie de página*/}
      <div class="row sin-m">
        <div class="col-12 pie">
          <p class="textoPie">&copy;AEMET METEO</p>
        </div>
      </div>
    </>
  );
}

export default App;
