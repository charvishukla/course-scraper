const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { parseHtml } = require('./course_parser'); 
const { buildcombinedJSON} = require('./request_major')
const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());

app.get('/api/courses/:majorCode', async (req, res) => {
  const majorCode = req.params.majorCode;
  const term = 'WI23'; // You may want to make this dynamic as well

  try {
      // Use the buildcombinedJSON function to fetch course data and combine it into an object
      const courses = await buildcombinedJSON(term, majorCode);
      console.log(courses);
      
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