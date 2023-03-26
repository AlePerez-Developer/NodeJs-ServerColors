import { Request, Response } from "express";
import { Op } from "sequelize";
import CategoriaProducto from "../models/categoriaproducto";

class categoriaproductoController {
    static getCategorias = async (req: Request, res: Response) => {
        const categorias = await CategoriaProducto.findAll({
            attributes: { exclude: ['FechaCreacion'] },
        });

        if (categorias) {
            res.status(200).json(categorias);
        } else {
            res.status(404).json({
                msg: `No existen categorias registradas`
            });
        }
    }

    static getCategoriaById = async (req: Request, res: Response) => {
        const { id } = req.params;

        const categoria = await CategoriaProducto.findByPk(id, {
            attributes: { exclude: ['FechaCreacion'] },
        });
        if (categoria) {
            res.json(categoria);
        } else {
            res.status(404).json({
                msg: `No existe una categoria con id: ${id}`
            });
        }
    }

    static addNewCategoria = async (req: Request, res: Response) => {
        const { body } = req
        try {
            const Exists = await CategoriaProducto.findOne({
                where: {
                    Descripcion: body.Descripcion
                }
            })

            if (Exists) {
                return res.status(400).json({
                    msg: `La categoria: ${body.Descripcion} esta en uso actualmente`
                })
            }

            const categoria = CategoriaProducto.build(body)
            categoria.Estado = 'V'
            categoria.Usuario = 1

            await categoria.validate().then(async () => {
                await categoria.save()
                return res.status(200).json({
                    msg: `La categoria: ${categoria.Descripcion} se agrego correctamente`
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


    static updateCategoria = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { body } = req;

        try {
            const categoria = await CategoriaProducto.findByPk(id);
            if (categoria) {

                const Exists = await CategoriaProducto.findOne({
                    where: {
                        Descripcion: body.Descripcion,
                        CodigoCategoria: {
                            [Op.ne]: id,
                        }
                    }
                })

                if (Exists) {
                    return res.status(400).json({
                        msg: `La categoria: ${body.Descripcion} esta en uso actualmente`
                    })
                }

                await categoria.update({ 
                    Descripcion: body.Descripcion, 
                 });

                return res.status(200).json({
                    msg: `Categoria actualizada correctamente`,
                })

            } else {
                res.status(404).json({
                    msg: `No existe una categoria con id: ${id}`
                });
            }
        } catch (error) {
            let message
            if (error instanceof Error) message = error.message
            else message = String(error)
            console.log(message);
        }
    }

    static deleteCategoria = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const categoria = await CategoriaProducto.findByPk(id);
            if (categoria) {
                if (await categoria.inUse()) {
                    return res.status(400).json({
                        msg: `La categoria seleccionada se encuentra en uso`,
                    })
                }

                categoria.destroy();
                return res.status(200).json({
                    msg: `Categoria eliminada correctamente`,
                })
            } else {
                res.status(404).json({
                    msg: `No existe una categoria con id: ${id}`
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
            const categoria = await CategoriaProducto.findByPk(id);
            if (categoria) {
                let estado = (categoria.Estado == 'V') ? 'C' : 'V';
                await categoria.update({ Estado: estado });
                return res.status(200).json({
                    msg: `estado actualizado`
                })
            } else {
                res.status(404).json({
                    msg: `No existe una categoria con id: ${id}`
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

export default categoriaproductoController