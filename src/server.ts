import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const masksRoute = require('./masks/routes/masks');

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
app.use('/masks', masksRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.info(`server has started on ${PORT}`));
