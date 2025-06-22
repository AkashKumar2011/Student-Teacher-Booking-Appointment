import React, { useState } from 'react';

const AdmissionsApply = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    program: '',
    documents: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, documents: e.target.files }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    console.log('Application submitted:', formData);
  };

  return (
    <section className="admissions-apply">
      <h2>Apply Now</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input 
            type="text" 
            id="firstName" 
            name="firstName" 
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input 
            type="text" 
            id="lastName" 
            name="lastName" 
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="program">Program of Interest</label>
          <select 
            id="program" 
            name="program" 
            value={formData.program}
            onChange={handleChange}
            required
          >
            <option value="">Select a program</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="graduate">Graduate</option>
            <option value="phd">PhD</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="documents">Upload Required Documents (PDF only)</label>
          <input 
            type="file" 
            id="documents" 
            name="documents" 
            onChange={handleFileChange}
            multiple
            accept=".pdf"
            required
          />
        </div>
        
        <button type="submit" className="submit-btn">Submit Application</button>
      </form>
    </section>
  );
};

export default AdmissionsApply;