import express from "express";
import usersRoutes from './routes/users.route.js'

const port = 3000;

const app = express();


app.use('/api', usersRoutes);

app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})