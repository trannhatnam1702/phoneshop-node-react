import express from "express";
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from "morgan";
import connectDB from "./config/db.js";
import Author from './routes/Author.js';
import Category from './routes/Category.js';
import Product from './routes/Product.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from 'axios';

const app = express();

dotenv.config();

connectDB();

//middlewares
app.use(cors());
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use('/api/v1/auth', Author);
app.use('/api/v1/category', Category);
app.use('/api/v1/product', Product);


app.get('/', (req, res) => {
    res.send('Hello');
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`.bgCyan.white);
});
