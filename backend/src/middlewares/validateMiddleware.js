export const validate = (schema) => (req, res, next) => { 
 const { error } = schema.validate(req.body, { abortEarly: false })
 if (error) { 
  const errorMsg = error.message
  return res.status(400).json({message:errorMsg})
 }
 next()
}