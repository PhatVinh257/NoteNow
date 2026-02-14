import express from 'express'
import dotenv from 'dotenv'
import db from './config/db.js'
import taskRoute from './routes/taskRoute.js'
import cors from 'cors'
import path from 'path'
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5001
const __dirname = path.resolve()
//Middlewares
app.use(express.json())
// Production không gặp trường hợp cors
if (process.env.NODE_ENV !== 'production') { 
 app.use(cors({origin:"http://localhost:5173"}))
}
app.use("/api/tasks", taskRoute)
//Phần Code chỉ nên chạy ở Production
if (process.env.NODE_ENV === 'production') { 
 app.use(express.static(path.join(__dirname, "../frontend/dist")))
// Bất kì đường dẫn nào từ Browser cũng trả về index.html để react router lo phần điều hướng
// app.get("*", (req, res) => { 
//  res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
// })
}
//------------------
db.connect().then(()=>{
 app.listen(PORT, () => { 
 console.log(`SERVER IS RUNNING ON ${PORT}`)
})
 })


