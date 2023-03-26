import { Request, Response } from "express";
import Usuario from "../models/usuario";
import { Op } from "sequelize"
import jwt from "jsonwebtoken";
import Persona from "../models/persona";
import Rol from "../models/rol";

class usuarioController {

    static getUsuarios = async (req: Request, res: Response) => {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['Pswd', 'FechaCreacion'] },
            include: [
                {
                    model: Persona,
                    where: { Estado: 'V' },
                    attributes: { exclude: ['CodigoPersona', 'FechaCreacion', 'Estado'] },
                    required: true,

                },
                {
                    model: Rol,
                    where: { Estado: 'V' },
                    attributes: { exclude: ['CodigoRol', 'FechaCreacion', 'Estado'] },
                    required: true
                }
            ],
            where: {
                CodigoUsuario: {
                    [Op.ne]: 1,
                }
            }
        });

        if (usuarios) {
            res.json(usuarios);
        } else {
            res.status(404).json({
                msg: `No existen usuarios registrados`
            });
        }
    }

    static getUsuarioById = async (req: Request, res: Response) => {
        const { id } = req.params;

        const usuario = await Usuario.findByPk(id, {
            attributes: { exclude: ['Pswd', 'FechaCreacion'] },
            include: [
                {
                    model: Persona,
                    where: { Estado: 'V' },
                    attributes: { exclude: ['CodigoPersona', 'FechaCreacion', 'Estado'] },
                    required: true,

                },
                {
                    model: Rol,
                    where: { Estado: 'V' },
                    attributes: { exclude: ['CodigoRol', 'FechaCreacion', 'Estado'] },
                    required: true
                }
            ]
        });
        if (usuario) {
            res.json({ usuario });
        } else {
            res.status(404).json({
                msg: `No existe un usuarios con id: ${id}`
            });
        }
    }

    static addNewUsuario = async (req: Request, res: Response) => {
        const { body } = req
        try {
            const ExistsLogin = await Usuario.findOne({
                where: {
                    Login: body.Login
                }
            })

            const ExistsCi = await Persona.findOne({
                where: {
                    IdPersona: body.IdPersona
                }
            })

            if (ExistsLogin) {
                return res.status(400).json({
                    msg: `El usuario: ${body.Login} esta en uso actualmente`
                })
            }

            if (ExistsCi) {
                return res.status(400).json({
                    msg: `El Ci: ${body.IdPersona} esta registrado actualmente`
                })
            }

            const persona = Persona.build(body)
            persona.Estado = 'V';

            await persona.validate().then(async () => {
                await persona.save()
            }).catch((error) => {
                return res.status(400).json({
                    msg: error.message
                })
            })

            const usuario = Usuario.build(body)
            usuario.Estado = 'V'
            usuario.CPersona = persona.CodigoPersona;
            usuario.CRol = 1
            await usuario.validate().then(async () => {

                await usuario.save()

                return res.status(200).json({
                    msg: `El usuario ${usuario.Login} se agrego correctamente`
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


    static updateUsuario = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { body } = req;

        try {
            const usuario = await Usuario.findByPk(id);
            if (usuario) {
                const ExistsLogin = await Usuario.findOne({
                    where: {
                        Login: body.Login,
                        CodigoUsuario: {
                            [Op.ne]: id,
                        }
                    }
                })

                if (ExistsLogin) {
                    return res.status(400).json({
                        msg: `El login ingresado esta en uso actualmente: ${body.Login}`
                    })
                }

                const persona = await Persona.findByPk(usuario.CPersona)
                if (persona) {
                    const ExistsCi = await Persona.findOne({
                        where: {
                            IdPersona: body.IdPersona,
                            CodigoPersona: {
                                [Op.ne]: usuario.CPersona,
                            }
                        }
                    })

                    if (ExistsCi) {
                        return res.status(400).json({
                            msg: `El Ci ingresado esta en uso actualmente: ${body.IdPersona}`
                        })
                    }

                    await persona.update({
                        IdPersona: body.IdPersona,
                        Expedido: body.Expedido,
                        Complemento: body.Complemento,
                        Nombres: body.Nombres,
                        APaterno: body.APaterno,
                        AMaterno: body.AMaterno,
                    })

                    await usuario.update({
                        Login: body.Login,
                    });

                    return res.status(200).json({
                        msg: `usuario actualizado correctamente`
                    })
                } else {
                    res.status(404).json({
                        msg: `No existe una persona con id: ${body.Persona.IdPersona}`
                    });
                }
            } else {
                res.status(404).json({
                    msg: `No existe un usuarios con id: ${id}`
                });
            }
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

    static deleteUsuario = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const usuario = await Usuario.findByPk(id);
            if (usuario) {
                if (await usuario.inUse()) {
                    return res.status(400).json({
                        msg: `el usuario no puede ser eliminado esta en uso ${id}`,
                    })
                }

                let cpersona = usuario.CPersona
                let usr = usuario.Login

                usuario.destroy().then(() => {
                    Persona.findByPk(cpersona).then((persona) => {
                        persona?.destroy().then(() => {
                            return res.status(200).json({
                                msg: `El usuario: ${usr}, fue eliminado correctamente`,
                            })
                        }).catch((error) => {
                            let message
                            if (error instanceof Error) message = error.message
                            else message = String(error)
                            console.log(error)
                            return res.status(400).json({
                                msg: `${message}`
                            })
                        })
                    }).catch(error => {
                        let message
                        if (error instanceof Error) message = error.message
                        else message = String(error)
                        console.log(error)
                        return res.status(400).json({
                            msg: `${message}`
                        })
                    })

                });

                // return res.status(200).json({
                //     msg: `usuario eliminado`,
                // })
            } else {
                res.status(404).json({
                    msg: `No existe un usuarios con id: ${id}`
                });
            }
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

    static loginUsuario = async (req: Request, res: Response) => {
        const { body } = req;

        try {
            const usuario = await Usuario.findOne({
                where: {
                    Login: body.Login,
                    Estado: 'V'
                }
            });
            if (usuario) {
                if (usuario.comparePswd(body.Pswd)) {
                    const token: string = jwt.sign({ _id: usuario.CodigoUsuario }, process.env['TOKEN_SECRET'] || '', { expiresIn: 60 * 60 * 24 });
                    return res.status(200).header('auth-token', token).json({
                        token: token,
                        msg: `ok`
                    })
                } else {
                    return res.status(400).json({
                        msg: `El nombre de usuario o contraseña no son validos`,
                    })
                }
            } else {
                res.status(404).json({
                    msg: `No existe un usuarios con nombre de usuario: ${body.Login}`
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
            const usuario = await Usuario.findByPk(id);
            if (usuario) {
                let estado = (usuario.Estado == 'V') ? 'C' : 'V';
                await usuario.update({ Estado: estado });
                return res.status(200).json({
                    msg: `estado actualizado`
                })
            } else {
                res.status(404).json({
                    msg: `No existe un usuarios con id: ${id}`
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

export default usuarioController;