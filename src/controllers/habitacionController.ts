import { Request, Response } from "express";
import { Op } from "sequelize";
import FormaCobro from "../models/formacobro";
import Habitacion from "../models/habitacion";
import TipoHabitacion from "../models/tipohabitacion";

class HabitacionController {
    static getHabitaciones = async (req: Request, res: Response) => {
        const habitacion = await Habitacion.findAll({
            attributes: { exclude: ['FechaCreacion', 'Usuario'] },
            include: [
                {
                    model: TipoHabitacion,
                    where: { Estado: 'V' },
                    attributes: { exclude: ['CodigoTipoHabitacion', 'FechaCreacion', 'Estado'] },
                    required: true,
                },
                {
                    model: FormaCobro,
                    where: { Estado: 'V' },
                    attributes: { exclude: ['CodigoFormaCobro', 'FechaCreacion', 'Estado'] },
                    required: true,
                }
            ],
        });

        if (habitacion) {
            res.json(habitacion);
        } else {
            res.status(404).json({
                msg: `No existen habitaciones registradas`
            });
        }
    }

    static getHabitacionById = async (req: Request, res: Response) => {
        const { id } = req.params;

        const habitacion = await Habitacion.findByPk(id, {
            attributes: { exclude: ['FechaCreacion', 'Usuario'] },
            include: [
                {
                    model: TipoHabitacion,
                    where: { Estado: 'V' },
                    attributes: { exclude: ['CodigoTipoHabitacion', 'FechaCreacion', 'Estado'] },
                    required: true,
                },
                {
                    model: FormaCobro,
                    where: { Estado: 'V' },
                    attributes: { exclude: ['CodigoFormaCobro', 'FechaCreacion', 'Estado'] },
                    required: true,
                }
            ],
        });
        if (habitacion) {
            res.json(habitacion);
        } else {
            res.status(404).json({
                msg: `No existe una habitacion con id: ${id}`
            });
        }
    }

    static addNewHabitacion = async (req: Request, res: Response) => {
        const { body } = req

        try {
            const Exists = await Habitacion.findOne({
                where: {
                    Descripcion: body.Descripcion
                }
            })

            if (Exists) {
                return res.status(400).json({
                    msg: `La habitacion: ${body.Descripcion} esta en uso actualmente`
                })
            }

            const habitacion = Habitacion.build(body)
            habitacion.CTipoHabitacion = body.TipoHabitacion
            habitacion.CFormaCobro = body.FormaCobro
            habitacion.Estado = 'V'
            habitacion.Usuario = 1

            await habitacion.validate().then(async () => {      

                await habitacion.save()
                return res.status(200).json({
                    msg: `La habitacion ${habitacion.Descripcion} se agrego correctamente`
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


    static updateHabitacion = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { body } = req;

        try {
            const habitacion = await Habitacion.findByPk(id);
            if (habitacion) {

                const Exists = await Habitacion.findOne({
                    where: {
                        Descripcion: body.Descripcion,
                        CodigoHabitacion: {
                            [Op.ne]: id,
                        }
                    }
                })

                if (Exists) {
                    return res.status(400).json({
                        msg: `La habitacion ingresada esta en uso actualmente: ${body.Descripcion}`
                    })
                }
                await habitacion.update({
                    Descripcion: body.Descripcion,
                    CTipoHabitacion: body.TipoHabitacion,
                    WebRef: body.WebRef,
                    CFormaCobro: body.FormaCobro
                });

                return res.status(200).json({
                    msg: `Habitacion actualizada correctamente`,
                })

            } else {
                res.status(404).json({
                    msg: `No existe una habitacion con id: ${id}`
                });
            }
        } catch (error) {
            let message
            if (error instanceof Error) message = error.message
            else message = String(error)
            console.log(message);
        }
    }

    static deleteHabitacion = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const habitacion = await Habitacion.findByPk(id);
            if (habitacion) {
                if (await habitacion.inUse()) {
                    return res.status(400).json({
                        msg: `La habitacion no puede ser eliminada esta en uso ${id}`,
                    })
                }

                habitacion.destroy();
                return res.status(200).json({
                    msg: `habitacion eliminada`,
                })
            } else {
                res.status(404).json({
                    msg: `No existe uuna habitacion con id: ${id}`
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
            const habitacion = await Habitacion.findByPk(id);
            if (habitacion) {
                let estado = (habitacion.Estado == 'V') ? 'C' : 'V';
                await habitacion.update({ Estado: estado });
                return res.status(200).json({
                    msg: `estado actualizado`
                })
            } else {
                res.status(404).json({
                    msg: `No existe una habitacion con id: ${id}`
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

export default HabitacionController