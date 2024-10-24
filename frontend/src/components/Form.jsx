import React, { useState } from 'react';
import './form.css';
import axios from 'axios';

function Form() {
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    email: ''
  });
  
  const [message, setMessage] = useState('');  // To store success/error message
  const [isModalOpen, setIsModalOpen] = useState(false);  // To control modal visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3000/api/students', formData);
      setMessage(response.data.message);  // Set success message
      setIsModalOpen(true);  // Open modal
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.error || 'Something went wrong!'));
      setIsModalOpen(true);  // Open modal
    }
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="form-container">
      <form className="dark-form" onSubmit={handleSubmit}>
        <h1>Registration Form</h1>

        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
        />

        <label htmlFor="domain">Domain</label>
        <input
          type="text"
          id="domain"
          name="domain"
          value={formData.domain}
          onChange={handleChange}
          placeholder="Enter your domain"
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />

        <button type="submit" className="submit-btn">Submit</button>
      </form>

      {/* Modal component */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <p>{message}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Form;
