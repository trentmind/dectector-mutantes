import * as express from 'express';

import {
    checkDNA
} from '../controllers/mutantController'

import{
    returnStats
} from '../controllers/StatsController'

// Funcion que toma como parametro la aplicacion y registras las urls de los endpoints del REST API
export default(app) =>{
    
    const apiRoutes = express.Router();
    const mutantsRoutes = express.Router();
    const statsRoutes = express.Router();

    //Registrar las rutas de los servicios de mutante y estadisticas
    apiRoutes.use('/mutant', mutantsRoutes);
    apiRoutes.use('/stats', statsRoutes);

    //Registrar el llamado de la funcion de chequear DNA
    mutantsRoutes.post('/', checkDNA);
    statsRoutes.get('/', returnStats);

    //Registrar todas las rutas en la aplicacion
    app.use('/api', apiRoutes);
}