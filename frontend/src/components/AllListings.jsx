import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllListings.css';

function AllListings() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDomain, setFilterDomain] = useState('');  // State for filtering domain

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
      setStudents(students.filter(student => student._id !== id));
    } catch (error) {
      console.error('Failed to delete student:', error);
      setError('Failed to delete student');
    }
  };

  const handleDomainChange = (e) => {
    setFilterDomain(e.target.value);
  };

  const filteredStudents = filterDomain
    ? students.filter(student => student.domain === filterDomain)
    : students;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="students-container">
      <h1 className="students-title">All Students Listings</h1>

      <div className="filter-container">
        <label htmlFor="domain-filter">Filter by Domain:</label>
        <select
          id="domain-filter"
          value={filterDomain}
          onChange={handleDomainChange}
          className="domain-select"
        >
          <option value="">All</option>
          <option value="Web Development">Web Development</option>
          <option value="Event Management">Event Management</option>
          <option value="Content Writing">Content Writing</option>
          <option value="Graphics Designing">Graphics Designing</option>
        </select>
      </div>

      <ul className="students-list">
        {filteredStudents.map((student) => (
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
