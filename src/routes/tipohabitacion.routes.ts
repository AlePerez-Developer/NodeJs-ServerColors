import { Router } from "express";
import tipohabitacionController from "../controllers/tipohabitacionController"; 


const router = Router()

router.get('/', tipohabitacionController.getTipos)

router.post('/', tipohabitacionController.addNewTipo)

router.get('/:id', tipohabitacionController.getTipoById)

router.get('/change/:id', tipohabitacionController.changeStatus)

router.delete('/:id', tipohabitacionController.deleteTipo)

router.put('/:id', tipohabitacionController.updateTipo)


export default router