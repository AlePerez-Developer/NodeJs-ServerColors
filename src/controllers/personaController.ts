import { Request, Response } from "express";
import { Op } from "sequelize";
import Persona from "../models/persona";

class PersonaController {
    static getPersonas = async (req: Request, res: Response) => {
        const persona = await Persona.findAll({
            attributes: { exclude: ['FechaCreacion', 'Usuario'] },
        });

        if (persona) {
            res.json(persona);
        } else {
            res.status(404).json({
                msg: `No existen personas registradas`
            });
        }
    }

    static getPersonaById = async (req: Request, res: Response) => {
        const { id } = req.params;

        const persona = await Persona.findByPk(id, {
            attributes: { exclude: ['FechaCreacion', 'Usuario'] },
        });
        if (persona) {
            res.json(persona);
        } else {
            res.status(404).json({
                msg: `No existe una persona con id: ${id}`
            });
        }
    }

    static addNewPersona = async (req: Request, res: Response) => {
        const { body } = req

        try {
            const Exists = await Persona.findOne({
                where: {
                    IdPersona: body.IdPersona
                }
            })

            if (Exists) {
                return res.status(400).json({
                    msg: `La persona: ${body.IdPersona} esta en uso actualmente`
                })
            }

            const persona = Persona.build(body)
            persona.Estado = 'V'

            await persona.validate().then(async () => {      

                await persona.save()
                return res.status(200).json({
                    msg: `La persona ${persona.IdPersona} se agrego correctamente`,
                    id: persona.CodigoPersona
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


    static updatePersona = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { body } = req;

        try {
            const persona = await Persona.findByPk(id);
            if (persona) {

                const Exists = await Persona.findOne({
                    where: {
                        IdPersona: body.IdPersona,
                        CodigoPersona: {
                            [Op.ne]: id,
                        }
                    }
                })

                if (Exists) {
                    return res.status(400).json({
                        msg: `La persona ingresada esta en uso actualmente: ${body.Descripcion}`
                    })
                }
                await persona.update({
                    IdPersona: body.IdPersona,
                    Expedido: body.Expedido,
                    APaterno: body.APaterno,
                    AMaterno: body.AMaterno,
                    Nombres: body.Nombres
                });

                return res.status(200).json({
                    msg: `Persona actualizada correctamente`,
                })

            } else {
                res.status(404).json({
                    msg: `No existe una persona con id: ${id}`
                });
            }
        } catch (error) {
            let message
            if (error instanceof Error) message = error.message
            else message = String(error)
            console.log(message);
        }
    }

    static deletePersona = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const persona = await Persona.findByPk(id);
            if (persona) {
                if (await persona.inUse()) {
                    return res.status(400).json({
                        msg: `La persona no puede ser eliminada esta en uso ${id}`,
                    })
                }

                persona.destroy();
                return res.status(200).json({
                    msg: `persona eliminada`,
                })
            } else {
                res.status(404).json({
                    msg: `No existe uuna persona con id: ${id}`
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
            const persona = await Persona.findByPk(id);
            if (persona) {
                let estado = (persona.Estado == 'V') ? 'C' : 'V';
                await persona.update({ Estado: estado });
                return res.status(200).json({
                    msg: `estado actualizado`
                })
            } else {
                res.status(404).json({
                    msg: `No existe una persona con id: ${id}`
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

export default PersonaController