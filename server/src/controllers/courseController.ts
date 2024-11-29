import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import Course, { ICourse } from '../models/Course';
import User from '../models/User';

interface PopulatedUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
}

interface CourseDocument extends Omit<ICourse, '_id' | 'teacher' | 'students'> {
  _id: Types.ObjectId;
  teacher: PopulatedUser;
  students: PopulatedUser[];
}

interface CourseResponse {
  _id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  teacher: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  students: {
    _id: string;
    firstName: string;
    lastName: string;
  }[];
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  };
}

const convertToResponse = (course: CourseDocument): CourseResponse => ({
  ...course,
  _id: course._id.toString(),
  teacher: course.teacher ? {
    ...course.teacher,
    _id: course.teacher._id.toString()
  } : {
    _id: '',
    firstName: 'Not',
    lastName: 'Assigned'
  },
  students: (course.students || []).map(student => ({
    ...student,
    _id: student._id.toString()
  }))
});

export const courseController = {
  // Get all courses
  getAllCourses: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('Getting all courses...');
      const courses = await Course.find()
        .populate<{ teacher: PopulatedUser }>('teacher', '_id firstName lastName')
        .populate<{ students: PopulatedUser[] }>('students', '_id firstName lastName')
        .lean();

      console.log('Found courses:', courses);

      // Type assertion after verifying the structure
      const typedCourses = courses as unknown as CourseDocument[];
      const coursesResponse = typedCourses.map(convertToResponse);
      
      console.log('Sending response:', coursesResponse);
      res.json(coursesResponse);
    } catch (error) {
      console.error('Error getting courses:', error);
      next(error);
    }
  },

  // Get course by ID
  getCourseById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const course = await Course.findById(req.params.id)
        .populate<{ teacher: PopulatedUser }>('teacher', '_id firstName lastName')
        .populate<{ students: PopulatedUser[] }>('students', '_id firstName lastName')
        .lean();

      if (!course) {
        res.status(404).json({ message: 'Course not found' });
        return;
      }

      // Type assertion after verifying the structure
      const typedCourse = course as unknown as CourseDocument;
      const courseResponse = convertToResponse(typedCourse);
      res.json(courseResponse);
    } catch (error) {
      next(error);
    }
  },

  // Create new course
  createCourse: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('Creating course with data:', req.body);
      const course = new Course(req.body);
      await course.save();
      
      const populatedCourse = await Course.findById(course._id)
        .populate<{ teacher: PopulatedUser }>('teacher', '_id firstName lastName')
        .populate<{ students: PopulatedUser[] }>('students', '_id firstName lastName')
        .lean();

      if (!populatedCourse) {
        res.status(404).json({ message: 'Course not found after creation' });
        return;
      }

      // Type assertion after verifying the structure
      const typedCourse = populatedCourse as unknown as CourseDocument;
      const courseResponse = convertToResponse(typedCourse);
      res.status(201).json(courseResponse);
    } catch (error) {
      console.error('Error creating course:', error);
      next(error);
    }
  },

  // Update course
  updateCourse: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const course = await Course.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      )
      .populate<{ teacher: PopulatedUser }>('teacher', '_id firstName lastName')
      .populate<{ students: PopulatedUser[] }>('students', '_id firstName lastName')
      .lean();

      if (!course) {
        res.status(404).json({ message: 'Course not found' });
        return;
      }

      // Type assertion after verifying the structure
      const typedCourse = course as unknown as CourseDocument;
      const courseResponse = convertToResponse(typedCourse);
      res.json(courseResponse);
    } catch (error) {
      next(error);
    }
  },

  // Delete course
  deleteCourse: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const course = await Course.findByIdAndDelete(req.params.id);
      if (!course) {
        res.status(404).json({ message: 'Course not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  // Enroll in course
  enrollInCourse: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courseId = req.params.id;
      const userId = req.user?._id;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const course = await Course.findById(courseId);
      if (!course) {
        res.status(404).json({ message: 'Course not found' });
        return;
      }

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      // Check if already enrolled
      const isEnrolled = course.students.some(studentId => studentId.equals(userId));
      if (isEnrolled) {
        res.status(400).json({ message: 'Already enrolled in this course' });
        return;
      }

      // Add student to course and course to user's enrolled courses
      course.students.push(userId);
      user.enrolledCourses.push(new Types.ObjectId(courseId));

      await Promise.all([course.save(), user.save()]);

      const updatedCourse = await Course.findById(courseId)
        .populate<{ teacher: PopulatedUser }>('teacher', '_id firstName lastName')
        .populate<{ students: PopulatedUser[] }>('students', '_id firstName lastName')
        .lean();

      if (!updatedCourse) {
        res.status(404).json({ message: 'Course not found after enrollment' });
        return;
      }

      // Type assertion after verifying the structure
      const typedCourse = updatedCourse as unknown as CourseDocument;
      const courseResponse = convertToResponse(typedCourse);
      res.json(courseResponse);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      next(error);
    }
  },

  // Unenroll from course
  unenrollFromCourse: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courseId = req.params.id;
      const userId = req.user?._id;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const course = await Course.findById(courseId);
      if (!course) {
        res.status(404).json({ message: 'Course not found' });
        return;
      }

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      // Check if not enrolled
      const isEnrolled = course.students.some(studentId => studentId.equals(userId));
      if (!isEnrolled) {
        res.status(400).json({ message: 'Not enrolled in this course' });
        return;
      }

      // Remove student from course and course from user's enrolled courses
      course.students = course.students.filter(studentId => !studentId.equals(userId));
      user.enrolledCourses = user.enrolledCourses.filter(courseId => !courseId.equals(courseId));

      await Promise.all([course.save(), user.save()]);

      const updatedCourse = await Course.findById(courseId)
        .populate<{ teacher: PopulatedUser }>('teacher', '_id firstName lastName')
        .populate<{ students: PopulatedUser[] }>('students', '_id firstName lastName')
        .lean();

      if (!updatedCourse) {
        res.status(404).json({ message: 'Course not found after unenrollment' });
        return;
      }

      // Type assertion after verifying the structure
      const typedCourse = updatedCourse as unknown as CourseDocument;
      const courseResponse = convertToResponse(typedCourse);
      res.json(courseResponse);
    } catch (error) {
      console.error('Error unenrolling from course:', error);
      next(error);
    }
  }
};
