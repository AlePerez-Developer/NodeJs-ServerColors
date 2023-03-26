import { DataTypes, Model } from 'sequelize';
import conexion from '../db/connection';
import Usuario from './usuario';

class DatosCheckIn extends Model {
    declare Reserva: number
    declare FechaCheckIn: Date
    declare Genero: string
    declare Edad: number
    declare EstadoMarital: string
    declare Nacionalidad: string
    declare Profesion: string
    declare Objetivo: string
    declare Destino: string
    declare Estado: string;
}


DatosCheckIn.init({
    Reserva: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Debe ingresar un valor al campo Reserva'
            }
        }
    },
    FechaCheckIn: {
        type: DataTypes.DATE,
    },
    Genero: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Edad: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    EstadoMarital: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Nacionalidad: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Profesion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Objetivo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Destino3: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Estado: {
        type: DataTypes.CHAR,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Debe ingresar un valor al campo estado'
            }
        }
    }
},
    {
        sequelize: conexion,
        tableName: 'DatosCheckIn',
        timestamps: false,
    })



export default DatosCheckIn;