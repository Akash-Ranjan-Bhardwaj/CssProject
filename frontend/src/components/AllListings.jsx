import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import './AllListings.css';

function AllListings() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDomain, setFilterDomain] = useState('');

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

 
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12); // Adjust font size for better line fitting

    let currentY = 20; // Starting position for student details
    let lineHeight = doc.getTextWidth('Test') + 5; // Estimate line height with padding

    const drawStudentDetails = (name, domain, email) => {
      const nameLines = doc.splitTextToSize(name, doc.internal.pageSize.getWidth() - 40); // Adjust margin
      const domainLines = doc.splitTextToSize(domain, doc.internal.pageSize.getWidth() - 40);
      const emailLines = doc.splitTextToSize(email, doc.internal.pageSize.getWidth() - 40);

      nameLines.forEach((line, index) => {
        doc.text(20, currentY + index * lineHeight, line);
      });

      currentY += nameLines.length * lineHeight; // Adjust position based on lines

      domainLines.forEach((line, index) => {
        doc.text(20, currentY + index * lineHeight, `Domain: ${line}`);
      });

      currentY += domainLines.length * lineHeight;

      emailLines.forEach((line, index) => {
        doc.text(20, currentY + index * lineHeight, `Email: ${line}`);
      });

      currentY += emailLines.length * lineHeight; // Adjust position for next student

      // Draw a border after each student
      doc.setLineWidth(0.5); // Adjust border width
      doc.line(20, currentY, doc.internal.pageSize.getWidth() - 20, currentY);
      currentY += 5; // Add a small gap after the border
    };

    filteredStudents.forEach((student) => {
      drawStudentDetails(student.name, student.domain, student.email);

      // Check if content overflows the page height
      if (currentY + lineHeight > doc.internal.pageSize.getHeight()) {
        doc.addPage(); // Add a new page if needed
        currentY = 20; // Reset position for new page
      }
    });

    doc.save('filtered_students.pdf');
  };



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

      <button onClick={downloadPDF} className="download-button">
        Download PDF
      </button>

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
