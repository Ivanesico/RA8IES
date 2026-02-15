import { Router } from 'express';
const router = Router();
const AEMET_BASE = "https://opendata.aemet.es/opendata/api/";

// https://opendata.aemet.es/opendata/api/red/radar/nacional
// Obtiene un mapa del radar de españa
router.get("/red/radar/nacional", async (req, res) => {
    try {
        // Recoge la API KEY
        const API_KEY = process.env.AEMET_API_KEY;
        if (!API_KEY) return res.status(500).json({
            success: false,
            error: "Falta API KEY"
        });

        // Petición al endpoint
        const response = await fetch(AEMET_BASE + 'red/radar/nacional?api_key=' + API_KEY);
        if (!response.ok) {
            throw new Error("Error HTTP: " + response.status);
        }

        // Recoge los datos de la llamada
        const meta = await response.json();
        if (!meta?.datos) return res.status(502).json({
            success: false,
            error: 'AEMET no devolvió url con datos'
        })

        const response2 = await fetch(meta.datos);
        if (!response2.ok) {
            throw new Error("Error HTTP 2º: " + response2.status);
        }

        // Nos devuelve una imagen response2
        const contentType = response2.headers.get('content-type') || 'image/png';
        const mapa = Buffer.from(await response2.arrayBuffer());

        res.setHeader('Content-Type', contentType);
        // Envía binario, no JSON
        return res.send(mapa);

    } catch (error) {
        console.error("Error al consultar la API: ", error);
        res.status(500).json({
            success: false,
            detalles: error.message
        });
    }
})
// https://opendata.aemet.es/opendata/api/red/radar/regional/{radar}

// Obtiene mapa por región
router.get("/red/radar/regional/{radar}", async (req, res) => {
    try {

        //Obtiene la API KEY
        const API_KEY = process.env.AEMET_API_KEY;
        const { radar } = req.params;
        if (!API_KEY) return res.status(500).json({
            success: false,
            error: "Error al obtener la API KEY"
        });
        // Petición al endpoint
        const response = await fetch(AEMET_BASE + `/red/radar/regional/${radar}?api_key=${API_KEY}`);

        if (!response.ok) {
            throw new Error("Error en HTTP:" + response.status);
        }
        const meta = await response.json();
        if (!meta?.datos) return res.status(502).json({
            success: false,
            error: 'AEMET no devolvió url con datos'
        });

         // Response2 nos devuelve una imagen 
        const contentType = response2.headers.get('content-type') || 'image/png';
        const mapa = Buffer.from(await response2.arrayBuffer());

        res.setHeader('Content-Type', contentType);
        // Envía binario, no JSON
        return res.send(mapa);

    } catch (error) {
        console.log("Error al consultar la API KEY:", error.message);
        res.status(500).json({
            success: false,
            detalles: error.message
        });
    }
});

export default router;