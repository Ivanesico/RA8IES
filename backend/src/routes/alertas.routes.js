import { Router } from 'express';
import * as tar from 'tar';
const router = Router();
const AEMET_BASE = "https://opendata.aemet.es/opendata/api/";
// *** NO FUNCIONA ***
///api/avisos_cap/ultimoelaborado/area/{area}
router.get("/avisos_cap/ultimoelaborado/area/:area", async (req, res) => {
    try {
        const { area } = req.params;
        const API_KEY = process.env.AEMET_API_KEY;

        // Si no encuentra API KEY lanza error
        if (!API_KEY) return res.status(500).json({
            success: false,
            error: 'Falta API KEY'
        });

        // Petición al endpoint
        const response = await fetch(AEMET_BASE + `avisos_cap/ultimoelaborado/area/${area}?api_key=${API_KEY}`);
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

        // Response2 devuelve un tar que contiene varios xml
        const tgzBuffer = Buffer.from(await response2.arrayBuffer());

        const xmlFiles = [];
        await tar.t({
            gzip: true,
            onentry: (entry) => {
                if (!entry.path.toLowerCase().endsWith('.xml')) {
                    entry.resume(); // saltar el contenido
                    return;
                }

                const chunks = [];
                entry.on('data', (c) => chunks.push(c));
                entry.on('end', () => {
                    const xml = Buffer.concat(chunks).toString('utf8'); // si ves caracteres raros, lo ajustamos
                    xmlFiles.push({ nombre: entry.path, xml });
                });
            }
        }, [], tgzBuffer);

        return res.json({ success: true, total: xmlFiles.length, data: xmlFiles });


    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener la predicción'
        });
    }
});

export default router;