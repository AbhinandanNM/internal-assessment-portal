import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function FacultyDashboard() {
    const { user, logout } = useAuth();
    const [course, setCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({});
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [coursesRes, studentsRes] = await Promise.all([
                api.get('/courses'),
                api.get('/faculty/students')
            ]);

            // Faculty can only see their assigned course
            const assignedCourse = coursesRes.data.find(c => c.id === user.assignedCourseId);
            setCourse(assignedCourse);
            setStudents(studentsRes.data);

            if (assignedCourse) {
                fetchMarksAndStatistics(assignedCourse.id);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMarksAndStatistics = async (courseId) => {
        try {
            const [marksRes, statsRes] = await Promise.all([
                api.get(`/faculty/marks/${courseId}`),
                api.get(`/faculty/statistics/${courseId}`)
            ]);

            const marksMap = {};
            marksRes.data.forEach(mark => {
                marksMap[mark.student_id] = mark.marks;
            });
            setMarks(marksMap);
            setStatistics(statsRes.data);
        } catch (error) {
            console.error('Error fetching marks:', error);
        }
    };

    const handleMarkChange = (studentId, value) => {
        setMarks(prev => ({
            ...prev,
            [studentId]: value
        }));
    };

    const saveAllMarks = async () => {
        setSaving(true);
        setMessage('');

        try {
            const marksToSave = Object.entries(marks)
                .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
                .map(([studentId, marksValue]) => ({
                    studentId: parseInt(studentId),
                    courseId: course.id,
                    marks: parseFloat(marksValue)
                }));

            if (marksToSave.length === 0) {
                setMessage('Please enter marks for at least one student');
                setSaving(false);
                return;
            }

            await Promise.all(
                marksToSave.map(data => api.post('/faculty/marks', data))
            );

            setMessage(`✓ Successfully saved marks for ${marksToSave.length} student(s)!`);
            await fetchMarksAndStatistics(course.id);

            setTimeout(() => setMessage(''), 4000);
        } catch (error) {
            setMessage(error.response?.data?.error || 'Failed to save marks');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="dashboard">
                <video autoPlay loop muted playsInline className="video-background">
                    <source src="/bg.mp4" type="video/mp4" />
                </video>
                <div className="error-page">
                    <h2>No Course Assigned</h2>
                    <p>Please contact administrator to assign a course to your account.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <video autoPlay loop muted playsInline className="video-background">
                <source src="/bg.mp4" type="video/mp4" />
            </video>
            <nav className="navbar">
                <div className="container">
                    <div className="navbar-content">
                        <div className="navbar-brand">
                            <span className="brand-icon">📚</span>
                            <span>Assessment Portal</span>
                        </div>
                        <div className="navbar-user">
                            <div className="user-info">
                                <div className="user-name">{user.name}</div>
                                <div className="user-role">{course.course_code} Faculty</div>
                            </div>
                            <button onClick={logout} className="btn-logout">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="dashboard-content">
                <div className="container">
                    <div className="dashboard-header">
                        <h1>{course.course_name}</h1>
                        <p>Manage student marks and view class statistics</p>
                    </div>

                    {message && (
                        <div className={`alert ${message.includes('success') || message.includes('✓') ? 'alert-success' : 'alert-error'}`}>
                            {message}
                        </div>
                    )}

                    {statistics && (
                        <>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-label">Class Average</div>
                                    <div className="stat-value">
                                        {statistics.average}
                                        <span className="stat-unit">/ 100</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-label">Total Students</div>
                                    <div className="stat-value">{statistics.totalStudents}</div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-header">
                                    <div className="card-title">Grade Distribution</div>
                                    <div className="card-subtitle">
                                        Visual breakdown of student performance
                                    </div>
                                </div>

                                <div className="grade-bar-chart">
                                    {Object.entries(statistics.gradeDistribution).map(([grade, count]) => {
                                        const maxCount = Math.max(...Object.values(statistics.gradeDistribution));
                                        const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

                                        return (
                                            <div key={grade} className="grade-bar-item">
                                                <div className="grade-bar-label">
                                                    <span className={`grade-badge grade-${grade.toLowerCase()}`}>{grade}</span>
                                                    <span className="grade-bar-count">{count} {count === 1 ? 'student' : 'students'}</span>
                                                </div>
                                                <div className="grade-bar-container">
                                                    <div
                                                        className={`grade-bar grade-bar-${grade.toLowerCase()}`}
                                                        style={{ width: `${percentage}%` }}
                                                    >
                                                        <span className="grade-bar-percentage">{count > 0 ? `${count}` : ''}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-header">
                                    <div className="card-title">Student Marks</div>
                                    <div className="card-subtitle">
                                        {course.course_name} (Max: {course.max_marks})
                                    </div>
                                </div>

                                {students.length === 0 ? (
                                    <div className="empty-state">
                                        <div className="empty-state-icon">📝</div>
                                        <div className="empty-state-text">No students found</div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="table-container">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Roll No.</th>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Marks</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {students.map(student => (
                                                        <tr key={student.id}>
                                                            <td className="roll-col">{student.roll_number}</td>
                                                            <td className="name-col">{student.name}</td>
                                                            <td className="email-col">{student.email}</td>
                                                            <td>
                                                                <input
                                                                    type="number"
                                                                    className="input-marks"
                                                                    min="0"
                                                                    max={course.max_marks}
                                                                    step="0.01"
                                                                    value={marks[student.id] ?? ''}
                                                                    onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                                                    placeholder="0.00"
                                                                    disabled={saving}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="bulk-actions">
                                            <button
                                                className="btn btn-save"
                                                onClick={saveAllMarks}
                                                disabled={saving}
                                            >
                                                {saving ? 'Saving...' : 'Save All Marks'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
