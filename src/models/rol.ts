import { DataTypes, Model } from 'sequelize';
import conexion from '../db/connection';
import Usuario from './usuario';


class Rol extends Model {
    declare CodigoRol: number;
    declare Descripcion: string;
    declare Estado: string;

    async inUse() {
        const usuario = await Usuario.findOne({
            where: {
                Rol: this.CodigoRol
            }
        })

        if (usuario)
            return true
        else
            return false
    }
}


Rol.init({
    CodigoRol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    FechaCreacion: {
        type: DataTypes.DATE,
    },
    Estado: {
        type: DataTypes.CHAR,
        allowNull: false
    }
},
    {
        sequelize: conexion,
        tableName: 'Roles',
        timestamps: false,
    })
    
    Rol.hasMany(Usuario, {
        foreignKey: 'CRol'
    })
    
    Usuario.belongsTo(Rol, {
        foreignKey: 'CRol'
    })


export default Rol;