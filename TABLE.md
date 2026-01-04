USE assessment_portal;

-- Show all tables
SHOW TABLES;

-- View all users (faculty and students)
SELECT * FROM users;

-- View faculty only with their assigned courses
SELECT u.*, c.course_name 
FROM users u 
LEFT JOIN courses c ON u.assigned_course_id = c.id 
WHERE u.role = 'faculty';

-- View all students
SELECT * FROM users WHERE role = 'student';

-- View all courses
SELECT * FROM courses;

-- View all marks
SELECT * FROM marks;

-- View detailed marks with names
SELECT 
  u.name as student_name,
  u.roll_number,
  c.course_name,
  m.marks,
  c.max_marks
FROM marks m
JOIN users u ON m.student_id = u.id
JOIN courses c ON m.course_id = c.id
ORDER BY c.id, u.roll_number;

-- Exit
exit;