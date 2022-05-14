import express from 'express';
const mongoose = require('mongoose');
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const auth = require('./middleware/auth');
const masksRoute = require('./masks/routes/masks');
import usersRoute from './auth/routes/users';
import pointsRoute from './recycling/routes/recycling_points';

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
app.use('/users', usersRoute);
app.use('/points', pointsRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.info(`server has started on ${PORT}`));
