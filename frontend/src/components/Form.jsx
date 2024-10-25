import React, { useState } from 'react';
import './form.css';
import axios from 'axios';

function Form() {
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    email: ''
  });
  
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3000/api/students', formData);
      setMessage(response.data.message);
      setIsModalOpen(true);
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.error || 'Something went wrong!'));
      setIsModalOpen(true);
    }
  };

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
        <select
          id="domain"
          name="domain"
          value={formData.domain}
          onChange={handleChange}
          required
          className="dropdown-select"
        >
          <option value="">Select your domain</option>
          <option value="Event Management">Event Management</option>
          <option value="Web Development">Web Development</option>
          <option value="Graphic Design">Graphic Design</option>
          <option value="Content Writing">Content Writing</option>
        </select>

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
