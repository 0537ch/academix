import mongoose from 'mongoose';
import Course from '../models/Course';
import { config } from '../config';

const courses = [
  {
    name: "Introduction to Computer Science",
    code: "CS101",
    description: "Basic concepts of programming and computer science fundamentals",
    credits: 3,
    teacher: "6745986a279cfc8fbdaeeef9", // Using existing teacher ID
    schedule: {
      day: "Monday",
      startTime: "09:00",
      endTime: "10:30",
      room: "A101"
    },
    semester: "Fall",
    academicYear: "2023-2024"
  },
  {
    name: "Data Structures and Algorithms",
    code: "CS201",
    description: "Advanced programming concepts focusing on data structures and algorithms",
    credits: 4,
    teacher: "6745986a279cfc8fbdaeeef9",
    schedule: {
      day: "Tuesday",
      startTime: "11:00",
      endTime: "12:30",
      room: "B202"
    },
    semester: "Fall",
    academicYear: "2023-2024"
  },
  {
    name: "Database Management Systems",
    code: "CS301",
    description: "Introduction to database design, SQL, and database management",
    credits: 3,
    teacher: "6745986a279cfc8fbdaeeef9",
    schedule: {
      day: "Wednesday",
      startTime: "14:00",
      endTime: "15:30",
      room: "C303"
    },
    semester: "Fall",
    academicYear: "2023-2024"
  },
  {
    name: "Web Development",
    code: "CS401",
    description: "Modern web development using HTML, CSS, JavaScript, and frameworks",
    credits: 4,
    teacher: "6745986a279cfc8fbdaeeef9",
    schedule: {
      day: "Thursday",
      startTime: "09:30",
      endTime: "11:00",
      room: "D404"
    },
    semester: "Fall",
    academicYear: "2023-2024"
  },
  {
    name: "Artificial Intelligence",
    code: "CS501",
    description: "Introduction to AI concepts, machine learning, and neural networks",
    credits: 4,
    teacher: "6745986a279cfc8fbdaeeef9",
    schedule: {
      day: "Friday",
      startTime: "13:00",
      endTime: "14:30",
      room: "E505"
    },
    semester: "Fall",
    academicYear: "2023-2024"
  },
  {
    name: "Software Engineering",
    code: "CS601",
    description: "Software development lifecycle, project management, and best practices",
    credits: 3,
    teacher: "6745986a279cfc8fbdaeeef9",
    schedule: {
      day: "Monday",
      startTime: "15:30",
      endTime: "17:00",
      room: "F606"
    },
    semester: "Fall",
    academicYear: "2023-2024"
  },
  {
    name: "Cybersecurity Fundamentals",
    code: "CS701",
    description: "Introduction to cybersecurity, network security, and ethical hacking",
    credits: 4,
    teacher: "6745986a279cfc8fbdaeeef9",
    schedule: {
      day: "Tuesday",
      startTime: "16:00",
      endTime: "17:30",
      room: "G707"
    },
    semester: "Fall",
    academicYear: "2023-2024"
  }
];

async function seedCourses() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Delete existing courses
    await Course.deleteMany({});
    console.log('Existing courses deleted');

    // Insert new courses
    const createdCourses = await Course.insertMany(courses);
    console.log('Courses seeded successfully:', createdCourses.map(course => course.name));

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error seeding courses:', error);
    await mongoose.disconnect();
  }
}

// Run the seed function
seedCourses();
