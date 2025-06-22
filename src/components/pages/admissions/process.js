import React from 'react';

const AdmissionsProcess = () => {
  return (
    <section className="admissions-process">
      <h2>Admission Process</h2>
      <div className="process-steps">
        <div className="step">
          <h3>Step 1: Inquiry</h3>
          <p>Submit an inquiry form to express your interest.</p>
        </div>
        <div className="step">
          <h3>Step 2: Application</h3>
          <p>Complete the full application with all required documents.</p>
        </div>
        <div className="step">
          <h3>Step 3: Review</h3>
          <p>Our committee reviews your application thoroughly.</p>
        </div>
        <div className="step">
          <h3>Step 4: Decision</h3>
          <p>Receive an admission decision within 4-6 weeks.</p>
        </div>
      </div>
    </section>
  );
};

export default AdmissionsProcess;