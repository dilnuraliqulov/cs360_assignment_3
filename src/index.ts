import express from "express";
import cors from "cors";
import * as db from "./TranscriptManager"; // in-memory data manager

const app = express();
const port = 4001;

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Initialization
db.initialize();

// Routes

/**
 * GET /transcripts
 * Returns all transcripts in the system.
 * Handy for debugging or inspecting the full dataset.
 */
app.get("/transcripts", (req, res) => {
    console.log("Handling GET /transcripts");
    const data = db.getAll();
    console.log(data);
    res.status(200).json(data);
});

/**
 * POST /transcripts
 * Creates a new student with an empty transcript.
 * Requires: { name: string } in the body.
 */
app.post("/transcripts", (req, res) => {
    const studentName: string = req.body.name;
    if (!studentName) {
        return res.status(400).json({ error: "Student name is required" });
    }

    const studentID = db.addStudent(studentName);
    console.log(`Handling POST /transcripts name=${studentName}, id=${studentID}`);
    res.status(201).json({ studentID });
});

/**
 * GET /transcripts/:id
 * Returns the transcript for the student with the given ID.
 */
app.get("/transcripts/:id", (req, res) => {
    const id = Number(req.params.id);
    console.log(`Handling GET /transcripts/:id id=${id}`);
    const transcript = db.getTranscript(id);

    if (!transcript) {
        return res.status(404).json({ error: `No student with id=${id}` });
    }
    res.status(200).json(transcript);
});



/**
 * GET /studentids?name=Bob
 * Returns a list of student IDs that match the given student name.
 */
app.get("/studentids", (req, res) => {
    const name = req.query.name as string;
    console.log(`Handling GET /studentids?name=${name}`);

    if (!name) {
        return res.status(400).json({ error: "Query parameter 'name' is required" });
    }

    const ids = db.getStudentIDs(name);
    res.status(200).json(ids);
});

/**
 * DELETE /students/:id
 * Deletes the student and their transcript with the given ID.
 */
app.delete("/students/:id", (req, res) => {
    const id = Number(req.params.id);
    console.log(`Handling DELETE /students/:id id=${id}`);

    try {
        db.deleteStudent(id);
        res.status(200).json({ message: `Student ${id} deleted` });
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
});

/**
 * POST /grades
 * Adds a grade for a given student in a course.
 * Requires: { studentID: number, course: string, grade: number } in the body.
 */
app.post("/grades", (req, res) => {
    const { studentID, course, grade } = req.body;

    if (!studentID || !course || grade === undefined) {
        return res.status(400).json({ error: "studentID, course, and grade are required" });
    }

    try {
        db.addGrade(studentID, course, grade);
        res.status(201).json({ message: `Grade added for student ${studentID} in ${course}` });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * GET /grades?studentID=1&course=Math
 * Returns the grade for a specific student in a specific course.
 */
app.get("/grades", (req, res) => {
    const studentID = Number(req.query.studentID);
    const course = req.query.course as string;

    if (!studentID || !course) {
        return res.status(400).json({ error: "studentID and course are required" });
    }

    try {
        const grade = db.getGrade(studentID, course);
        res.status(200).json({ studentID, course, grade });
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
});
/**
 * POST /transcripts/:id/:course
 * Adds a grade for a specific student in a specific course.
 */
app.post("/transcripts/:id/:course", (req, res) => {
    const studentID = Number(req.params.id);
    const course = req.params.course;
    const grade = Number(req.body.grade);

    if (!grade && grade !== 0) {
        return res.status(400).json({ error: "Grade is required" });
    }

    try {
        db.addGrade(studentID, course, grade);
        res.status(201).json({ message: `Grade ${grade} added for student ${studentID} in ${course}` });
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
});

/**
 * GET /transcripts/:id/:course
 * Returns the grade for a specific student in a specific course.
 */
app.get("/transcripts/:id/:course", (req, res) => {
    const studentID = Number(req.params.id);
    const course = req.params.course;

    try {
        const grade = db.getGrade(studentID, course);
        res.status(200).json({ studentID, course, grade });
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
});


//Start Server
app.listen(port, () => {
    console.log(` Server running at http://localhost:${port}`);

    // Debug: print initial transcripts
    console.log("Initial list of transcripts:");
    console.log(JSON.stringify(db.getAll(), null, 2));
});
