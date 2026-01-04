# 📚 Internal Assessment Portal

A modern, full-stack web application for managing internal assessments with role-based access control, built with React, Node.js/Express, and MySQL.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-16+-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)

---

## 🌟 Features

### 🔐 **Authentication & Authorization**
- Secure JWT-based authentication
- Role-based access control (Faculty/Student)
- Email validation and password hashing (bcrypt)
- Protected routes with middleware

### 👨‍🏫 **Faculty Dashboard**
- **Course-Specific Access**: Each faculty can only edit marks for their assigned subject
- **Bulk Marks Upload**: Enter and save marks for all students at once
- **Real-time Statistics**: 
  - Class average calculation
  - Total student count
  - Grade distribution (S, A, B, C, D, F)
- **Visual Analytics**: Animated bar charts for grade distribution
- **Efficient Interface**: Compact, professional design for quick data entry

### 👨‍🎓 **Student Dashboard**
- View marks across all enrolled courses
- Individual grade display with color-coded badges
- Overall percentage calculation
- **Performance Remarks**: Personalized feedback based on performance:
  - 90-100%: Outstanding performance 🌟
  - 80-89%: Excellent work 🎉
  - 70-79%: Good job 👍
  - 60-69%: Room for improvement 📈
  - 50-59%: Need to work harder 💪
  - <50%: Immediate attention needed 📚
- Visual performance overview

### 📊 **Grading System**
| Grade | Percentage Range |
|-------|-----------------|
| S     | 90-100%        |
| A     | 80-89%         |
| B     | 70-79%         |
| C     | 60-69%         |
| D     | 50-59%         |
| F     | Below 50%      |

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Custom CSS** - Unique, non-AI design with gradients and animations

### **Backend**
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MySQL2** - Database driver with promise support
- **JWT** - Secure token-based authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management

### **Database**
- **MySQL 8.0** - Relational database
- Three predefined courses:
  - CS101: Data Structures and Algorithms
  - CS102: Web Development
  - CS103: Database Management Systems

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AbhinandanNM/internal-assessment-portal.git
   cd internal-assessment-portal
   ```

2. **Setup MySQL Database**
   ```sql
   CREATE DATABASE assessment_portal;
   ```

3. **Configure Environment Variables**
   
   Create `server/.env`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=assessment_portal
   JWT_SECRET=your-secret-key
   ```

4. **Install Dependencies**
   ```bash
   # Backend
   cd server
   npm install

   # Frontend
   cd ../client
   npm install
   ```

5. **Seed the Database**
   ```bash
   cd server
   npm run seed
   ```

6. **Start the Application**
   
   **Backend** (Terminal 1):
   ```bash
   cd server
   npm run dev
   ```
   
   **Frontend** (Terminal 2):
   ```bash
   cd client
   npm run dev
   ```

7. **Access the Application**
   ```
   http://localhost:3000
   ```

---

## 🔑 Demo Credentials

### Faculty
| Email | Password | Assigned Course |
|-------|----------|----------------|
| faculty1@college.edu | faculty123 | CS101 - Data Structures |
| faculty2@college.edu | faculty123 | CS102 - Web Development |
| faculty3@college.edu | faculty123 | CS103 - Database Management |

### Students
| Email | Password | Roll Number |
|-------|----------|-------------|
| john@college.edu | student123 | 2024CS001 |
| sarah@college.edu | student123 | 2024CS002 |
| raj@college.edu | student123 | 2024CS003 |
| ... (10 students total) | student123 | 2024CS004-010 |

---

## 📁 Project Structure

```
internal-assessment-portal/
├── client/                      # React Frontend
│   ├── public/
│   │   └── bg.mp4              # Background video
│   ├── src/
│   │   ├── components/
│   │   │   ├── faculty/        # Faculty dashboard
│   │   │   ├── student/        # Student dashboard
│   │   │   ├── Login.jsx       # Login page
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global auth state
│   │   ├── services/
│   │   │   └── api.js          # Axios instance
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # Global styles
│   ├── vite.config.js
│   └── package.json
│
├── server/                      # Node.js Backend
│   ├── config/
│   │   └── db.js               # MySQL connection
│   ├── middleware/
│   │   └── auth.js             # JWT middleware
│   ├── routes/
│   │   ├── auth.js             # Authentication
│   │   ├── course.js           # Course routes
│   │   ├── faculty.js          # Faculty operations
│   │   └── student.js          # Student operations
│   ├── .env                    # Environment variables
│   ├── seed.js                 # Database seeding
│   ├── server.js               # Express app
│   └── package.json
│
├── README.md
├── SETUP_GUIDE.md              # Detailed setup instructions
├── IMPROVEMENTS_SUMMARY.md     # Feature improvements log
└── .gitignore
```

