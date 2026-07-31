import 'dotenv/config';
import express from 'express';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import platformRoutes from './routes/platform.routes';
import usersRoutes from './routes/users.routes';
import classesRoutes from './routes/classes.routes';
import sectionsRoutes from './routes/sections.routes';
import teachersRoutes from './routes/teachers.routes';
import departmentsRoutes from './routes/departments.routes';
import printlogsRoutes from './routes/printlogs.routes';
import stockRoutes from './routes/stock.routes';

const app = express();
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/platform', platformRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/sections', sectionsRoutes);
app.use('/api/teachers', teachersRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/printlogs', printlogsRoutes);
app.use('/api/stock', stockRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));