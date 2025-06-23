import React from 'react';
import AdmissionsProcess from './process';
import AdmissionsRequirements from './requirements';
import AdmissionsApply from './apply';

const AdmissionsPage = () => {
  return (
    <div className="admissions-page">
      <h1>Admissions</h1>
      <AdmissionsProcess />
      <AdmissionsRequirements />
      <AdmissionsApply />
    </div>
  );
};

export default AdmissionsPage;