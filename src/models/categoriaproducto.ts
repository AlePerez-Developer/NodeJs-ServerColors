import { DataTypes, Model } from 'sequelize';
import conexion from '../db/dbConnection';
import Producto from './producto';

class CategoriaProducto extends Model {
    declare CodigoCategoria: number;
    declare Descripcion: string;
    declare Estado: string;
    declare Usuario: number;

    async inUse() {
        const producto = await Producto.findOne({
            where: {
                Categoria: this.CodigoCategoria
            }
        })

        if (producto)
            return true
        else
            return false
    }
}

CategoriaProducto.init({
    CodigoCategoria: {
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
        tableName: 'CategoriasProductos',
        timestamps: false,
    })

    CategoriaProducto.hasMany(Producto, {
        foreignKey: 'CCategoria'
    })
    
    Producto.belongsTo(CategoriaProducto, {
        foreignKey: 'CCategoria',
        as:'Categoria'
    })

export default CategoriaProducto;