import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllListings.css'; // Import CSS for styling

function AllListings() {
  const [students, setStudents] = useState([]);  // State to hold the fetched data
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);      // Error state

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/students');
        setStudents(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch students');
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/students/${id}`);
      // Remove the deleted student from the state
      setStudents(students.filter(student => student._id !== id));
    } catch (error) {
      console.error('Failed to delete student:', error);
      setError('Failed to delete student');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="students-container">
      <h1 className="students-title">All Students Listings</h1>
      <ul className="students-list">
        {students.map((student) => (
          <li key={student._id} className="student-list-item">
            <h2 className="student-list-title">{student.name}</h2>
            <p className="student-list-info">Domain: {student.domain}</p>
            <p className="student-list-info">Email: {student.email}</p>
            <button 
              className="delete-button" 
              onClick={() => handleDelete(student._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllListings;
