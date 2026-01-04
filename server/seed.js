import bcrypt from 'bcryptjs';
import pool from './config/db.js';
import { initializeDatabase } from './config/db.js';

// ============================================
// CUSTOMIZE YOUR DATA HERE
// ============================================

// Faculty Users - Each assigned to ONE course
const FACULTY_USERS = [
    {
        email: 'faculty1@college.edu',
        password: 'faculty123',
        name: 'Dr. Rajesh Kumar',
        assignedCourse: 'CS101'  // Data Structures
    },
    {
        email: 'faculty2@college.edu',
        password: 'faculty123',
        name: 'Prof. Priya Sharma',
        assignedCourse: 'CS102'  // Web Development
    },
    {
        email: 'faculty3@college.edu',
        password: 'faculty123',
        name: 'Dr. Amit Patel',
        assignedCourse: 'CS103'  // Database Management
    }
];

// Student Users - Add your own students
const STUDENT_USERS = [
    { email: 'john@college.edu', password: 'student123', name: 'John Michael', rollNumber: '2024CS001' },
    { email: 'sarah@college.edu', password: 'student123', name: 'Sarah Williams', rollNumber: '2024CS002' },
    { email: 'raj@college.edu', password: 'student123', name: 'Raj Patel', rollNumber: '2024CS003' },
    { email: 'priya@college.edu', password: 'student123', name: 'Priya Singh', rollNumber: '2024CS004' },
    { email: 'david@college.edu', password: 'student123', name: 'David Chen', rollNumber: '2024CS005' },
    { email: 'maria@college.edu', password: 'student123', name: 'Maria Garcia', rollNumber: '2024CS006' },
    { email: 'amit@college.edu', password: 'student123', name: 'Amit Verma', rollNumber: '2024CS007' },
    { email: 'emily@college.edu', password: 'student123', name: 'Emily Johnson', rollNumber: '2024CS008' },
    { email: 'rohan@college.edu', password: 'student123', name: 'Rohan Desai', rollNumber: '2024CS009' },
    { email: 'lisa@college.edu', password: 'student123', name: 'Lisa Anderson', rollNumber: '2024CS010' }
];

// Three Predefined Courses
const COURSES = [
    { code: 'CS101', name: 'Data Structures and Algorithms', maxMarks: 100 },
    { code: 'CS102', name: 'Web Development', maxMarks: 100 },
    { code: 'CS103', name: 'Database Management Systems', maxMarks: 100 }
];

// ============================================
// SEED FUNCTION (Don't modify below)
// ============================================

async function seed() {
    try {
        console.log('Initializing database...');
        await initializeDatabase();

        console.log('\n🗑️  Clearing old data...');

        // Clear all existing data (in correct order due to foreign keys)
        await pool.query('DELETE FROM marks');
        console.log('  ✓ Cleared all marks');

        await pool.query('DELETE FROM users');
        console.log('  ✓ Cleared all users');

        await pool.query('DELETE FROM courses');
        console.log('  ✓ Cleared all courses');

        console.log('\n📝 Seeding fresh data...');

        // Insert courses first
        console.log('\n� Creating Courses:');
        const courseIdMap = {};
        for (const course of COURSES) {
            const [result] = await pool.query(
                `INSERT INTO courses (course_code, course_name, max_marks) 
         VALUES (?, ?, ?)`,
                [course.code, course.name, course.maxMarks]
            );
            courseIdMap[course.code] = result.insertId;
            console.log(`  ✓ ${course.code} - ${course.name}`);
        }

        // Insert faculty users with assigned course
        console.log('\n👨‍� Creating Faculty Users:');
        for (const faculty of FACULTY_USERS) {
            const hashedPassword = await bcrypt.hash(faculty.password, 10);
            const courseId = courseIdMap[faculty.assignedCourse];
            await pool.query(
                `INSERT INTO users (email, password, name, role, assigned_course_id) 
         VALUES (?, ?, ?, ?, ?)`,
                [faculty.email, hashedPassword, faculty.name, 'faculty', courseId]
            );
            const courseName = COURSES.find(c => c.code === faculty.assignedCourse).name;
            console.log(`  ✓ ${faculty.name} → ${faculty.assignedCourse} (${courseName})`);
        }

        // Insert students
        console.log('\n�‍🎓 Creating Student Users:');
        for (const student of STUDENT_USERS) {
            const hashedPassword = await bcrypt.hash(student.password, 10);
            await pool.query(
                `INSERT INTO users (email, password, name, role, roll_number) 
         VALUES (?, ?, ?, ?, ?)`,
                [student.email, hashedPassword, student.name, 'student', student.rollNumber]
            );
            console.log(`  ✓ ${student.name} (${student.rollNumber})`);
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
        console.log('='.repeat(60));

        console.log('\n📋 FACULTY CREDENTIALS (Each assigned to ONE course):');
        FACULTY_USERS.forEach(f => {
            const course = COURSES.find(c => c.code === f.assignedCourse);
            console.log(`   ${f.email} → ${f.assignedCourse} (${course.name})`);
            console.log(`   Password: ${f.password}`);
        });

        console.log('\n👨‍🎓 STUDENT CREDENTIALS:');
        STUDENT_USERS.slice(0, 3).forEach(s => {
            console.log(`   ${s.rollNumber} - ${s.email} | Password: ${s.password}`);
        });
        console.log(`   ... and ${STUDENT_USERS.length - 3} more students (all use student123)`);

        console.log('\n📊 Summary:');
        console.log(`   - ${FACULTY_USERS.length} Faculty (each assigned to 1 course)`);
        console.log(`   - ${STUDENT_USERS.length} Students`);
        console.log(`   - ${COURSES.length} Courses`);

        console.log('\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
}

seed();
