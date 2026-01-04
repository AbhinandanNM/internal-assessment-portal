# Internal Assessment Portal

A full-stack web application for managing internal assessments with role-based access for faculty and students.

## Features

- **Authentication System**
  - Secure login with email validation
  - Role-based access control (Faculty/Student)
  - JWT token-based authentication

- **Faculty Features**
  - View all students
  - Upload and update marks for three courses
  - Real-time statistics:
    - Class average
    - Grade distribution (S, A, B, C, D, F)
  - Course-wise marks management

- **Student Features**
  - View marks for all courses
  - See individual grades and percentages
  - Overall performance statistics

- **Three Predefined Courses**
  - Data Structures and Algorithms (CS101)
  - Web Development (CS102)
  - Database Management Systems (CS103)

## Tech Stack

- **Frontend**: React 18 with Vite
- **Backend**: Node.js with Express
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Modern CSS with glassmorphism and gradients

## Grade Scale

- S Grade: 90-100%
- A Grade: 80-89%
- B Grade: 70-79%
- C Grade: 60-69%
- D Grade: 50-59%
- F Grade: Below 50%

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
cd Evaluation
```

### 2. Setup MySQL Database

Make sure MySQL is running on your system. The application will automatically create the database and tables when you run the seed script.

Update the database credentials in `server/.env` if needed:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=assessment_portal
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
```

### 4. Seed the Database

```bash
npm run seed
```

This will:
- Create the database and tables
- Insert 3 predefined courses
- Create 1 faculty user
- Create 5 student users

### 5. Install Frontend Dependencies

```bash
cd ../client
npm install
```

## Running the Application

### 1. Start the Backend Server

```bash
cd server
npm run dev
```

Server will run on `http://localhost:5000`

### 2. Start the Frontend (in a new terminal)

```bash
cd client
npm run dev
```

Frontend will run on `http://localhost:3000`

## Demo Credentials

### Faculty Login
- Email: `faculty@example.com`
- Password: `password123`

### Student Login
- Email: `student1@example.com` (or student2, student3, student4, student5)
- Password: `password123`

## Usage

### Faculty Workflow

1. Login with faculty credentials
2. Select a course from the course tabs
3. Enter marks for each student
4. Click "Save" to update marks
5. View real-time statistics and grade distribution

### Student Workflow

1. Login with student credentials
2. View marks for all courses
3. See individual grades and overall performance

## Project Structure

```
Evaluation/
├── server/
│   ├── config/
│   │   └── db.js              # MySQL connection
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   ├── routes/
│   │   ├── auth.js            # Login routes
│   │   ├── course.js          # Course routes
│   │   ├── faculty.js         # Faculty routes
│   │   └── student.js         # Student routes
│   ├── .env                   # Environment variables
│   ├── package.json
│   ├── seed.js                # Database seeding
│   └── server.js              # Express server
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── faculty/
    │   │   │   └── FacultyDashboard.jsx
    │   │   ├── student/
    │   │   │   └── StudentDashboard.jsx
    │   │   ├── Login.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses

### Faculty (Protected)
- `GET /api/faculty/students` - Get all students
- `POST /api/faculty/marks` - Upload/update marks
- `GET /api/faculty/marks/:courseId` - Get marks for a course
- `GET /api/faculty/statistics/:courseId` - Get course statistics

### Student (Protected)
- `GET /api/student/marks` - Get marks for logged-in student

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Protected API routes
- SQL injection prevention with prepared statements
- CORS enabled

## License

MIT

## Author

Internal Assessment Portal - Built for Educational Purposes
