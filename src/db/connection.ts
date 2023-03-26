import { Sequelize } from "sequelize";
import dbConfig from "../config";

const config = new dbConfig();

const conexion = new Sequelize(config.dbDatabase, config.dbUser, config.dbPassword, {
  host: config.dbServer,
  dialect: 'mssql',
  logging: false
});

export default conexion;