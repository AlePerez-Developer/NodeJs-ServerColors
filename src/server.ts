import express, { Application } from "express";
import usrRoutes from "./routes/usuario.routes";
import tipohabitacionRoutes from "./routes/tipohabitacion.routes"
import habitacionRoutes from "./routes/habitacion.routes"
import formacobroRoutes from "./routes/formacobro.routes"
import camaRoutes from "./routes/cama.routes"
import categoriaproductoRoutes from "./routes/categoriaproducto.routes"
import productoRoutes from "./routes/producto.routes"
import servicioRoutes from "./routes/servicio.routes"
import reservaRoutes from "./routes/reserva.routes"
import personaRoutes from "./routes/persona.routes"
import cors from "cors";
import db from "./db/dbConnection";

class Server {
    private app: Application;
    private port: string;
    private apiPath = {
        usuarios: '/api/usr',
        tipos: '/api/tipoh',
        formas: '/api/formac',
        habitaciones: '/api/habitacion',
        camas: '/api/cama',
        catprod: '/api/categoria',
        producto: '/api/producto',
        servicio: '/api/servicio',
        reserva: '/api/reserva',
        persona: '/api/persona'
    };

    constructor() {
        this.app = express();
        this.port = process.env.port || '3000';

        this.dbConnection();
        this.middlewares();
        this.routes();
    }

    async dbConnection() {
        try {
            await db.authenticate();
            console.log('db online')
        } catch (error) {
            let message
            if (error instanceof Error) message = error.message
            else message = String(error)
            console.log(message);
        }
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        //Json Parse
        this.app.use(express.json());

        //Carpeta Public
        this.app.use(express.static('src/public'));
    }

    routes() {
        this.app.use(this.apiPath.usuarios, usrRoutes)
        this.app.use(this.apiPath.tipos, tipohabitacionRoutes)
        this.app.use(this.apiPath.formas, formacobroRoutes)
        this.app.use(this.apiPath.habitaciones, habitacionRoutes)
        this.app.use(this.apiPath.camas, camaRoutes)
        this.app.use(this.apiPath.catprod, categoriaproductoRoutes)
        this.app.use(this.apiPath.producto, productoRoutes)
        this.app.use(this.apiPath.servicio, servicioRoutes)
        this.app.use(this.apiPath.reserva, reservaRoutes)
        this.app.use(this.apiPath.persona, personaRoutes)
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto: ' + this.port);
        })
    }
}

export default Server;