import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/db.js';
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/course.js';
import facultyRoutes from './routes/faculty.js';
import studentRoutes from './routes/student.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/student', studentRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Initialize database and start server
initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/api/health`);
        });
    })
    .catch(error => {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    });
