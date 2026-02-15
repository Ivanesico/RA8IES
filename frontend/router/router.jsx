import { createBrowserRouter } from "react-router-dom";
import App from '../src/App';
import {Radar} from '../src/components/radar';
import { PrediccionCCAA } from "../src/components/PrediccionCCAA";



export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>
    },{
         path: "/radar",
        element: <Radar/>
    },{
         path: "/prediccion/:ccaa",
        element: <PrediccionCCAA/>
    }


]);