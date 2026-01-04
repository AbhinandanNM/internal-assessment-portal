import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No authentication token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid authentication token' });
    }
};

export const facultyOnly = async (req, res, next) => {
    if (req.user.role !== 'faculty') {
        return res.status(403).json({ error: 'Access denied. Faculty only.' });
    }
    next();
};

export const studentOnly = async (req, res, next) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ error: 'Access denied. Students only.' });
    }
    next();
};
