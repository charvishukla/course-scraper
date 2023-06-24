# Welcome to triton-enroll's backend!

## Tech Stack

## General

This is the backend for Triton enroll. It sends requests to UCSD’s catalog [website](https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudent.htm) in order to get course data. 

For a specified department and quarter, the school’s website returns an entire HTML page (rip). I wrote a parser in javascript to extract this data. If you specify a subject and quarter, `course_parser.js` will return to you:

- Course name
- Course number
    - Timing
    - Location
    - Room
    - Professor
    - Discussion Section/ Lab/ Seminar information
        - Section Name + number
        - Timing
        - Location
        - Room
        - Total seats
        - Remaining seats

Sometimes, there are multiple pages for each course (for example, the Computer Science and Engineering Department). To handle this, I wrote `request_major.js` which finds the number of pages, retrieves the HTML response for each of them and compiles the result into one `JSON` object. 

I then realized that if I try to parse everything every time, my web application will be painfully slow. So, i decided to use a ********************************************************Firebase Fire store Database******************************************************** to save all of one quarter’s data (i.e. when I populate the database using `firebase\populateFirestore.js`), Then, I can quickly access and display data on my website!
