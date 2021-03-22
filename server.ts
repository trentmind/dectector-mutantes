// Importar librerias base
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as mongoose from 'mongoose';

// Importar librerias locales
import router from './router/routesV1';
import config from './config/main';

// Inicializar base de datos
import dbconnection from './dbconnection/dbconnection';
dbconnection();

// Inicializacion de applicacion
const application = express();

// Middlewares
application.use(bodyParser.urlencoded({extended: false}));
application.use(bodyParser.json());
application.use(cookieParser());
application.use(logger('dev'));
application.use(helmet());
application.use(cors());

// Configuracion de enrutador
router(application);

// Inicializar Servidor
let server;

if(process.env.NODE_ENV !== config.test_env){
    server = application.listen(config.port, () => {
        console.log('server listening on port ${config.port}');
    });
}
else{
    server = application.listen(config.test_port, () => {
        console.log('server listening on port ${config.test_port}');
    })
}

export default server;