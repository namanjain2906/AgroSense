import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import connectDB from './configs/db.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cropRouter from './routes/cropRoutes.js';
import myfarmRouter from './routes/myfarmRoutes.js';
import geminiRouter from './routes/geminiRoutes.js';

const app = express();
const port = 3000;

await connectDB();


app.use(cors());
app.use(express.json());


app.use('/api/myfarm', myfarmRouter);
app.use('/api/gemini', geminiRouter);


app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Register route
app.post('/api/register', async (req, res) => {
  try {
    const { username, firstName, lastName, email, password } = req.body;
    if (!username || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, firstName, lastName, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required.' });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    // Create JWT token
  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

app.use('/api/crops', cropRouter);

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});