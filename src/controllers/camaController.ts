import { Request, Response } from "express";
import { Op } from "sequelize";
import Cama from "../models/cama";
import Habitacion from "../models/habitacion";

class camaController {
    static getCamas = async (req: Request, res: Response) => {
        const camas = await Cama.findAll({
            attributes: { exclude: ['FechaCreacion', 'Usuario'] },
            include: [
                {
                    model: Habitacion,
                    where: { Estado: 'V' },
                    attributes: { exclude: ['CodigoHabitacion', 'FechaCreacion', 'Estado'] },
                    required: true,
                }
            ],
        });

        if (camas) {
            res.json(camas);
        } else {
            res.status(404).json({
                msg: `No existen camas registradas`
            });
        }
    }

    static getCamasbyHabitacion = async (req: Request, res: Response) => {
        const { id } = req.params;

        const camas = await Cama.findAll({
            where: { Estado: 'V', Habitacion: id },
            attributes: { exclude: ['FechaCreacion', 'Usuario'] },
            include: [
                {
                    model: Habitacion,
                    where: { Estado: 'V' },
                    attributes: { exclude: ['CodigoHabitacion', 'FechaCreacion', 'Estado'] },
                    required: true,
                }
            ],
        });

        if (camas) {
            res.json(camas);
        } else {
            res.status(404).json({
                msg: `No existen camas registradas`
            });
        }
    }

    static getCamaById = async (req: Request, res: Response) => {
        const { id } = req.params;

        const cama = await Cama.findByPk(id, {
            attributes: { exclude: ['FechaCreacion', 'Usuario'] },
            include: [
                {
                    model: Habitacion,
                    where: { Estado: 'V' },
                    attributes: { exclude: ['CodigoHabitacion', 'FechaCreacion', 'Estado'] },
                    required: true,
                }
            ],
        })

        if (cama) {
            res.json(cama);
        } else {
            res.status(404).json({
                msg: `No existe una cama con id: ${id}`
            });
        }
    }

    static addNewCama = async (req: Request, res: Response) => {
        const { body } = req

        try {
           /* const Exists = await Cama.findOne({
                where: {
                    Descripcion: body.Descripcion,
                    CHabitacion: {
                        [Op.ne]: body.Habitacion,
                    }
                }
            })*/
let Exists = false
            if (Exists) {
                return res.status(400).json({
                    msg: `La cama: ${body.Descripcion} esta en uso actualmente`
                })
            }

            const cama = Cama.build(body)
            cama.CHabitacion = body.Habitacion
            cama.Estado = 'V'
            cama.Usuario = 1

            await cama.validate().then(async () => {
                await cama.save()
                return res.status(200).json({
                    msg: `La cama ${cama.Descripcion} se agrego correctamente`
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


    static updateCama = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { body } = req;

        try {

            const cama = await Cama.findByPk(id);
            if (cama) {

                /*const Exists = await Cama.findOne({
                    where: {
                        Descripcion: body.Descripcion,
                        CodigoCama: {
                            [Op.ne]: id,
                        },
                        CHabitacion: {
                            [Op.ne]: body.Habitacion,
                        }
                    }
                })*/
let Exists = false
                if (Exists) {
                    return res.status(400).json({
                        msg: `La cama ingresada esta en uso actualmente: ${body.Descripcion}`
                    })
                }

                await cama.update({
                    Descripcion: body.Descripcion,
                    CHabitacion: body.Habitacion,
                    Precio: body.Precio,
                    Color: body.Color
                });

                return res.status(200).json({
                    msg: `Cama actualizada correctamente`,
                })

            } else {
                res.status(404).json({
                    msg: `No existe una cama con id: ${id}`
                });
            }
        } catch (error) {
            let message
            if (error instanceof Error) message = error.message
            else message = String(error)
            console.log(message);
        }
    }

    static deleteCama = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const cama = await Cama.findByPk(id);
            if (cama) {
                if (await cama.inUse()) {
                    return res.status(400).json({
                        msg: `La cama no puede ser eliminada esta en uso ${id}`,
                    })
                }

                cama.destroy();
                return res.status(200).json({
                    msg: `Cama eliminada`,
                })
            } else {
                res.status(404).json({
                    msg: `No existe una cama con id: ${id}`
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
            const cama = await Cama.findByPk(id);
            if (cama) {
                let estado = (cama.Estado == 'V') ? 'C' : 'V';
                await cama.update({ Estado: estado });
                return res.status(200).json({
                    msg: `estado actualizado`
                })
            } else {
                res.status(404).json({
                    msg: `No existe una cama con id: ${id}`
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

export default camaController