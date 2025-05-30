import 'tsconfig-paths/register';
import { DATABASE_URL } from '@/config/env/env';
import { ApiPrefix } from '@/constants';
import dotenv from 'dotenv';
import express from 'express';
import { CorsConfig, setHeaders } from '../config';
import MongoHelpers from '../lib/Mongo/MongoHelpers';
import { GlobalHandleError } from './errors';
import { handleNotFound } from './routes';
import routerApplication from './routes/router';
import limiter from './middleware/rateLimit/limiter';
import helmer from 'helmet';
import { setupSwagger } from '@/config/swagger/config';

dotenv.config();
const app = express();

// Conexion a la base de datos (En este caso una de mongoDB)
MongoHelpers.createDatabaseConnection(DATABASE_URL);

// Configuracion
app.use(helmer());
app.use(setHeaders);
app.use(CorsConfig());

app.use(express.json());
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(limiter); // Aplicar el limitador de velocidad a todas las solicitudes

// Configura Swagger entre los primeros middlewares
setupSwagger(app);

// Rutas
app.use(ApiPrefix, routerApplication);

// Route not found
app.use('*', handleNotFound);

// Middleware global para el manejo de errores
app.use(GlobalHandleError);

// Configuración
app.disable('x-powered-by');

export default app;
