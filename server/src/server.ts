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
import reportsRoutes from './routes/reports.routes';
import exportRoutes from './routes/export.routes';
import emailRoutes from './routes/email.routes';
import { scheduleMonthlyReportJob } from './jobs/monthlyReport.job';
import studentsRoutes from './routes/students.routes';
import notebookTypesRoutes from './routes/notebookTypes.routes';

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
app.use('/api/reports', reportsRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/notebook-types', notebookTypesRoutes);
scheduleMonthlyReportJob();

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));