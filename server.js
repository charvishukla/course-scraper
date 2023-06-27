const express = require('express');
const cors = require('cors');
const { fetchCourses } = require('./firebase/fetchMajor'); // Import the fetchCourses function
const app = express();
const port = process.env.PORT || 3002;
require('dotenv').config();

app.use(express.json());
app.use(cors());

app.get('/api/courses/:majorCode', async (req, res) => {
  const majorCode = req.params.majorCode;

  try {
      // Use the fetchCourses function to fetch the course data from Firestore
      const courses = await fetchCourses(majorCode);
      
      // Send the courses object as JSON
      res.json(courses);
  } 
  catch (error) {
      console.error(`Error fetching courses: ${error}`);
      res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});