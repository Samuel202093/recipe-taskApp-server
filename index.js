import express from 'express';
import cors from 'cors';
import dotenv from "dotenv"
import colors from 'colors'
import path  from 'path';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import routes from './routes/index.js'
const port = process.env.PORT || 7000
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config()


// Connecting to database
connectDB()


// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

app.get('/', (req,res)=>{
    res.status(200).send('Hello World.........')
})


app.listen(port, ()=>{
    console.log(`server running on port: ${port}`)
})

export default app;