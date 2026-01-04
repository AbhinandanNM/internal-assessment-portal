import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import FacultyDashboard from './components/faculty/FacultyDashboard';
import StudentDashboard from './components/student/StudentDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function AppRoutes() {
    const { isAuthenticated, isFaculty, isStudent } = useAuth();

    return (
        <Routes>
            <Route
                path="/"
                element={
                    isAuthenticated
                        ? (isFaculty ? <Navigate to="/faculty" /> : <Navigate to="/student" />)
                        : <Login />
                }
            />

            <Route
                path="/faculty"
                element={
                    <ProtectedRoute requireFaculty>
                        <FacultyDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/student"
                element={
                    <ProtectedRoute requireStudent>
                        <StudentDashboard />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}
