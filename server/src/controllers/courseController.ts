import { Request, Response } from 'express';
import Course from '../models/Course';

// Get all courses
export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find()
      .populate('teacher', 'firstName lastName')
      .populate('students', 'firstName lastName');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

// Get course by ID
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'firstName lastName')
      .populate('students', 'firstName lastName');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course' });
  }
};

// Create new course
export const createCourse = async (req: Request, res: Response) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: 'Error creating course' });
  }
};

// Update course
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: 'Error updating course' });
  }
};

// Delete course
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course' });
  }
};

// Add student to course
export const addStudentToCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    const studentId = req.body.studentId;
    if (!course.students.includes(studentId)) {
      course.students.push(studentId);
      await course.save();
    }
    
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: 'Error adding student to course' });
  }
};

// Remove student from course
export const removeStudentFromCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    const studentId = req.body.studentId;
    course.students = course.students.filter(id => id.toString() !== studentId);
    await course.save();
    
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: 'Error removing student from course' });
  }
};
