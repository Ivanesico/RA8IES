import { Link } from "react-router-dom";

export function Radar() {
  return (
    <div>

      {/*Cabecera*/}
      <div>
        <h1>Tiempo en España</h1>
        <img src="/assets/aemetLogo.png" alt="logo de AEMET" />
        <Link to="/">
          <button>Volver al inicio</button>
        </Link>
      </div>

      {/*Section de la imagen*/}
      <section className="radar">
        <div>
          <h3>MAPA DE LLUVIAS DE ESPAÑA</h3>
        </div>
        <img
          className="radarImg"
          src="/api/aemet/red/radar/nacional"
          alt="Radar AEMET"
        />
      </section>

      {/*Pie de página*/}
      <div className="row sin-m">
        <div className="col-12 pie">
          <p className="textoPie">&copy;AEMET METEO</p>
        </div>
      </div>

    </div>
  );
}