---

## 🎨 Design Highlights

- **Unique Color Palette**: Deep purple and hot pink accents (not typical AI colors)
- **Compact Interface**: Optimized spacing for efficiency (25-30% size reduction)
- **Animated Elements**: Custom slide-in animations and bar charts
- **Video Background**: Subtle animated background for visual appeal
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Glassmorphism**: Modern frosted glass effects with backdrop blur

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token authentication with 24-hour expiration
- ✅ HTTP-only token storage
- ✅ Role-based access control
- ✅ Protected API routes with middleware
- ✅ SQL injection prevention with prepared statements
- ✅ CORS configuration
- ✅ Environment variable protection (.env in .gitignore)

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user info

### Courses
- `GET /api/courses` - Get all courses

### Faculty (Protected)
- `GET /api/faculty/students` - Get all students
- `POST /api/faculty/marks` - Upload/update marks
- `GET /api/faculty/marks/:courseId` - Get marks for a course
- `GET /api/faculty/statistics/:courseId` - Get course statistics

### Student (Protected)
- `GET /api/student/marks` - Get marks for logged-in student

---

## 🎯 Key Features Breakdown

### 1. **Course-Specific Faculty Access**
Each faculty member is assigned to ONE specific course during seeding. They can ONLY view and edit marks for their assigned course - ensuring data security and appropriate access control.

### 2. **Bulk Marks Management**
Faculty can enter marks for all students and save them with a single click - significantly improving efficiency over individual save operations.

### 3. **Real-time Analytics**
- Automatic calculation of class averages
- Dynamic grade distribution visualization
- Instant statistics updates after mark submissions

### 4. **Personalized Student Feedback**
Students receive customized performance remarks based on their overall percentage, providing motivational feedback and areas for improvement.

### 5. **Customizable Data**
Easy-to-edit seed file (`server/seed.js`) allows administrators to quickly modify:
- Faculty members and their course assignments
- Student information
- Course details

---

## 🧪 Testing

### Faculty Workflow Test
1. Login as `faculty1@college.edu`
2. Verify only CS101 course is visible
3. Enter marks for students
4. Click "Save All Marks"
5. Verify statistics update correctly
6. Logout and test with faculty2/faculty3

### Student Workflow Test
1. Login as `john@college.edu`
2. Verify marks display for all courses
3. Check grade badges are color-coded
4. Verify performance remark matches percentage
5. Confirm other students' marks are not visible

---

## 📝 Customization Guide

### Add New Faculty/Students

Edit `server/seed.js`:

```javascript
const FACULTY_USERS = [
  { 
    email: 'newprof@college.edu', 
    password: 'password123', 
    name: 'Prof. New Name',
    assignedCourse: 'CS101'  // Assign to course
  }
];

const STUDENT_USERS = [
  { 
    email: 'newstudent@college.edu', 
    password: 'student123', 
    name: 'Student Name', 
    rollNumber: '2024CS011' 
  }
];
```

Then run:
```bash
cd server
npm run seed
```

---

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Verify credentials in `.env`
- Check if `assessment_portal` database exists

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Missing `assigned_course_id` Column
Drop and recreate database:
```sql
DROP DATABASE assessment_portal;
CREATE DATABASE assessment_portal;
```

---

## 📄 License

MIT License - see LICENSE file for details

---

## 👨‍💻 Author

**Abhinandan NM**

- GitHub: [@AbhinandanNM](https://github.com/AbhinandanNM)
- Repository: [internal-assessment-portal](https://github.com/AbhinandanNM/internal-assessment-portal)

---

## 🙏 Acknowledgments

- Built for Structured Enquiry - Batch C1 (Date: 05-01-2026)
- Marks: 15
- Modern design inspired by current web development best practices
- Unique color scheme to avoid AI-generated appearance

---

## 🚀 Future Enhancements

- [ ] Export marks to Excel/PDF
- [ ] Email notifications for mark uploads
- [ ] Multi-semester support
- [ ] Attendance tracking
- [ ] Admin panel for user management
- [ ] Mobile app (React Native)
- [ ] Real-time updates with WebSockets
- [ ] Advanced analytics and reports

---

**⭐ If you find this project useful, please give it a star!**
