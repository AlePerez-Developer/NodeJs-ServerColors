import { Request, Response } from "express";
import { validationResult } from 'express-validator';
import { Op } from "sequelize";
import TipoHabitacion from "../models/tipohabitacion";

class tipohabitacionController {
    static getTipos = async (req: Request, res: Response) => {
        const tipohabitacion = await TipoHabitacion.findAll({
            where: {
                Estado: {
                    [Op.not]: 'E'
                }
            },
            attributes: {
                exclude: ['FechaCreacion']
            }
        }).catch(error => {
            return res.status(500).json({
                msg: error.message
            })
        });

        if (!tipohabitacion) {
            return res.status(200).json({
                msg: `No existen tipos de habitacion registrados`
            });
        }

        return res.status(200).json({
            msg: 'ok',
            data: tipohabitacion
        }
        );
    }

    static getTipoById = async (req: Request, res: Response) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(200).json({
                msg: result.array().map(err => err.msg)[0]
            });
        }

        const { id } = req.params;

        const tipohabitacion = await TipoHabitacion.findByPk(id, {
            attributes: { exclude: ['FechaCreacion'] },
        }).catch(error => {
            return res.status(500).json({
                msg: error.message
            })
        });

        if (!tipohabitacion) {
            return res.status(200).json({
                msg: `No existe un tipo de habitacion con id: ${id}`
            });
        }

        return res.json(tipohabitacion);
    }

    static addNewTipo = async (req: Request, res: Response) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(200).json({
                msg: result.array().map(err => err.msg)[0]
            });
        }

        const { body } = req

        try {
            const Exists = await TipoHabitacion.findOne({
                where: {
                    Descripcion: body.Descripcion
                }
            }).catch(error => {
                return res.status(500).json({
                    msg: error.message
                })
            });

            if (Exists) {
                return res.status(200).json({
                    msg: `El tipo de habitacion: ${body.Descripcion} esta en uso actualmente`
                })
            }

            const tipohabitacion = TipoHabitacion.build(body)
            tipohabitacion.Estado = 'V'
            tipohabitacion.Usuario = 1

            await tipohabitacion.validate().then(async () => {
                await tipohabitacion.save().then(() => {
                    return res.status(200).json({
                        msg: `El tipo de habitacion ${tipohabitacion.Descripcion} se agrego correctamente `
                    })
                })
            }).catch(error => {
                return res.status(200).json({
                    msg: `El tipo de habitacion ${tipohabitacion.Descripcion} se agrego correctamente `
                })
            })

        } catch (error) {
            let message
            if (error instanceof Error) message = error.message
            else message = String(error)
            return res.status(500).json({
                msg: `${message}`
            })
        }
    }


    static updateTipo = async (req: Request, res: Response) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(200).json({
                msg: result.array().map(err => err.msg)[0]
            });
        }

        const { id } = req.params;
        const { body } = req;

        try {
            const tipohabitacion = await TipoHabitacion.findByPk(id);

            if (!tipohabitacion) {
                return res.status(200).json({
                    msg: `No existe un tipo de habitacion con id: ${id}`
                });
            }

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
                    return res.status(200).json({
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
                res.status(200).json({
                    msg: `No existe un tipo de habitacion con id: ${id}`
                });
            }
        } catch (error) {
            let message
            if (error instanceof Error) message = error.message
            else message = String(error)
            return res.status(500).json({
                msg: `${message}`
            })
        }
    }

    static deleteTipo = async (req: Request, res: Response) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(200).json({
                msg: result.array().map(err => err.msg)[0]
            });
        }

        const { id } = req.params;

        try {
            const tipohabitacion = await TipoHabitacion.findByPk(id);

            if (!tipohabitacion) {
                return res.status(200).json({
                    msg: `No existe un tipo de habitacion con id: ${id}`
                });
            }

            if (await tipohabitacion.inUse()) {
                return res.status(200).json({
                    msg: `el tipo de habitacion no puede ser eliminado esta en uso`,
                })
            }

            await tipohabitacion.update({
                Estado: 'E',
            }).then(() => {
                return res.status(200).json({
                    msg: `Tipo de habitacion eliminado correctamente`,
                })
            });
        } catch (error) {
            let message
            if (error instanceof Error) message = error.message
            else message = String(error)
        }
    }

    static changeStatus = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const tipohabitacion = await TipoHabitacion.findByPk(id);

            if (!tipohabitacion) {
                return res.status(404).json({
                    msg: `No existe un tipo de habitacion con id: ${id}`
                });
            }

            let estado = (tipohabitacion.Estado == 'V') ? 'C' : 'V';

            await tipohabitacion.update({ Estado: estado }).then(() => {
                return res.status(200).json({
                    msg: `estado actualizado`
                })
            }).catch(err => {

            });
        } catch (error) {
            let message
            if (error instanceof Error) message = error.message
            else message = String(error)
        };
    }
}

export default tipohabitacionController