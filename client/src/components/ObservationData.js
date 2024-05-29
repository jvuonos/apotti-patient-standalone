import React from 'react';
import { JsonToTable } from 'react-json-to-table';

const ObservationData = ({ observationData }) => {
  return (
    <div>
      <h2>Observation Data</h2>
      <JsonToTable json={observationData} />
    </div>
  );
};

export default ObservationData;

