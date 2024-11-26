const mongoose = require('mongoose');

const GradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
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
  assignments: [{
    name: {
      type: String,
      required: [true, 'Assignment name is required']
    },
    score: {
      type: Number,
      required: [true, 'Score is required'],
      min: [0, 'Score cannot be negative'],
      max: [100, 'Score cannot exceed 100']
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [0, 'Weight cannot be negative'],
      max: [100, 'Weight cannot exceed 100']
    },
    submissionDate: {
      type: Date,
      default: Date.now
    },
    comments: String
  }],
  finalGrade: {
    type: Number,
    min: [0, 'Grade cannot be negative'],
    max: [100, 'Grade cannot exceed 100']
  },
  letterGrade: {
    type: String,
    enum: ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F']
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add compound index for faster queries
GradeSchema.index({ student: 1, course: 1, semester: 1, academicYear: 1 }, { unique: true });

// Calculate final grade before saving
GradeSchema.pre('save', function(next) {
  if (this.assignments && this.assignments.length > 0) {
    let totalWeight = 0;
    let weightedSum = 0;

    this.assignments.forEach(assignment => {
      totalWeight += assignment.weight;
      weightedSum += (assignment.score * assignment.weight);
    });

    if (totalWeight > 0) {
      this.finalGrade = weightedSum / totalWeight;
      this.letterGrade = this.calculateLetterGrade(this.finalGrade);
    }
  }
  next();
});

// Method to calculate letter grade
GradeSchema.methods.calculateLetterGrade = function(score) {
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 67) return 'D+';
  if (score >= 60) return 'D';
  return 'F';
};

// Method to add a new assignment grade
GradeSchema.methods.addAssignment = function(assignment) {
  this.assignments.push(assignment);
  return this.save();
};

// Method to update an assignment grade
GradeSchema.methods.updateAssignment = function(assignmentId, updates) {
  const assignment = this.assignments.id(assignmentId);
  if (!assignment) throw new Error('Assignment not found');
  
  Object.assign(assignment, updates);
  return this.save();
};

// Static method to get student's grades
GradeSchema.statics.getStudentGrades = function(studentId, semester, academicYear) {
  const query = { student: studentId };
  if (semester) query.semester = semester;
  if (academicYear) query.academicYear = academicYear;

  return this.find(query)
    .populate('course', 'name code')
    .populate('gradedBy', 'firstName lastName')
    .sort({ 'course.name': 1 });
};

// Static method to get course grades
GradeSchema.statics.getCourseGrades = function(courseId) {
  return this.find({ course: courseId })
    .populate('student', 'firstName lastName studentId')
    .sort({ 'student.lastName': 1, 'student.firstName': 1 });
};

const Grade = mongoose.model('Grade', GradeSchema);

module.exports = Grade;
