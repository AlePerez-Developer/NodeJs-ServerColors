import { DataTypes, Model } from 'sequelize';
import conexion from '../db/connection';
import CategoriaProducto from './categoriaproducto';
import categoria from './categoriaproducto';


class Producto extends Model {
    declare CodigoProducto: number
    declare CCategoria: number
    declare Nombre: string
    declare Descripcion: string
    declare PrecioCompra: number
    declare PrecioVenta: number
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


Producto.init({
    CodigoProducto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    CCategoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field:'Categoria',
        references: {
            model: CategoriaProducto,
            key: 'CodigoCategoria'
        },
        validate: {
            notNull: {
                msg: 'Debe ingresar un valor al campo categoria'
            }
        }
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
    PrecioCompra: {
        type: DataTypes.NUMBER,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Debe ingresar un valor al campo precio de compra'
            }
        }
    },
    PrecioVenta: {
        type: DataTypes.NUMBER,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Debe ingresar un valor al campo precio de venta'
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
        tableName: 'Productos',
        timestamps: false,
    })

export default Producto;