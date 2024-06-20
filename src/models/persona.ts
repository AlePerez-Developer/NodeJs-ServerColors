import { DataTypes, Model } from 'sequelize';
import conexion from '../db/dbConnection';
import Usuario from './usuario';

class Persona extends Model {
    declare CodigoPersona: number;
    declare IdPersona: string;
    declare Complemento: string;
    declare Expedido: string;
    declare Nombres: string;
    declare APaterno: string;
    declare AMaterno: string;
    declare Estado: string;

    async inUse() {
        const usuario = await Usuario.findOne({
            where: {
                Persona: this.CodigoPersona
            }
        })

        if (usuario)
            return true
        else
            return false
    }
}


Persona.init({
    CodigoPersona: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    IdPersona: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Debe ingresar un valor al campo IdPersona'
            }
        }
    },
    Complemento: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Expedido: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Nombres: {
        type: DataTypes.STRING,
        allowNull: true
    },
    APaterno: {
        type: DataTypes.STRING,
        allowNull: true
    },
    AMaterno: {
        type: DataTypes.STRING,
        allowNull: true
    },
    FechaCreacion: {
        type: DataTypes.DATE,
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
        tableName: 'Personas',
        timestamps: false,
    })

    Persona.hasOne(Usuario, {
        foreignKey: 'CPersona'
    })
    
    Usuario.belongsTo(Persona, {
        foreignKey: 'CPersona'
    })

export default Persona;