import { Router } from 'express';
import { parseAemetCcaaPrediction } from '../utils/ccaaParser.js';
import { parseAemetProvinciaPrediction } from '../utils/provinciaParser.js';

const router = Router();
const AEMET_BASE = "https://opendata.aemet.es/opendata/api/";

//https://opendata.aemet.es/opendata/api/prediccion/provincia/hoy/01
// Obtener predicción de hoy por provincia
router.get("/prediccion/provincia/hoy/:provincia", async (req, res) => {
    try {

        const { provincia } = req.params;
        const API_KEY = process.env.AEMET_API_KEY;

        // Si no encuentra API KEY lanza error
        if (!API_KEY) return res.status(500).json({
            success: false,
            error: 'Falta API KEY'
        });
        console.log("provincia param:", provincia);
        // Petición al endpoint
        const response = await fetch(AEMET_BASE + `prediccion/provincia/hoy/${provincia}?api_key=${API_KEY}`);
        if (!response.ok) {
            throw new Error('Error HTTP: ' + response.status);
        }
        console.log("meta status:", response.status);
        //Recogemos datos del endpoint
        const meta = await response.json();
        console.log("meta.datos:", meta.datos);
        console.log("meta.metadatos:", meta.metadatos);
        // Si no encontramos dentro del json al campo datos devuelve fallo
        // La variable datos devuelve un url con los datos finales
        if (!meta?.datos) return res.status(502).json({
            success: false,
            error: 'AEMET no devolvió url con datos'
        });

        // Petición a la url
        const response2 = await fetch(meta.datos);

        if (!response2.ok) {
            throw new Error('Error recogida datos de url: ' + response2.status);
        }
        // Recogemos el resultado que nos da de texto y lo convertimos en json
        const texto = await response2.arrayBuffer();
        if (!texto) {
            return res.status(502).json({ success: false, error: "AEMET devolvió texto vacío" });
        }
        const rawText = new TextDecoder("latin1").decode(texto);
        // Loguea cosas que identifican el boletín
        console.log("raw starts:", rawText.slice(0, 120));
        console.log("raw zona line:", rawText.match(/PREDICCIÓN.*\n/i)?.[0]);
        console.log("raw contiene ALBACETE:", rawText.includes("ALBACETE"));
        console.log("raw contiene BADAJOZ:", rawText.includes("BADAJOZ"));
        const prediccion = parseAemetProvinciaPrediction(rawText);
        // Enviamos la respuesta en json
        res.json({
            success: true,
            data: prediccion
        });

    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener la predicción'
        });
    }
});

//Obtener preddicion de mañana por provincia
router.get("/prediccion/provincia/manana/:provincia", async (req, res) => {
    try {
        const { provincia } = req.params;
        const API_KEY = process.env.AEMET_API_KEY;
        // Si no encuentra la API KEY lanza error
        if (!API_KEY) {
            console.error('Error al obtener API KEY', error);
            res.status(500).json({
                success: false,
                error: 'Falta API KEY'
            });
        }
        // Petición al endpoint
        const response = await fetch(AEMET_BASE + `prediccion/provincia/manana/${provincia}?api_key=${API_KEY}`);
        if (!response.ok) {
            throw new Error('Error HTTP: ' + response.status);
        }
        // Recogemos datos del endpoint
        const meta = await response.json();
        // Si no encontramos dentro del json la variable datos donde devuelve fallo
        // La variable datos devuelve un url con los datos finales
        if (!meta?.datos) {
            return res.status(502).json({
                success: false,
                error: "AEMET no devolvió url con datos"
            })
        }
        // Petición a la url
        const response2 = await fetch(meta.datos);

        if (!response2.ok) {
            throw new Error('Error en la recogida de datos de url' + response2.status);
        }
        // Recogemos el resultado que nos da de texto y lo convertimos en json
        const texto = await response2.arrayBuffer();
        if (!texto) {
            return res.status(502).json({ success: false, error: "AEMET devolvió texto vacío" });
        }
        const rawText = new TextDecoder("latin1").decode(texto);
        const prediccion = parseAemetProvinciaPrediction(rawText);
        res.json({
            success: true,
            data: prediccion
        });
    } catch (error) {
        console.error('Error', error);
        res.status(500).json({
            success: false,
            error: "Error al obtener la predicción"
        });
    }
});

//Obtener prediccion de hoy de CCAA
router.get("/prediccion/ccaa/hoy/:ccaa", async (req, res) => {
    try {

        const { ccaa } = req.params;
        const API_KEY = process.env.AEMET_API_KEY;

        // Si no encuentra API KEY lanza error
        if (!API_KEY) return res.status(500).json({
            success: false,
            error: 'Falta API KEY'
        });

        // Petición al endpoint
        const response = await fetch(AEMET_BASE + `prediccion/ccaa/hoy/${ccaa}?api_key=${API_KEY}`);

        if (!response.ok) {
            throw new Error('Error HTTP: ' + response.status);
        }
        //Recogemos datos del endpoint
        const meta = await response.json();
        // Si no encontramos dentro del json al campo datos devuelve fallo
        // La variable datos devuelve un url con los datos finales
        if (!meta?.datos) return res.status(502).json({
            success: false,
            error: 'AEMET no devolvió url con datos'
        });

        // Petición a la url
        const response2 = await fetch(meta.datos);

        if (!response2.ok) {
            throw new Error('Error recogida datos de url: ' + response2.status);
        }
        // Recogemos el resultado que nos da de texto y lo convertimos en json
        const texto = await response2.arrayBuffer();
        if (!texto) {
            return res.status(502).json({ success: false, error: "AEMET devolvió texto vacío" });
        }
        const rawText = new TextDecoder("latin1").decode(texto);
        const prediccion = parseAemetCcaaPrediction(rawText);

        // Enviamos la respuesta en json
        res.json({
            success: true,
            data: prediccion
        });

    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            success: false,
            error: error?.message ?? String(error),
        });
    }
});

//Obtener prediccion de manana de CCAA
router.get("/prediccion/ccaa/manana/:ccaa", async (req, res) => {
    try {

        const { ccaa } = req.params;
        const API_KEY = process.env.AEMET_API_KEY;

        // Si no encuentra API KEY lanza error
        if (!API_KEY) return res.status(500).json({
            success: false,
            error: 'Falta API KEY'
        });

        // Petición al endpoint
        const response = await fetch(AEMET_BASE + `prediccion/ccaa/manana/${ccaa}?api_key=${API_KEY}`);
        if (!response.ok) {
            throw new Error('Error HTTP: ' + response.status);
        }
        //Recogemos datos del endpoint
        const meta = await response.json();
        // Si no encontramos dentro del json al campo datos devuelve fallo
        // La variable datos devuelve un url con los datos finales
        if (!meta?.datos) return res.status(502).json({
            success: false,
            error: 'AEMET no devolvió url con datos'
        });

        // Petición a la url
        const response2 = await fetch(meta.datos);

        if (!response2.ok) {
            throw new Error('Error recogida datos de url: ' + response2.status);
        }
        // Recogemos el resultado que nos da de texto y lo convertimos en json
        const texto = await response2.arrayBuffer();
        if (!texto) {
            return res.status(502).json({ success: false, error: "AEMET devolvió texto vacío" });
        }
        const rawText = new TextDecoder("latin1").decode(texto);
        const prediccion = parseAemetCcaaPrediction(rawText);
        // Enviamos la respuesta en json
        res.json({
            success: true,
            data: prediccion
        });

    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener la predicción'
        });
    }
});
export default router;