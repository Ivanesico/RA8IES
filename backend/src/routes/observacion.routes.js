import { Router } from 'express';
const router = Router();
const AEMET_BASE = "https://opendata.aemet.es/opendata/api/";

//https://opendata.aemet.es/opendata/api/observacion/convencional/todas

//Obtiene estado del tiempo actual
router.get("/observacion/convencional/todas", async (req, res) => {
    try {
        // Obtiene API KEY del .env
        const API_KEY = process.env.AEMET_API_KEY;
        if (!API_KEY) {
            console.log("Falta la API KEY")
            return res.status(500).json({
                success: false,
                error: 'Falta la API KEY'
            })
        };
        // Petición al endpoint
        const response = await fetch(AEMET_BASE + 'observacion/convencional/todas?api_key=' + API_KEY);
        if (!response.ok) {
            throw new Error('Error HTTP: ' + response.status);
        }
      
        // Recoge los datos de la llamada
        const meta = await response.json();

        // Si no encuentra el campo datos en el json lanza error
        if (!meta?.datos) {
            return res.status(502).json({
                success: false,
                error: 'AEMET no devolvió url con datos'
            })
        };
        // Petición a la nueva url proporcionada del campo datos
        const response2 = await fetch(meta.datos);
         if (!response2.ok) {
            throw new Error('Error HTTP (2ª): ' + response2.status);
        }
      
        // Pasa la respuesta a json
        const tiempo = await response2.json();
        res.json({
            success: true,
            total: tiempo.length,
            data: tiempo
        });

    } catch (error) {
        console.error("Error al consultar la API: ", error.message);
        res.status(500).json({
            success: false,
            detalles: error.message
        });
    }
});

export default router;