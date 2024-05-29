import React from 'react';
import { JsonToTable } from 'react-json-to-table';

const PatientData = ({ patientData }) => {
  return (
    <div>
      <h2>Patient Data</h2>
      <JsonToTable json={patientData} />
    </div>
  );
};

export default PatientData;

