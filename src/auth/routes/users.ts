import express from 'express';
import bcrypt from 'bcrypt';
const router = express.Router();
import User from '../models/user';
import jwt from 'jsonwebtoken';

router.post('/register', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  if (!(email && password)) {
    res.status(400).send('All input is required');
  }

  const oldUser = await User.findOne({ email });
  if (oldUser) {
    return res.status(409).send({ message: 'Toks elektroninio pašto adresas jau egzistuoja' });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: encryptedPassword, firstName, lastName, role: 'user' });

  const savedUser = await user.save((err: any) => {
    if (err) res.status(500).send(err);
  });

  const token = jwt.sign({ user_id: savedUser?._id, email }, process.env.TOKEN_KEY, {
    expiresIn: '2h',
  });

  user.token = token;

  res.status(200).send(user);
});

router.post('/login', async (req, res) => {
  // Get user input
  const { email, password } = req.body;

  // Validate user input
  if (!(email && password)) {
    res.status(400).send('All input is required');
  }
  // Validate if user exist in our database
  const user = await User.findOne({ email });
  try {
    const isValidPassword = await bcrypt.compare(password, user?.password);
    if (user && isValidPassword) {
      // Create token
      const token = jwt.sign({ user_id: user._id, email }, process.env.TOKEN_KEY, {
        expiresIn: '2h',
      });

      // save user token
      user.token = token;
      // user
      res.status(200).send(user);
    } else {
      res.status(401).send('Invalid Credentials');
    }
  } catch {
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put('/changePassword/:id', async (req, res) => {
  const { password, newPassword } = req.body;

  if (!(password && newPassword)) {
    res.status(400).send('All input is required');
  }

  try {
    const user = await User.findById(req.params.id);
    const isValidPassword = await bcrypt.compare(password, user?.password);
    if (user && isValidPassword) {
      const encryptedPassword = await bcrypt.hash(newPassword, 10);
      user.password = encryptedPassword;
      const savedUser = await user.save();
      res.status(200).send(savedUser);
    } else {
      res.status(401).send('Invalid Credentials');
    }
  } catch {
    res.status(500).send('Internal Server Error');
  }
});

export default router;
