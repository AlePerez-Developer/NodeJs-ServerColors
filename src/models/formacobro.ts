import { DataTypes, Model } from 'sequelize';
import conexion from '../db/connection';
import Habitacion from './habitacion';


class FormaCobro extends Model {
    declare CodigoFormaCobro: number;
    declare Descripcion: string;
    declare Estado: string;
    declare Usuario: number;

    async inUse() {
        const habitacion = await Habitacion.findOne({
            where: {
                CFormaCobro: this.CodigoFormaCobro
            }
        })

        if (habitacion)
            return true
        else
            return false
    }
}

FormaCobro.init({
    CodigoFormaCobro: {
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
        tableName: 'FormasCobro',
        timestamps: false,
    })

    FormaCobro.hasMany(Habitacion,{
        foreignKey: 'CFormaCobro'
    })
    
    Habitacion.belongsTo(FormaCobro,{
        foreignKey: 'CFormaCobro'
    })

export default FormaCobro;