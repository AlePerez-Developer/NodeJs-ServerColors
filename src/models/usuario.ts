import { DataTypes, Model } from 'sequelize';
import conexion from '../db/connection';
import bcrypt from 'bcrypt';
import Habitacion from './habitacion';


class Usuario extends Model {
    declare CodigoUsuario: number;
    declare CPersona: number;
    declare CRol: number;
    declare Login: string;
    declare Pswd: string;
    declare Estado: string;

    async inUse() {
        const habitacion = await Habitacion.findOne({
            where: {
                Usuario: this.CodigoUsuario
            }
        })

        if (habitacion)
            return true
        else
            return false
    }

    comparePswd(pswd: string) {
        return bcrypt.compareSync(pswd, this.Pswd);
    }
}


Usuario.init({
    CodigoUsuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Login: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    Pswd: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value: string) {
            const saltRounds = 10;
            const hash = bcrypt.hashSync(value, saltRounds);
            this.setDataValue('Pswd', hash);
        }
    },
    CPersona: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'Persona',
        validate: {
            notNull: {
                msg: 'Debe ingresar un valor al campo persona'
            }
        }
    },
    CRol: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'Rol',
        validate: {
            notNull: {
                msg: 'Debe ingresar un valor al campo Rol'
            }
        }
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
        tableName: 'Usuarios',
        timestamps: false,
    })


export default Usuario;