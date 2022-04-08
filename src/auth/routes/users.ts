import express from 'express';
import bcrypt from 'bcrypt';
const router = express.Router();
import User from '../models/user';
import jwt from "jsonwebtoken";

router.post('/register', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    if (!(email && password)) {
        res.status(400).send("All input is required");
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
        return res.status(409).send("User Already Exists. Please Login");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: encryptedPassword, firstName, lastName, role: 'user' });

    const savedUser = await user.save((err: any) => {
        if(err) res.status(500).send(err)
    });

    const token = jwt.sign(
        { user_id: savedUser?._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
    );

    user.token = token;

    res.status(200).send(user);
});

router.post('/login', async (req, res) => {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
        res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });        
    try {
        const isValidPassword = await bcrypt.compare(password, user?.password);
        if (user && isValidPassword) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
        
            // save user token
            user.token = token;
            // user
            res.status(200).send(user);
        }
        else{
            res.status(401).send("Invalid Credentials");
        }
    }
    catch {
        res.status(500).send("Internal Server Error");
    }
});

export default router;