import "./App.css";
import { Radar } from "./components/radar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function App() {
  const navegar = useNavigate();
  const [ccaa, setCcaa] = useState("");
  const [provincia, setProvincia] = useState("");
  function normalizaCCAA(input) {
    return String(input ?? "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  // Evento del boton de ccaa
  const ccaaSubmit = (e) => {
    e.preventDefault();
    const slug = normalizaCCAA(ccaa);
    navegar(`/prediccion/ccaa/${slug}`);
  };

    // Evento del boton de provincia
  const provinciaSubmit = (e) => {
    e.preventDefault();
    // aquí podrías validar q si quieres
    navegar(`/prediccion/provincia/${provincia}`);
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
