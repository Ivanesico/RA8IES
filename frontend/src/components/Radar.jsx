import { Link } from "react-router-dom";
import aemetLogo from "../assets/aemetLogo.png";

export function Radar() {
  return (
    <>
      {/*Cabecera*/}
      <header className="bg-primary text-white py-4 ">
        <div className="container d-flex flex-column flex-md-row align-items-center gap-3">
          <img src={aemetLogo} alt="logo AEMET" height="70" />
          <h1 className="m-0 fw-bold">El Tiempo en España</h1>
          <Link to="/" className="ms-auto">
            <button className="btn btn-light">Volver al inicio</button>
          </Link>
        </div>
      </header>

      {/**Main */}
      <div className="container my-4">
        <div className="row ">
          <div className="col-12">
            <div>
              <h3 className="text-dark">RADAR DE LLUVIAS DE ESPAÑA</h3>
              <p className="text-muted">
                Imagen de las precipitaciones detectadas por radar
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card shadow">
              <div className="card-body text-center">
                  <img
                    className="img-fluid rounded border"
                    src="/api/aemet/red/radar/nacional"
                    alt="Radar AEMET"
                  />
              </div>
            </div>
          </div>
        </div>
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
