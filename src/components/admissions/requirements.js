import React from 'react';

const AdmissionsRequirements = () => {
  return (
    <section className="admissions-requirements">
      <h2>Admission Requirements</h2>
      <ul className="requirements-list">
        <li>Completed application form</li>
        <li>Official transcripts from previous institutions</li>
        <li>Letters of recommendation (2 required)</li>
        <li>Statement of purpose</li>
        <li>Standardized test scores (if applicable)</li>
        <li>Application fee</li>
      </ul>
      <div className="additional-info">
        <h3>Additional Requirements for International Students</h3>
        <ul>
          <li>TOEFL/IELTS scores</li>
          <li>Financial documentation</li>
          <li>Passport copy</li>
        </ul>
      </div>
    </section>
  );
};

export default AdmissionsRequirements;