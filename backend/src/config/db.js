import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()
const db = new pg.Client({
 user: process.env.USER_PG,
 host: process.env.HOST_PG,
 database: process.env.DB_PG,
 password: process.env.PASSWORD_PG,
 port: process.env.PORT_PG
})
export default db