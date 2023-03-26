import { Request, Response } from "express";
import { Op } from "sequelize";
import CategoriaProducto from "../models/categoriaproducto";
import Producto from "../models/producto";

class ProductoController {
    static getProductos = async (req: Request, res: Response) => {
        const productos = await Producto.findAll({
            attributes: { exclude: ['FechaCreacion', 'Usuario'] },
            include: [
                {
                    model: CategoriaProducto,
                    as:'Categoria',
                    where: { Estado: 'V' },
                    attributes: { exclude: ['CodigoCategoria', 'FechaCreacion', 'Estado', 'Usuario'] },
                    required: true
                    
                }
            ],
        });

        if (productos) {
            res.json(productos);
        } else {
            res.status(404).json({
                msg: `No existen productos registrados`
            });
        }
    }

    static getProductoById = async (req: Request, res: Response) => {
        const { id } = req.params;

        const producto = await Producto.findByPk(id, {
            attributes: { exclude: ['FechaCreacion', 'Usuario'] },
            include: [
                {
                    model: CategoriaProducto,
                    as:'Categoria',
                    where: { Estado: 'V' },
                    attributes: { exclude: ['FechaCreacion', 'Estado'] },
                    required: true,
                }
            ],
        });
        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({
                msg: `No existe un producto con id: ${id}`
            });
        }
    }

    static addNewProducto = async (req: Request, res: Response) => {
        const { body } = req

        try {
            const Exists = await Producto.findOne({
                where: {
                    Nombre: body.Nombre,
                    Descripcion: body.Descripcion
                }
            })

            if (Exists) {
                return res.status(400).json({
                    msg: `El producto: ${body.Nombre} - ${body.Descripcion} esta en uso actualmente`
                })
            }

            const producto = Producto.build(body)
            producto.CCategoria = body.Categoria
            producto.Estado = 'V'
            producto.Usuario = 1

            await producto.validate().then(async () => {      
                await producto.save()
                return res.status(200).json({
                    msg: `El producto: ${body.Nombre} - ${body.Descripcion} se agrego correctamente`
                })
            }).catch(error => {
                return res.status(400).json({
                    msg: error.message
                })
            })

        } catch (error) {
            let message
            if (error instanceof Error) message = error.message
            else message = String(error)
            console.log(error)
            return res.status(400).json({
                msg: `${message}`
            })
        }
    }


    static updateProducto = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { body } = req;

        try {
            const producto = await Producto.findByPk(id);
            if (producto) {
                const Exists = await Producto.findOne({
                    where: {
                        Nombre: body.Nombre,
                        Descripcion: body.Descripcion,
                        CodigoProducto: {
                            [Op.ne]: id,
                        }
                    }
                })

                if (Exists) {
                    return res.status(400).json({
                        msg: `El producto: ${body.Nombre} - ${body.Descripcion} esta en uso actualmente`
                    })
                }
                await producto.update({
                    CCategoria: body.Categoria,
                    Nombre: body.Nombre,
                    Descripcion: body.Descripcion,
                    PrecioVenta: body.PrecioVenta,
                    PrecioCompra: body.PrecioCompra,
                });

                return res.status(200).json({
                    msg: `Producto actualizado correctamente`,
                })

            } else {
                res.status(404).json({
                    msg: `No existe un producto con id: ${id}`
                });
            }
        } catch (error) {
            let message
            if (error instanceof Error) message = error.message
            else message = String(error)
            console.log(message);
        }
    }

    static deleteProducto = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const producto = await Producto.findByPk(id);
            if (producto) {
                if (await producto.inUse()) {
                    return res.status(400).json({
                        msg: `El producto: ${producto.Nombre} - ${producto.Descripcion} no puede ser eliminado, esta en uso actualmente`,
                    })
                }

                producto.destroy();
                return res.status(200).json({
                    msg: `Producto eliminado correctamente`,
                })
            } else {
                res.status(404).json({
                    msg: `No existe un producto con id: ${id}`
                });
            }
        } catch (error) {
            let message
            if (error instanceof Error) message = error.message
            else message = String(error)
            console.log(message);
        }
    }

    static changeStatus = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const producto = await Producto.findByPk(id);
            if (producto) {
                let estado = (producto.Estado == 'V') ? 'C' : 'V';
                await producto.update({ Estado: estado });
                return res.status(200).json({
                    msg: `estado actualizado`
                })
            } else {
                res.status(404).json({
                    msg: `No existe un producto con id: ${id}`
                });
            }
        } catch (error) {
            let message
            if (error instanceof Error) message = error.message
            else message = String(error)
            console.log(message);
        };
    }
}

export default ProductoController