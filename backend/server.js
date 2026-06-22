require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/syllabus', require('./routes/syllabusRoutes'));
app.use('/api/notes', require('./routes/notesRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
