import { DataTypes, Model } from 'sequelize';
import conexion from '../db/dbConnection';
import Cama from './cama';
import Persona from './persona';

class Reserva extends Model {
    declare CodigoReserva: number;
    declare CPersona: number;
    declare CCama: number;
    declare LugarProcedencia: string;
    declare RefWeb: string;
    declare FechaInicio: Date;
    declare FechaFin: Date;
    declare Estado: string;
    declare Usuario: number

    async inUse() {
        return false
    }
}

Reserva.init({
    CodigoReserva: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    CPersona: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'Persona',
        validate: {
            notNull: {
                msg: 'Debe ingresar un valor al Persona'
            }
        }

    },
    CCama: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'Cama',
        validate: {
            notNull: {
                msg: 'Debe ingresar un valor al Cama'
            }
        }

    },
    LugarProcedencia: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Debe ingresar un valor al lugar de procedencia'
            }
        }
    },
    RefWeb: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    FechaInicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Debe ingresar un valor al campo fecha inicio'
            }
        }
    },
    FechaFin: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Debe ingresar un valor al campo fecha fin'
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
        tableName: 'Reservas',
        timestamps: false,
    })

Persona.hasOne(Reserva, {
    foreignKey: 'CPersona'
})

Reserva.belongsTo(Persona, {
    foreignKey: 'CPersona'
})

Cama.hasOne(Reserva, {
    foreignKey: 'CCama'
})
  
Reserva.belongsTo(Cama, {
    foreignKey: 'CCama'
})

export default Reserva;