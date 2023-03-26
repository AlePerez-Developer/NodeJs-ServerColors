import { DataTypes, Model } from 'sequelize';
import conexion from '../db/connection';


class Cama extends Model {
    declare CodigoCama: number
    declare Descripcion: string
    declare Precio: number
    declare CHabitacion: number
    declare Estado: string
    declare Usuario: number

    inUse() {
        return false
    }
}


Cama.init({
    CodigoCama: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    CHabitacion: {
        type: DataTypes.INTEGER,
        allowNull: false ,
        field: 'Habitacion',
        validate: {
            notNull: {
                msg: 'Debe ingresar un valor al campo habitacion'
            }
        }    
    },
    Descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Debe ingresar un valor al descripcion'
            }
        }   
    },
    Precio: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    Color: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    FechaCreacion: {
        type: DataTypes.DATE,
    },
    Estado: {
        type: DataTypes.CHAR,
        allowNull: false
    },
    Usuario: {
        type: DataTypes.NUMBER,
        allowNull: false
    }
},
    {
        sequelize: conexion,
        tableName: 'Camas',
        timestamps: false,
    })


export default Cama;