import { Request, Response } from "express";
import { Op } from "sequelize";
import FormaCobro from "../models/formacobro";
import TipoHabitacion from "../models/tipohabitacion";

class formacobroController {
    static getFormas = async (req: Request, res: Response) => {
        const formacobro = await FormaCobro.findAll({
            attributes: { exclude: ['FechaCreacion'] },
        });

        if (formacobro) {
            res.status(200).json(formacobro);
        } else {
            res.status(404).json({
                msg: `No existen tipos de habitacion registrados`
            });
        }
    }
}

export default formacobroController