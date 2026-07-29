import 'dotenv/config';
import express from 'express';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import platformRoutes from './routes/platform.routes';
import usersRoutes from './routes/users.routes';

const app = express();
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/platform', platformRoutes);
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));