import { DataTypes, Model } from 'sequelize';
import conexion from '../db/connection';
import Cama from './cama';
import FormaCobro from './formacobro';
import TipoHabitacion from './tipohabitacion';

class Habitacion extends Model {
    declare CodigoHabitacion: number
    declare CTipoHabitacion: number
    declare Descripcion: string
    declare WebRef: string
    declare CFormaCobro: number
    declare Estado: string
    declare Usuario: number

    async inUse() {
        const cama = await Cama.findOne({
            where: {
                Habitacion: this.CodigoHabitacion
            }
        })

        if (cama)
            return true
        else
            return false
    }
}


Habitacion.init({
    CodigoHabitacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    CTipoHabitacion: {
        type: DataTypes.INTEGER,
        allowNull: false ,
        field: 'TipoHabitacion',
        validate: {
            notNull: {
                msg: 'Debe ingresar un valor al campo tipo habitacion'
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
    WebRef: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    CFormaCobro: {
        type: DataTypes.INTEGER,
        allowNull: false ,
        field: 'FormaCobro',
        validate: {
            notNull: {
                msg: 'Debe ingresar un valor al campo forma de cobro'
            }
        }    
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
        tableName: 'Habitaciones',
        timestamps: false,
    })


    Habitacion.hasMany(Cama, {
        foreignKey: 'CHabitacion'
    })
    
    Cama.belongsTo(Habitacion, {
        foreignKey: 'CHabitacion'
    })


export default Habitacion;