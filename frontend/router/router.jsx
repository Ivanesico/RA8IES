import { createBrowserRouter } from "react-router-dom";
import App from "../src/App";
import { Radar } from "../src/components/radar";
import { PrediccionCCAA } from "../src/components/PrediccionCCAA";
import { PrediccionCCAAManana } from "../src/components/PrediccionCCAAManana";
import { PrediccionProvincia } from "../src/components/PrediccionProvincia";
import { PrediccionProvinciaManana } from "../src/components/PrediccionProvinciaManana";
import { ObservacionTiempoReal } from "../src/components/ObservacionTiempoReal";
import { MayoresDatos } from "../src/components/MayoresDatos";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/radar",
    element: <Radar />,
  },
  {
    path: "/prediccion/ccaa/manana/:ccaa",
    element: <PrediccionCCAAManana />,
  },
  {
    path: "/prediccion/ccaa/hoy/:ccaa",
    element: <PrediccionCCAA />,
  },
  {
    path: "/prediccion/provincia/hoy/:provincia",
    element: <PrediccionProvincia />,
  },
  {
    path: "/prediccion/provincia/manana/:provincia",
    element: <PrediccionProvinciaManana />,
  },
  {
    path: "/observacion/tiempo-real",
    element: <ObservacionTiempoReal />,
  },
  {
    path: "/observacion/mayores-datos",
    element: <MayoresDatos />,
  },
]);
