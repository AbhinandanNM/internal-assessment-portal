import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireFaculty, requireStudent }) {
    const { isAuthenticated, isFaculty, isStudent } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (requireFaculty && !isFaculty) {
        return <Navigate to="/student" replace />;
    }

    if (requireStudent && !isStudent) {
        return <Navigate to="/faculty" replace />;
    }

    return children;
}
