import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        if (!email.trim()) {
            setError('Email is required');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Invalid email format');
            return false;
        }

        if (!password) {
            setError('Password is required');
            return false;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const user = await login(email, password);

            // Redirect based on role
            if (user.role === 'faculty') {
                navigate('/faculty');
            } else {
                navigate('/student');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <video autoPlay loop muted playsInline className="video-background">
                <source src="/bg.mp4" type="video/mp4" />
            </video>
            <div className="login-container">
                <div className="login-header">
                    <h1>📚 Assessment Portal</h1>
                    <p>Sign in to access your dashboard</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ marginTop: '1.75rem', padding: '0.875rem', background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)', fontSize: '0.813rem', borderLeft: '3px solid rgba(167, 139, 250, 0.6)' }}>
                    <p style={{ marginBottom: '0.5rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Demo Credentials:</p>
                    <p style={{ marginBottom: '0.25rem', color: 'rgba(255,255,255,0.75)' }}>Faculty: faculty1@college.edu (CS101)</p>
                    <p style={{ marginBottom: '0.25rem', color: 'rgba(255,255,255,0.75)' }}>Faculty: faculty2@college.edu (CS102)</p>
                    <p style={{ marginBottom: '0.25rem', color: 'rgba(255,255,255,0.75)' }}>Student: john@college.edu</p>
                    <p style={{ opacity: 0.7, fontSize: '0.75rem', marginTop: '0.5rem' }}>Passwords: faculty123 / student123</p>
                </div>
            </div>
        </div>
    );
}
