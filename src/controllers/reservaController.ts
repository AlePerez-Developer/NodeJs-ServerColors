import { Request, Response } from "express";
import { Op } from "sequelize";
import Cama from "../models/cama";
import Persona from "../models/persona";
import Reserva from "../models/reserva";

class ReservaController {
    static getReservas = async (req: Request, res: Response) => {
        const reserva = await Reserva.findAll({
            attributes: { exclude: ['FechaCreacion', 'Usuario'] },
            include: [
                {
                    model: Persona,
                    where: { Estado: 'V' },
                    attributes: { exclude: ['CodigoPersona', 'FechaCreacion', 'Estado'] },
                    required: true,
                },
                {
                    model: Cama,
                    where: { Estado: 'V' },
                    attributes: { exclude: ['CodigoCama', 'FechaCreacion', 'Estado'] },
                    required: true,
                }
            ],
        });

        if (reserva) {
            res.json(reserva);
        } else {
            res.status(404).json({
                msg: `No existen reservas registradas`
            });
        }
    }

    static getReservasByCama = async (req: Request, res: Response) => {
        const { id } = req.params;

        const reserva = await Reserva.findAll({
            where: { estado: ['V', 'R'], Cama: id },
            attributes: { exclude: ['FechaCreacion', 'Usuario'] },
            include: [
                {
                    model: Persona,
                    where: { Estado: 'V' },
                    attributes: { exclude: ['CodigoPersona', 'FechaCreacion', 'Estado'] },
                    required: true,
                },
                {
                    model: Cama,
                    where: { Estado: 'V' },
                    attributes: { exclude: ['FechaCreacion', 'Estado'] },
                    required: true,
                }
            ],
        });

        if (reserva) {
            res.json(reserva);
        } else {
            res.status(404).json({
                msg: `No existen reservas registradas`
            });
        }
    }

    static getReservasById = async (req: Request, res: Response) => {
        const { id } = req.params;

        const reserva = await Reserva.findByPk(id, {
            attributes: { exclude: ['FechaCreacion', 'Usuario'] },
            include: [
                {
                    model: Persona,
                    where: { Estado: 'V' },
                    attributes: { exclude: ['FechaCreacion', 'Estado'] },
                    required: true,
                },
                {
                    model: Cama,
                    where: { Estado: 'V' },
                    attributes: { exclude: ['FechaCreacion', 'Estado'] },
                    required: true,
                }
            ],
        });

        if (reserva) {
            res.json(reserva);
        } else {
            res.status(404).json({
                msg: `No existen reservas registradas`
            });
        }
    }

    static addNewReserva = async (req: Request, res: Response) => {
        const { body } = req

        try {
            const reserva = Reserva.build(body)
            reserva.CPersona = body.Persona
            reserva.CCama = body.Cama
            reserva.Usuario = 1

            await reserva.validate().then(async () => {

                await reserva.save()
                return res.status(200).json({
                    msg: `La reserva se agrego correctamente`
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


    static updateReserva = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { body } = req;

        try {
            const reserva = await Reserva.findByPk(id);
            if (reserva) {

                await reserva.update({
                    Persona: body.Persona,
                    Cama: body.Cama,
                    LugarProcedencia: body.LugarProcedencia,
                    FechaInicio: body.FechaInicio,
                    FechaFin: body.FechaFin
                });

                return res.status(200).json({
                    msg: `Reserva actualizada correctamente`,
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

    static deleteReserva = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {

            const reserva = await Reserva.findByPk(id);
            if (reserva) {


                reserva.Estado = 'C'
                reserva.update({
                    Estado: 'C'
                })


                return res.status(200).json({
                    msg: `reserva eliminada`,
                })
            } else {
                res.status(404).json({
                    msg: `No existe una reserva con id: ${id}`
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
            const reserva = await Reserva.findByPk(id);
            if (reserva) {
                let estado = (reserva.Estado == 'V') ? 'C' : 'V';
                await reserva.update({ Estado: estado });
                return res.status(200).json({
                    msg: `estado actualizado`
                })
            } else {
                res.status(404).json({
                    msg: `No existe una reserva con id: ${id}`
                });
            }
        } catch (error) {
            let message
            if (error instanceof Error) message = error.message
            else message = String(error)
            console.log(message);
        };
    }


    static check = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const reserva = await Reserva.findByPk(id);
            if (reserva) {
                await reserva.update({ Estado: 'V' });
                return res.status(200).json({
                    msg: `estado actualizado`
                })
            } else {
                res.status(404).json({
                    msg: `No existe una reserva con id: ${id}`
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

export default ReservaController