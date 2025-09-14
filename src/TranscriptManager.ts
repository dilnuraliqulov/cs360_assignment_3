export type StudentID = number;
export type Student = {studentID: number,studentName:string};
export type Course = string;
export type CourseGrade = {course:Course,grade:number};
export type Transcript = {student:Student,grades:CourseGrade[]};

let transcripts:Map<StudentID,Transcript> = new Map();

let nextID: StudentID = 1;

// initializes the database with 4 students,
// each with an empty transcript (handy for debugging)
export function initialize():void {
    transcripts.clear();
    nextID=1;

    const studentName: string[] = ["Sardor", "Jasur", "Jasur", "Nigora"];

    for(const name of studentName){

        const student: Student = { studentID: nextID++, studentName: name };


    const transcript:Transcript = {
        student,
        grades: []
    };

    transcripts.set(student.studentID,transcript);
}
}

// returns a list of all the transcripts.
// handy for debugging
export function getAll(): Transcript[] {
    return Array.from(transcripts.values());
}

// creates an empty transcript for a student with this name,
// and returns a fresh ID number
export function addStudent(name:string) : StudentID {
    const student:Student = {studentID:nextID++, studentName:name};

    const transcript:Transcript = {
        student,
        grades: []
    };
    transcripts.set(student.studentID,transcript);

    return student.studentID;
}

// gets transcript for given ID.  Returns undefined if missing
export function getTranscript(studentID:number) : Transcript {
    if(transcripts.has(studentID)) {
        return transcripts.get(studentID);
    }
    else{
        return undefined;
    }

}

// returns list of studentIDs matching a given name
export function getStudentIDs(studentName: string): StudentID[] {
    const ids: StudentID[] = [];
    for (const transcript of transcripts.values()) {
        if (transcript.student.studentName === studentName) {
            ids.push(transcript.student.studentID);
        }
    }
    return ids;
}

// deletes student with the given ID from the database.
// throws exception if no such student.
export function deleteStudent(studentID: StudentID): void {
    if (!transcripts.has(studentID)) {
        throw new Error(`No such student with ID ${studentID}`);
    }
    transcripts.delete(studentID);
}

// adds a grade for the given student in the given course.
// throws error if student already has a grade in that course.
export function addGrade(studentID: StudentID, course: Course, grade: number): void {
    const transcript = transcripts.get(studentID);
    if (!transcript) {
        throw new Error(`No such student with ID ${studentID}`);
    }
    const existing = transcript.grades.find(g => g.course === course);
    if (existing) {
        throw new Error(`Student already has a grade for course ${course}`);
    }
    transcript.grades.push({ course, grade });
}

// returns the grade for the given student in the given course
// throws an error if no such student or no such grade
export function getGrade(studentID: StudentID, course: Course): number {
    const transcript = transcripts.get(studentID);
    if (!transcript) {
        throw new Error(`No such student with ID ${studentID}`);
    }

    const courseGrade = transcript.grades.find(g => g.course === course);
    if (!courseGrade) {
        throw new Error(`No grade found for course ${course}`);
    }

    return courseGrade.grade;
}
