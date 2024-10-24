//index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Add CORS middleware
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");

require('dotenv').config();
const Student = require('./models/studentModel'); // Ensure the correct path to your Student model
const User = require("./models/UserModel");
const { createSecretToken } = require("./utils/SecretToken");
const bcrypt = require("bcryptjs");
const { userVerification } = require('./middlewares/AuthMiddleware');
// Middleware
// app.use(cors({
//   origin: ' http://localhost:5173', // replace with the actual frontend URL you're using (Hoppscotch/your app)
//   credentials: true, // enable sending credentials (cookies)
// }));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
 // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser());
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to DB");
}

main().catch(err => console.log(err));
app.post('/signup', async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({ email, password, username, createdAt });
    const token = createSecretToken(user._id);

    // Set the cookie properly
    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // In production, cookie should only be sent over HTTPS
      sameSite: 'None',  // Ensures the cookie is sent for cross-site requests
      // You might need 'lax' instead of 'None' depending on your setup
    });

    res.status(201).json({
      message: "User signed up successfully",
      success: true,
      user,
    });
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
app.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'Incorrect password or email' });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: 'Incorrect password or email' });
    }

    const token = createSecretToken(user._id);

    
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    res.status(201).json({ message: "User logged in successfully", success: true });
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/api/protected', userVerification, (req, res) => {
  // Access the user information from the decoded token
  const user = req.user;

  // Send a response confirming access
  res.status(200).json({ message: "Access granted", user });
});
// Example Express.js route for deleting a student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    await Student.findByIdAndDelete(studentId); // Assuming you have a Student model
    res.status(204).send(); // No content response
  } catch (error) {
    res.status(500).send('Error deleting student');
  }
});

// API Endpoint to handle form submissions
app.post('/api/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send({ message: "Student registered successfully!" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// New API Endpoint to get all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find(); // Fetch all student documents
    res.status(200).json(students); // Send the students as a JSON response
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch students' }); // Handle errors
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
