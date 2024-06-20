import { DataTypes, Model } from 'sequelize';
import conexion from '../db/dbConnection';

class Servicio extends Model {
    declare CodigoServicio: number
    declare Nombre: string
    declare Descripcion: string
    declare Medida: string
    declare PrecioUnitario: number
    declare Estado: string
    declare Usuario: number

    async inUse() {
        // const cama = await Cama.findOne({
        //     where: {
        //         Habitacion: this.CodigoHabitacion
        //     }
        // })

        // if (cama)
        //     return true
        // else
        //     return false
        return false
    }
}


Servicio.init({
    CodigoServicio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Debe ingresar un valor al nombre'
            }
        }
    },
    Descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Debe ingresar un valor a la descripcion'
            }
        }
    },
    Medida: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Debe ingresar un valor a la medida'
            }
        }
    },
    PrecioUnitario: {
        type: DataTypes.NUMBER,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Debe ingresar un valor al campo precio de compra'
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
        tableName: 'Servicios',
        timestamps: false,
    })

export default Servicio;