import express from 'express'
import { createTask, deleteTask, getAllTask, updateTask } from '../controllers/taskController.js'
import { taskSchema } from '../validations/taskValidation.js'
import { validate } from '../middlewares/validateMiddleware.js'
const router = express.Router()
router.get('/',getAllTask)
router.post('/',validate(taskSchema),createTask)
router.put('/:id',updateTask)
router.delete('/:id',deleteTask)

export default router