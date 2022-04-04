const auth = require("./middleware/auth");
import usersRoute from './auth/routes/users';
import express from 'express'
const mongoose = require('mongoose')
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config();

const { MONGODB_HOSTNAME, MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_PORT } = process.env;

mongoose.connect(
    `mongodb://${MONGODB_HOSTNAME}:${MONGODB_PORT}`,
    {
        dbName: 'masketplace',
        user: MONGODB_USERNAME,
        pass: MONGODB_PASSWORD,
    },
    (err: any) => {
        err ? console.info(err) : console.info('connected to database');
    }
);

const app = express();
app.use(cors());
app.use(express.json());
app.use('/users', usersRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.info(`server has started on ${PORT}`));