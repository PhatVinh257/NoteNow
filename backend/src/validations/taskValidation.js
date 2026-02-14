import Joi from 'joi'

export const taskSchema = Joi.object({
 title: Joi.string().max(255).trim().required().messages({
  'string.empty': 'Title không được để trống',
  'string.max': 'Title không được vượt quá 255 ký tự'
 }),
 description: Joi.string().allow('', null),
 is_completed: Joi.boolean()
})
