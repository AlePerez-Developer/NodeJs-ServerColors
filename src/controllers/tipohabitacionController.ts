import { Request, Response } from "express";
import { Op } from "sequelize";
import TipoHabitacion from "../models/tipohabitacion";

class tipohabitacionController {
    static getTipos = async (req: Request, res: Response) => {
        const tipohabitacion = await TipoHabitacion.findAll({
            attributes: { exclude: ['FechaCreacion'] },
        });

        if (tipohabitacion) {
            res.status(200).json(tipohabitacion);
        } else {
            res.status(404).json({
                msg: `No existen tipos de habitacion registrados`
            });
        }
    }

    static getTipoById = async (req: Request, res: Response) => {
        const { id } = req.params;

        const tipohabitacion = await TipoHabitacion.findByPk(id, {
            attributes: { exclude: ['FechaCreacion'] },
        });
        if (tipohabitacion) {
            res.json(tipohabitacion);
        } else {
            res.status(404).json({
                msg: `No existe un tipo de habitacion con id: ${id}`
            });
        }
    }

    static addNewTipo = async (req: Request, res: Response) => {
        const { body } = req
        try {
            const Exists = await TipoHabitacion.findOne({
                where: {
                    Descripcion: body.Descripcion
                }
            })

            if (Exists) {
                return res.status(400).json({
                    msg: `El tipo de habitacion: ${body.Descripcion} esta en uso actualmente`
                })
            }

            const tipohabitacion = TipoHabitacion.build(body)
            tipohabitacion.Estado = 'V'
            tipohabitacion.Usuario = 1

            await tipohabitacion.validate().then(async () => {
                await tipohabitacion.save()
                return res.status(200).json({
                    msg: `El tipo de habitacion ${tipohabitacion.Descripcion} se agrego correctamente`
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


    static updateTipo = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { body } = req;

        try {
            const tipohabitacion = await TipoHabitacion.findByPk(id);
            if (tipohabitacion) {

                const Exists = await TipoHabitacion.findOne({
                    where: {
                        Descripcion: body.Descripcion,
                        CodigoTipoHabitacion: {
                            [Op.ne]: id,
                        }
                    }
                })

                if (Exists) {
                    return res.status(400).json({
                        msg: `El tipo de habitacion ingresado esta en uso actualmente: ${body.Descripcion}`
                    })
                }

                await tipohabitacion.update({ 
                    Descripcion: body.Descripcion, 
                 });

                return res.status(200).json({
                    msg: `Tipo de habitacion actualizado correctamente`,
                })

            } else {
                res.status(404).json({
                    msg: `No existe un tipo de habitacion con id: ${id}`
                });
            }
        } catch (error) {
            let message
            if (error instanceof Error) message = error.message
            else message = String(error)
            console.log(message);
        }
    }

    static deleteTipo = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const tipohabitacion = await TipoHabitacion.findByPk(id);
            if (tipohabitacion) {
                if (await tipohabitacion.inUse()) {
                    return res.status(400).json({
                        msg: `el tipo de habitacion no puede ser eliminado esta en uso`,
                    })
                }

                
                tipohabitacion.destroy();
                return res.status(200).json({
                    msg: `Tipo de habitacion eliminado`,
                })
            } else {
                res.status(404).json({
                    msg: `No existe un tipo de habitacion con id: ${id}`
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
            const tipohabitacion = await TipoHabitacion.findByPk(id);
            if (tipohabitacion) {
                let estado = (tipohabitacion.Estado == 'V') ? 'C' : 'V';
                await tipohabitacion.update({ Estado: estado });
                return res.status(200).json({
                    msg: `estado actualizado`
                })
            } else {
                res.status(404).json({
                    msg: `No existe un tipo de habitacion con id: ${id}`
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

export default tipohabitacionController