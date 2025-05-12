import express from "express";
import usersRoutes from './routes/users.route.js'
import { connectToDB } from "../config/mongodb.js";
import morgan from "morgan";

const port = 3000;

const app = express();
app.use(express.json());

app.use(morgan('dev'))

connectToDB();
app.use('/api', usersRoutes);


app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})