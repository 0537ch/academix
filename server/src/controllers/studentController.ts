import { Request, Response } from 'express';
import Student, { IStudent } from '../models/Student';

export const studentController = {
  // Create a new student
  async createStudent(req: Request, res: Response) {
    try {
      const student = new Student(req.body);
      await student.save();
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ message: 'Error creating student', error });
    }
  },

  // Get all students with pagination and filters
  async getStudents(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status;
      const search = req.query.search as string;

      const query: any = {};
      
      // Add status filter if provided
      if (status) {
        query.status = status;
      }

      // Add search functionality
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { studentId: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      const students = await Student.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Student.countDocuments(query);

      res.json({
        students,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalStudents: total
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching students', error });
    }
  },

  // Get a single student by ID
  async getStudent(req: Request, res: Response) {
    try {
      const student = await Student.findById(req.params.id)
        .populate('courses');
      
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching student', error });
    }
  },

  // Update a student
  async updateStudent(req: Request, res: Response) {
    try {
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      res.json(student);
    } catch (error) {
      res.status(400).json({ message: 'Error updating student', error });
    }
  },

  // Delete a student
  async deleteStudent(req: Request, res: Response) {
    try {
      const student = await Student.findByIdAndDelete(req.params.id);
      
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      res.json({ message: 'Student deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting student', error });
    }
  },

  // Add course to student
  async addCourse(req: Request, res: Response) {
    try {
      const { courseId } = req.body;
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { courses: courseId } },
        { new: true }
      );

      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      res.json(student);
    } catch (error) {
      res.status(400).json({ message: 'Error adding course to student', error });
    }
  },

  // Remove course from student
  async removeCourse(req: Request, res: Response) {
    try {
      const { courseId } = req.body;
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        { $pull: { courses: courseId } },
        { new: true }
      );

      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      res.json(student);
    } catch (error) {
      res.status(400).json({ message: 'Error removing course from student', error });
    }
  }
};
