import axios from 'axios';

const API_URL = 'http://localhost:5002/api';
let authToken: string;
let testStudentId: string;

// Test data
const testStudent = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@test.com",
  studentId: "ST2023001"
};

async function runTests() {
  try {
    // 1. Login to get auth token
    console.log('\n1. Testing Authentication...');
    const authResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });
    authToken = authResponse.data.token;
    console.log('✅ Authentication successful');

    // Set default auth header
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

    // 2. Create new student
    console.log('\n2. Testing Student Creation...');
    const createResponse = await axios.post(`${API_URL}/students`, testStudent);
    testStudentId = createResponse.data._id;
    console.log('✅ Student created successfully');

    // 3. Get all students
    console.log('\n3. Testing Get All Students...');
    const getAllResponse = await axios.get(`${API_URL}/students`);
    console.log('✅ Retrieved students:', getAllResponse.data.length);

    // 4. Get single student
    console.log('\n4. Testing Get Single Student...');
    const getOneResponse = await axios.get(`${API_URL}/students/${testStudentId}`);
    console.log('✅ Retrieved student details');

    // 5. Delete student
    console.log('\n5. Testing Student Deletion...');
    await axios.delete(`${API_URL}/students/${testStudentId}`);
    console.log('✅ Student deleted successfully');

    console.log('\n✅ All tests completed successfully!');
  } catch (error: any) {
    console.error('\n❌ Test failed:', error.response?.data?.message || error.message);
  }
}

// Run the tests
console.log('Starting Student Management System Tests...');
runTests();
