import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function StudentDashboard() {
    const { user, logout } = useAuth();
    const [marks, setMarks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMarks();
    }, []);

    const fetchMarks = async () => {
        try {
            const response = await api.get('/student/marks');
            setMarks(response.data);
        } catch (error) {
            console.error('Error fetching marks:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateOverallStats = () => {
        if (marks.length === 0) return { average: 0, totalMarks: 0, maxMarks: 0 };

        const totalMarks = marks.reduce((sum, m) => sum + parseFloat(m.marks), 0);
        const maxMarks = marks.reduce((sum, m) => sum + parseFloat(m.max_marks), 0);
        const average = (totalMarks / maxMarks) * 100;

        return { average: average.toFixed(2), totalMarks, maxMarks };
    };

    const getPerformanceRemark = (percentage) => {
        if (percentage >= 90) return { text: "Outstanding! Exceptional performance! 🌟", color: "#059669" };
        if (percentage >= 80) return { text: "Excellent work! Keep it up! 🎉", color: "#3B82F6" };
        if (percentage >= 70) return { text: "Good job! You're doing well! 👍", color: "#8B5CF6" };
        if (percentage >= 60) return { text: "Satisfactory. Room for improvement! 📈", color: "#F59E0B" };
        if (percentage >= 50) return { text: "Need to work harder. You can do it! 💪", color: "#F97316" };
        return { text: "Immediate attention needed. Let's improve! 📚", color: "#DC2626" };
    };

    const stats = calculateOverallStats();
    const remark = getPerformanceRemark(parseFloat(stats.average));

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
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
                                <div className="user-role">{user.rollNumber || user.roll_number}</div>
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
                        <h1>Student Dashboard</h1>
                        <p>View your marks and performance across all courses</p>
                    </div>

                    {marks.length > 0 && (
                        <>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-label">Overall Percentage</div>
                                    <div className="stat-value">
                                        {stats.average}
                                        <span className="stat-unit">%</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-label">Total Marks</div>
                                    <div className="stat-value">
                                        {stats.totalMarks}
                                        <span className="stat-unit">/ {stats.maxMarks}</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-label">Courses Completed</div>
                                    <div className="stat-value">{marks.length}</div>
                                </div>
                            </div>

                            <div className="performance-remark-card">
                                <div className="remark-icon">💬</div>
                                <div className="remark-content">
                                    <div className="remark-label">Performance Remark</div>
                                    <div className="remark-text" style={{ color: remark.color }}>
                                        {remark.text}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {marks.length === 0 ? (
                        <div className="card">
                            <div className="empty-state">
                                <div className="empty-state-icon">📊</div>
                                <div className="empty-state-text">
                                    No marks have been uploaded yet. Please check back later.
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Your Course Marks</div>
                                <div className="card-subtitle">
                                    Detailed breakdown of your performance in each course
                                </div>
                            </div>

                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Course Code</th>
                                            <th>Course Name</th>
                                            <th>Marks</th>
                                            <th>Max</th>
                                            <th>%</th>
                                            <th>Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {marks.map(mark => (
                                            <tr key={mark.course_id}>
                                                <td className="roll-col">{mark.course_code}</td>
                                                <td className="name-col">{mark.course_name}</td>
                                                <td>{parseFloat(mark.marks).toFixed(2)}</td>
                                                <td>{mark.max_marks}</td>
                                                <td>{mark.percentage}%</td>
                                                <td>
                                                    <span className={`grade-badge grade-${mark.grade.toLowerCase()}`}>
                                                        {mark.grade}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {marks.length > 0 && (
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Performance Overview</div>
                                <div className="card-subtitle">Visual representation of your grades</div>
                            </div>

                            <div className="grade-distribution">
                                {marks.map(mark => (
                                    <div key={mark.course_id} className="grade-count">
                                        <div className="grade-count-label">{mark.course_code}</div>
                                        <div className="grade-count-value">
                                            <span className={`grade-badge grade-${mark.grade.toLowerCase()}`}>
                                                {mark.grade}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
