const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  assignments: [{
    name: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    weight: {
      type: Number,
      required: true
    }
  }],
  midtermExam: {
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    weight: {
      type: Number,
      required: true
    }
  },
  finalExam: {
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    weight: {
      type: Number,
      required: true
    }
  },
  semester: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  finalGrade: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
});

// Calculate final grade before saving
gradeSchema.pre('save', function(next) {
  let totalScore = 0;
  let totalWeight = 0;

  // Calculate assignments score
  this.assignments.forEach(assignment => {
    totalScore += (assignment.score * assignment.weight);
    totalWeight += assignment.weight;
  });

  // Add midterm exam score
  totalScore += (this.midtermExam.score * this.midtermExam.weight);
  totalWeight += this.midtermExam.weight;

  // Add final exam score
  totalScore += (this.finalExam.score * this.finalExam.weight);
  totalWeight += this.finalExam.weight;

  // Calculate weighted average
  const finalScore = totalScore / totalWeight;

  // Set final grade
  this.finalGrade = Math.round(finalScore);

  next();
});

module.exports = mongoose.model('Grade', gradeSchema);
