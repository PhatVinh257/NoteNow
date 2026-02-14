import express from 'express'
import dotenv from 'dotenv'
import db from './config/db.js'
import taskRoute from './routes/taskRoute.js'
import cors from 'cors'
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5001
//Middlewares
app.use(express.json())
app.use(cors({origin:"http://localhost:5173"}))
app.use("/api/tasks", taskRoute)

db.connect().then(()=>{
 app.listen(PORT, () => { 
 console.log(`SERVER IS RUNNING ON ${PORT}`)
})
 })


