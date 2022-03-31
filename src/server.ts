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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.info(`server has started on ${PORT}`));

// create a schema that contains: unique email, password and role
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
});
const User = mongoose.model('User', userSchema);

app.post('/api/register', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = new User({ email, password, role: 'user' });
    await user.save((err: any) => {
        err ? res.status(500).send(err) : res.status(200).send('user registered');
    });
});

app.post('/api/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email, password });
    if (!user) {
        res.status(401).send('invalid email or password');
    } else {
        res.status(200).send(user);
    }
});