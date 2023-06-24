const { db, admin } = require("./firebaseConfig.js");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");
const axios = require("axios");
const generatejson = require("/Users/charvieshukla/Documents/GitHub/course-scraper/request_major.js");
const assert = require("assert");
const { exit } = require("process");
const chalk = require("chalk");
const {
  buildcombinedJSON,
} = require("/Users/charvieshukla/Documents/GitHub/course-scraper/request_major.js");

function getSubjectUrl(qtr) {
  return `https://act.ucsd.edu/scheduleOfClasses/subject-list.json?selectedTerm=${qtr}`;
}

const QTR = "FA23";

async function populateDB(courseCode) {
  // Right now, we just get from test/combined.json
  // let fileData = fs.readFileSync('./test/combined.json')
  // let json = JSON.parse(fileData)

  const json = await buildcombinedJSON(QTR, courseCode);

  let data = json.data;

  if (data.length === 0) {
    console.log(`No courses available for ${courseCode}, skipping...`);
    return;
  }

  assert(data.length > 0, "data should not be empty");

  for (let i = 0; i < data.length; i++) {
    const obj = data[i];

    assert(obj.hasOwnProperty("courseDep"), "courseDep DNE");
    const courseDep = obj.courseDep;
    assert(obj.hasOwnProperty("courseNum"), "courseNum DNE");
    const courseNum = obj.courseNum;
    assert(obj.hasOwnProperty("courseName"), "courseName DNE");
    const courseName = obj.courseName;
    assert(obj.hasOwnProperty("courseUnits"), "courseUnits DNE");
    const courseUnits = obj.courseUnits;
    assert(obj.hasOwnProperty("sections"), "sections DNE");
    const sections = obj.sections;

    console.log(chalk.red(`SubjectCollection (${courseCode})`));
    let collection = db.collection(`${courseCode}`);
    console.log(chalk.blue(`    CourseDocument (${courseNum})`));
    let document = collection.doc(`${courseNum}`);
    console.log(
      chalk.green(
        `        CourseFields (${JSON.stringify({
          name: courseName,
          units: courseUnits,
        })})`
      )
    );

    await document.set({
      name: courseName,
      units: courseUnits,
    });

    if (typeof obj.sections === "undefined") {
      continue;
    } else {
      for (let j = 0; j < sections.length; j++) {
        const section = sections[j];
        assert(section.hasOwnProperty("secID"), "sectionId DNE");
        let secID = section.secID;
        let { sectionName, sectionNumber } = parseSectionId(secID);

        console.log(chalk.yellow(`        SectionCollection (${sectionName})`));
        let section_collection = document.collection(`${sectionName}`);

        console.log(
          chalk.red(`            SectionCollection (${sectionNumber})`)
        );
        let single_section = section_collection.doc(`${sectionNumber}`);

        console.log(
          chalk.green(
            `                SectionFields (${JSON.stringify({
              room: section.room,
              building: section.building,
            })})`
          )
        );

        await single_section.set(section);
      }
    }
  }
}

function parseSectionId(str) {
  if (/^\d+$/.test(str)) {
    // isNumber?
    return {
      sectionName: "seminar",
      sectionNumber: Number(str),
    };
  } else {
    return {
      sectionName: str.substring(0, 1),
      sectionNumber: Number(str.substring(1)),
    };
  }
}

async function getSubs(qtr) {
  try {
      const response = await axios.get(getSubjectUrl(qtr));
      const subjects = response.data;

      // You might want to loop through subjects using for..of and await populateDB
      for (const subject of subjects) {
          console.log(subject.code);
          await populateDB(subject.code);
      }
  } catch (error) {
      console.log(error);
  }
}

(async () => {
  await getSubs(QTR);
})();


// ---------------------------------------------------------------------------
// --------------------------getting major list-------------------------------
// ---------------------------------------------------------------------------


// async function getSubs(qtr) {
//   try {
//     const response = await axios.get(getSubjectUrl(qtr));
//     const subjects = response.data;
//     console.log(subjects);

//     const filePath = "allMajors.json";

//     fs.writeFile(filePath, JSON.stringify(subjects), "utf8", (err) => {
//       if (err) {
//         console.error("An error occurred while writing the file:", err);
//       } else {
//         console.log("The object has been successfully written to the file!");
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

// getSubs(QTR);
