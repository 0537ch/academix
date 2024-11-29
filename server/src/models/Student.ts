import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  dateOfBirth: Date;
  gender: string;
  courses: mongoose.Types.ObjectId[];
  password: string;
  role: string;
  isActive: boolean;
  enrollmentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema = new Schema({
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true
  },
  studentId: { 
    type: String, 
    required: true,
    unique: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  courses: [{
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }],
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'student'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  enrollmentDate: { 
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model<IStudent>('Student', StudentSchema);
