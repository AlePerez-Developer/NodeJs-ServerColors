import { Request, Response } from "express";
import { Op } from "sequelize";
import Servicio from "../models/servicio";


class ServicioController {
    static getServicios = async (req: Request, res: Response) => {
        const servicios = await Servicio.findAll({
            attributes: { exclude: ['FechaCreacion', 'Usuario'] },
        });

        if (servicios) {
            res.json(servicios);
        } else {
            res.status(404).json({
                msg: `No existen servicios registrados`
            });
        }
    }

    static getServicioById = async (req: Request, res: Response) => {
        const { id } = req.params;

        const servicio = await Servicio.findByPk(id, {
            attributes: { exclude: ['FechaCreacion', 'Usuario'] },
        });
        if (servicio) {
            res.json(servicio);
        } else {
            res.status(404).json({
                msg: `No existe un servicio con id: ${id}`
            });
        }
    }

    static addNewServicio = async (req: Request, res: Response) => {
        const { body } = req

        try {
            const Exists = await Servicio.findOne({
                where: {
                    Nombre: body.Nombre,
                    Descripcion: body.Descripcion
                }
            })

            if (Exists) {
                return res.status(400).json({
                    msg: `El servicio: ${body.Nombre} - ${body.Descripcion} esta en uso actualmente`
                })
            }

            const servicio = Servicio.build(body)
            servicio.Estado = 'V'
            servicio.Usuario = 1

            await servicio.validate().then(async () => {      
                await servicio.save()
                return res.status(200).json({
                    msg: `El servicio: ${body.Nombre} - ${body.Descripcion} se agrego correctamente`
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


    static updateServicio = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { body } = req;

        try {
            const servicio = await Servicio.findByPk(id);
            if (servicio) {
                const Exists = await Servicio.findOne({
                    where: {
                        Nombre: body.Nombre,
                        Descripcion: body.Descripcion,
                        CodigoServicio: {
                            [Op.ne]: id,
                        }
                    }
                })

                if (Exists) {
                    return res.status(400).json({
                        msg: `El servicio: ${body.Nombre} - ${body.Descripcion} esta en uso actualmente`
                    })
                }
                await servicio.update({
                    Nombre: body.Nombre,
                    Descripcion: body.Descripcion,
                    Medida: body.Medida,
                    PrecioUnitario: body.PrecioUnitario,
                });

                return res.status(200).json({
                    msg: `Servicio actualizado correctamente`,
                })

            } else {
                res.status(404).json({
                    msg: `No existe un servicio con id: ${id}`
                });
            }
        } catch (error) {
            let message
            if (error instanceof Error) message = error.message
            else message = String(error)
            console.log(message);
        }
    }

    static deleteServicio = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const servicio = await Servicio.findByPk(id);
            if (servicio) {
                if (await servicio.inUse()) {
                    return res.status(400).json({
                        msg: `El servicio: ${servicio.Nombre} - ${servicio.Descripcion} no puede ser eliminado, esta en uso actualmente`,
                    })
                }

                servicio.destroy();
                return res.status(200).json({
                    msg: `Servicio eliminado correctamente`,
                })
            } else {
                res.status(404).json({
                    msg: `No existe un servicio con id: ${id}`
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
            const servicio = await Servicio.findByPk(id);
            if (servicio) {
                let estado = (servicio.Estado == 'V') ? 'C' : 'V';
                await servicio.update({ Estado: estado });
                return res.status(200).json({
                    msg: `estado actualizado`
                })
            } else {
                res.status(404).json({
                    msg: `No existe un servicio con id: ${id}`
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

export default ServicioController