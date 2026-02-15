import express from 'express';
import cors from 'cors';
//Importar rutas
import prediccionesRoutes from './routes/predicciones.routes.js';
import observacionRoutes from './routes/observacion.routes.js';
import redradaresRoutes from './routes/redradares.router.js';
import alertasRoutes from './routes/alertas.routes.js';

const app = express()

//Middleware
app.use(cors());
app.use(express.json());

//Rutas
app.use('/api/aemet', prediccionesRoutes);
app.use('/api/aemet', observacionRoutes);
app.use('/api/aemet', redradaresRoutes);
app.use('/api/aemet', alertasRoutes);



//Middleware para rutas no encontradas y errores
app.use((req,res)=>{
    res.status(404).json({
        mensaje: 'No encontrado'
    });
});

//Middleware de manejo de errores
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).json({
        error: 'Error en el servidor.'
    });
});

export default app;

