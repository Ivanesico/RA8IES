import { createBrowserRouter } from "react-router-dom";
import App from "../src/App";
import { Radar } from "../src/components/radar";
import { PrediccionCCAA } from "../src/components/PrediccionCCAA";
import { PrediccionProvincia } from "../src/components/PrediccionProvincia";
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
    path: "/prediccion/ccaa/:ccaa",
    element: <PrediccionCCAA />,
  },
  {
    path: "/prediccion/provincia/:provincia",
    element: <PrediccionProvincia />,
  },
  {
    path: "/observacion/tiempo-real",
    element: <ObservacionTiempoReal />,
  }, {
    path: "/observacion/mayores-datos",
    element: <MayoresDatos />,
  },
]);
