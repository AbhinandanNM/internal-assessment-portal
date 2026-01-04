import express from 'express';
import pool from '../config/db.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all courses
router.get('/', auth, async (req, res) => {
    try {
        const [courses] = await pool.query('SELECT * FROM courses ORDER BY id');
        res.json(courses);
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
