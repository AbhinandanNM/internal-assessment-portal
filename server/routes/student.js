import express from 'express';
import pool from '../config/db.js';
import { auth, studentOnly } from '../middleware/auth.js';

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

// Get marks for logged-in student
router.get('/marks', auth, studentOnly, async (req, res) => {
    try {
        const studentId = req.user.id;

        const [results] = await pool.query(
            `SELECT m.marks, m.created_at, m.updated_at,
              c.id as course_id, c.course_code, c.course_name, c.max_marks
       FROM marks m
       JOIN courses c ON m.course_id = c.id
       WHERE m.student_id = ?
       ORDER BY c.id`,
            [studentId]
        );

        // Add grade to each result
        const marksWithGrades = results.map(mark => ({
            ...mark,
            grade: calculateGrade(mark.marks, mark.max_marks),
            percentage: ((mark.marks / mark.max_marks) * 100).toFixed(2)
        }));

        res.json(marksWithGrades);
    } catch (error) {
        console.error('Get student marks error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
