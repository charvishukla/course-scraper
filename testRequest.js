const axios = require('axios');

async function fetchCourses(majorCode) {
  const url = `http://localhost:3002/api/courses/${majorCode}`;

  try {
    const res = await axios.get(url);
    console.log(res.data);
  } catch (error) {
    console.error(`Error fetching courses: ${error}`);
  }
}

const majorCode = 'yourMajorCode'; // Replace with the major code you want to use
fetchCourses(majorCode);