import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Find user
        const [users] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
                rollNumber: user.roll_number,
                assignedCourseId: user.assigned_course_id
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                rollNumber: user.roll_number,
                assignedCourseId: user.assigned_course_id
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Get current user
router.get('/me', auth, async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, email, name, role, roll_number FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Register (for demo purposes)
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, role, rollNumber } = req.body;

        // Validation
        if (!email || !password || !name || !role) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (role === 'student' && !rollNumber) {
            return res.status(400).json({ error: 'Roll number is required for students' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        await pool.query(
            'INSERT INTO users (email, password, name, role, roll_number) VALUES (?, ?, ?, ?, ?)',
            [email, hashedPassword, name, role, role === 'student' ? rollNumber : null]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email or roll number already exists' });
        }
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

export default router;
