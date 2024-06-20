import { DataTypes, Model } from 'sequelize';
import conexion from '../db/dbConnection';
import Habitacion from './habitacion';


class TipoHabitacion extends Model {
    declare CodigoTipoHabitacion: number;
    declare Descripcion: string;
    declare Estado: string;
    declare Usuario: number;

    async inUse() {
        const habitacion = await Habitacion.findOne({
            where: {
                CTipoHabitacion: this.CodigoTipoHabitacion
            }
        })

        if (habitacion)
            return true
        else
            return false
    }
}

TipoHabitacion.init({
    CodigoTipoHabitacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Descripcion: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
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
        tableName: 'TiposHabitacion',
        timestamps: false,
    })


TipoHabitacion.hasMany(Habitacion, {
    foreignKey: 'CTipoHabitacion'
})

Habitacion.belongsTo(TipoHabitacion, {
    foreignKey: 'CTipoHabitacion'
})

export default TipoHabitacion;