# 🚀 Internal Assessment Portal - Complete Setup Guide

## 📋 Prerequisites

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **MySQL** (v8 or higher) - [Download](https://dev.mysql.com/downloads/installer/)
3. **Code Editor** (VS Code recommended)

---

## 🛠️ Step-by-Step Setup (Fresh Start)

### Step 1: Start MySQL Server

**On Windows:**
1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Find "MySQL80" (or similar) in the list
4. Right-click → Start

**Verify MySQL is running:**
```bash
mysql -u root -p
```
Enter your MySQL password (if you have one). If it connects, MySQL is running! Type `exit;` to quit.

---

### Step 2: Create the Database

**Option A: Using MySQL Command Line**
```bash
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE assessment_portal;
exit;
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to Local instance
3. Click "Create Schema" button
4. Name it: `assessment_portal`
5. Click Apply

---

### Step 3: Configure Database Connection

Open `server/.env` file and update if needed:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=assessment_portal
JWT_SECRET=your-secret-key-change-in-production
```

**Important:** If you don't have a MySQL password, leave `DB_PASSWORD=` empty

---

### Step 4: Customize Your Data

Open `server/seed.js` and edit the arrays at the top:

```javascript
// Add your faculty members
const FACULTY_USERS = [
  { 
    email: 'yourfaculty@college.edu', 
    password: 'yourpassword', 
    name: 'Your Faculty Name' 
  },
  // Add more faculty...
];

// Add your students
const STUDENT_USERS = [
  { 
    email: 'student1@college.edu', 
    password: 'password123', 
    name: 'Student Name', 
    rollNumber: '2024CS001' 
  },
  // Add more students...
];
```

---

### Step 5: Install Dependencies

Open **two terminals** in the project folder:

**Terminal 1 - Backend:**
```bash
cd server
npm install
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
```

---

### Step 6: Move Video File

Copy your `bg.mp4` file to the `client/public/` folder:

```
Evaluation/
└── client/
    └── public/
        └── bg.mp4  ← Place video here
```

If the `public` folder doesn't exist, create it.

---

### Step 7: Seed the Database

In the backend terminal:
```bash
cd server
npm run seed
```

You should see:
```
✅ DATABASE SEEDED SUCCESSFULLY!
📋 FACULTY CREDENTIALS:
   Email: yourfaculty@college.edu | Password: yourpassword
👨‍🎓 STUDENT CREDENTIALS (Sample):
   ...
```

---

### Step 8: Start the Servers

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```

Wait for:
```
Server running on port 5000
Health check: http://localhost:5000/api/health
```

**Terminal 2 - Frontend (in a NEW terminal):**
```bash
cd client
npm run dev
```

Wait for:
```
  ➜  Local:   http://localhost:3000/
```

---

### Step 9: Access the Application

Open your browser and go to:
```
http://localhost:3000
```

---

## 🔑 Using the Application

### As Faculty:

1. **Login** with your faculty credentials
2. **Select a course** from the tabs
3. **Enter marks** for all students
4. **Click "💾 Save All Marks"** (saves all at once!)
5. View **grade distribution bar chart**
6. See **class statistics** (average, grade counts)
7. Switch courses and repeat

### As Student:

1. **Login** with student credentials
2. View **marks for all 3 courses**
3. See **individual grades** with color coding
4. Check **overall percentage**
5. Read **performance remark** (personalized feedback)

---

## 📊 How to View MySQL Database Tables

### Method 1: MySQL Workbench (Easiest)

1. Open **MySQL Workbench**
2. Connect to your local server
3. In the left sidebar, expand `assessment_portal` database
4. Right-click on a table (e.g., `users`)
5. Select **"Select Rows - Limit 1000"**

You'll see all data in a grid view!

### Method 2: MySQL Command Line

```bash
mysql -u root -p
```

Then run these commands:

```sql
-- Use the database
USE assessment_portal;

-- Show all tables
SHOW TABLES;

-- View all users
SELECT * FROM users;

-- View all courses
SELECT * FROM courses;

-- View all marks
SELECT * FROM marks;

-- View detailed marks with student info
SELECT 
  u.name, 
  u.roll_number, 
  c.course_name, 
  m.marks 
FROM marks m
JOIN users u ON m.student_id = u.id
JOIN courses c ON m.course_id = c.id
ORDER BY u.roll_number, c.id;

-- Exit
exit;
```

### Method 3: VS Code Extension

1. Install **"SQLTools"** extension in VS Code
2. Install **"SQLTools MySQL/MariaDB"** driver
3. Click the SQLTools icon in sidebar
4. Add new connection:
   - Server: localhost
   - Port: 3306
   - Database: assessment_portal
   - Username: root
   - Password: (your MySQL password)
5. Connect and browse tables visually

---

## 🎯 New Features Implemented

### ✅ 1. Customizable Faculty & Students
- Edit `server/seed.js` to add your own data
- Multiple faculty members supported
- Unlimited students

### ✅ 2. Bulk Save Marks
- Enter marks for all students
- Click one "Save All" button
- No need to save individually

### ✅ 3. Video Background
- Beautiful animated background
- Uses `bg.mp4` from public folder
- Consistent across all pages

### ✅ 4. Grade Bar Chart
- Visual grade distribution
- Animated bars
- Color-coded by grade

### ✅ 5. Performance Remarks
- Personalized feedback for students
- Based on overall percentage:
  - 90-100%: "Outstanding! Exceptional performance! 🌟"
  - 80-89%: "Excellent work! Keep it up! 🎉"
  - 70-79%: "Good job! You're doing well! 👍"
  - 60-69%: "Satisfactory. Room for improvement! 📈"
  - 50-59%: "Need to work harder. You can do it! 💪"
  - <50%: "Immediate attention needed. Let's improve! 📚"

---

## 🔄 How to Reset and Start Fresh

### Clear all data:
```bash
mysql -u root -p
```

```sql
DROP DATABASE assessment_portal;
CREATE DATABASE assessment_portal;
exit;
```

Then run seed again:
```bash
cd server
npm run seed
```

---

## 🐛 Common Issues & Solutions

### Issue: "Unknown database 'assessment_portal'"
**Solution:** Create the database manually (see Step 2)

### Issue: "ECONNREFUSED" when running seed
**Solution:** MySQL is not running. Start MySQL service (see Step 1)

### Issue: Video not showing
**Solution:** Make sure `bg.mp4` is in `client/public/` folder

### Issue: "Port 5000 already in use"
**Solution:** Kill the process:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Then restart server
```

### Issue: Changes in seed.js not reflecting
**Solution:** Drop and recreate database, then re-seed

---

## 📁 Project Structure

```
Evaluation/
├── server/                      # Backend (Port 5000)
│   ├── config/
│   │   └── db.js               # MySQL connection
│   ├── middleware/
│   │   └── auth.js             # JWT auth
│   ├── routes/
│   │   ├── auth.js             # Login routes
│   │   ├── course.js           # Course routes
│   │   ├── faculty.js          # Faculty routes
│   │   └── student.js          # Student routes
│   ├── .env                    # Database config
│   ├── seed.js                 # ⭐ Edit your data here
│   └── server.js               # Express app
│
├── client/                      # Frontend (Port 3000)
│   ├── public/
│   │   └── bg.mp4              # ⭐ Place video here
│   ├── src/
│   │   ├── components/
│   │   │   ├── faculty/
│   │   │   │   └── FacultyDashboard.jsx
│   │   │   ├── student/
│   │   │   │   └── StudentDashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   └── package.json
│
├── README.md
└── SETUP_GUIDE.md              # ⭐ This file
```

---

## ✨ Summary

1. ✅ Start MySQL
2. ✅ Create `assessment_portal` database
3. ✅ Edit `server/seed.js` with your data
4. ✅ Install dependencies (server & client)
5. ✅ Place `bg.mp4` in `client/public/`
6. ✅ Run seed script
7. ✅ Start both servers
8. ✅ Access at `http://localhost:3000`

**Enjoy your beautiful Internal Assessment Portal! 🎉**
