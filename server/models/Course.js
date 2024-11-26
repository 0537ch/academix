const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Course code is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  credits: {
    type: Number,
    required: [true, 'Credits are required'],
    min: [1, 'Credits must be at least 1'],
    max: [6, 'Credits cannot exceed 6']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: [true, 'Teacher is required']
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  schedule: {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      required: [true, 'Day is required']
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required']
    },
    endTime: {
      type: String,
      required: [true, 'End time is required']
    },
    room: {
      type: String,
      required: [true, 'Room is required']
    }
  },
  semester: {
    type: String,
    enum: ['Fall', 'Spring', 'Summer'],
    required: [true, 'Semester is required']
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required']
  },
  maxStudents: {
    type: Number,
    required: [true, 'Maximum number of students is required'],
    min: [1, 'Must allow at least 1 student']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  syllabus: {
    objectives: [String],
    requirements: [String],
    materials: [String]
  },
  assignments: [{
    name: String,
    description: String,
    dueDate: Date,
    weight: Number // Percentage weight in final grade
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add index for faster queries
CourseSchema.index({ code: 1, semester: 1, academicYear: 1 });

// Virtual for current enrollment count
CourseSchema.virtual('enrollmentCount').get(function() {
  return this.students.length;
});

// Virtual to check if course is full
CourseSchema.virtual('isFull').get(function() {
  return this.students.length >= this.maxStudents;
});

// Method to check if student can be enrolled
CourseSchema.methods.canEnroll = function() {
  return this.isActive && !this.isFull;
};

// Method to enroll a student
CourseSchema.methods.enrollStudent = async function(studentId) {
  if (!this.canEnroll()) {
    throw new Error('Course is either inactive or full');
  }
  
  if (!this.students.includes(studentId)) {
    this.students.push(studentId);
    await this.save();
  }
};

// Method to remove a student
CourseSchema.methods.removeStudent = async function(studentId) {
  this.students = this.students.filter(id => id.toString() !== studentId.toString());
  await this.save();
};

// Static method to get active courses
CourseSchema.statics.getActiveCourses = function() {
  return this.find({ isActive: true })
    .populate('teacher', 'firstName lastName')
    .sort({ semester: 1, name: 1 });
};

// Static method to get courses by teacher
CourseSchema.statics.getCoursesByTeacher = function(teacherId) {
  return this.find({ teacher: teacherId, isActive: true })
    .populate('students', 'firstName lastName studentId');
};

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
