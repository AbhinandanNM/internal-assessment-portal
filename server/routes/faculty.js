import express from 'express';
import pool from '../config/db.js';
import { auth, facultyOnly } from '../middleware/auth.js';

const router = express.Router();

// Helper function to calculate grade
function calculateGrade(marks, maxMarks = 100) {
    const percentage = (marks / maxMarks) * 100;

    if (percentage >= 90) return 'S';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
}

// Get all students
router.get('/students', auth, facultyOnly, async (req, res) => {
    try {
        const [students] = await pool.query(
            'SELECT id, email, name, roll_number FROM users WHERE role = ? ORDER BY roll_number',
            ['student']
        );
        res.json(students);
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Upload or update marks
router.post('/marks', auth, facultyOnly, async (req, res) => {
    try {
        const { studentId, courseId, marks } = req.body;

        // Validation
        if (!studentId || !courseId || marks === undefined) {
            return res.status(400).json({ error: 'Student ID, Course ID, and marks are required' });
        }

        // Get course max marks
        const [courses] = await pool.query('SELECT max_marks FROM courses WHERE id = ?', [courseId]);
        if (courses.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const maxMarks = courses[0].max_marks;

        if (marks < 0 || marks > maxMarks) {
            return res.status(400).json({ error: `Marks must be between 0 and ${maxMarks}` });
        }

        // Insert or update marks
        await pool.query(
            `INSERT INTO marks (student_id, course_id, marks, uploaded_by) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE marks = ?, uploaded_by = ?`,
            [studentId, courseId, marks, req.user.id, marks, req.user.id]
        );

        res.json({ message: 'Marks saved successfully' });
    } catch (error) {
        console.error('Upload marks error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get marks for a course
router.get('/marks/:courseId', auth, facultyOnly, async (req, res) => {
    try {
        const { courseId } = req.params;

        const [results] = await pool.query(
            `SELECT m.id, m.marks, m.created_at, m.updated_at,
              u.id as student_id, u.name as student_name, u.roll_number,
              c.max_marks, c.course_name
       FROM marks m
       JOIN users u ON m.student_id = u.id
       JOIN courses c ON m.course_id = c.id
       WHERE m.course_id = ?
       ORDER BY u.roll_number`,
            [courseId]
        );

        res.json(results);
    } catch (error) {
        console.error('Get marks error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get statistics for a course
router.get('/statistics/:courseId', auth, facultyOnly, async (req, res) => {
    try {
        const { courseId } = req.params;

        // Get all marks for the course
        const [marks] = await pool.query(
            `SELECT m.marks, c.max_marks
       FROM marks m
       JOIN courses c ON m.course_id = c.id
       WHERE m.course_id = ?`,
            [courseId]
        );

        if (marks.length === 0) {
            return res.json({
                average: 0,
                totalStudents: 0,
                gradeDistribution: { S: 0, A: 0, B: 0, C: 0, D: 0, F: 0 }
            });
        }

        // Calculate average
        const total = marks.reduce((sum, m) => sum + parseFloat(m.marks), 0);
        const average = total / marks.length;

        // Calculate grade distribution
        const gradeDistribution = { S: 0, A: 0, B: 0, C: 0, D: 0, F: 0 };
        marks.forEach(m => {
            const grade = calculateGrade(m.marks, m.max_marks);
            gradeDistribution[grade]++;
        });

        res.json({
            average: average.toFixed(2),
            totalStudents: marks.length,
            gradeDistribution
        });
    } catch (error) {
        console.error('Get statistics error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
