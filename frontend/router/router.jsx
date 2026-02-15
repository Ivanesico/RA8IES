import { createBrowserRouter } from "react-router-dom";
import App from '../src/App';
import {Radar} from '../src/components/radar';



export const router = createBrowserRouter([
    {
        path: "/",
        element: <Radar/>
    }

]);