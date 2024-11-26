const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  teacherId: {
    type: String,
    required: [true, 'Teacher ID is required'],
    unique: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Gender is required']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true
  },
  qualifications: [{
    degree: String,
    field: String,
    institution: String,
    year: Number
  }],
  specializations: [String],
  joinDate: {
    type: Date,
    default: Date.now
  },
  // For authentication
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  role: {
    type: String,
    default: 'teacher'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// Add index for faster queries
TeacherSchema.index({ email: 1, teacherId: 1 });

// Virtual for teacher's full name
TeacherSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for courses taught by this teacher
TeacherSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'teacher'
});

// Method to get current semester courses
TeacherSchema.methods.getCurrentCourses = async function() {
  const currentSemester = 'Fall'; // This should be determined dynamically
  const currentYear = new Date().getFullYear().toString();
  
  return await mongoose.model('Course').find({
    teacher: this._id,
    semester: currentSemester,
    academicYear: currentYear,
    isActive: true
  }).populate('students', 'firstName lastName studentId');
};

// Static method to get active teachers
TeacherSchema.statics.getActiveTeachers = function() {
  return this.find({ isActive: true });
};

// Static method to get teachers by department
TeacherSchema.statics.getTeachersByDepartment = function(department) {
  return this.find({ department, isActive: true })
    .select('-password')
    .sort({ lastName: 1, firstName: 1 });
};

const Teacher = mongoose.model('Teacher', TeacherSchema);

module.exports = Teacher;
