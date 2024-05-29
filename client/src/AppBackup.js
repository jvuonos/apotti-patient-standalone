import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { JsonToTable } from 'react-json-to-table';

function App() {
  const [patientData, setPatientData] = useState(null);
  const [observationData, setObservationData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [patientId, setPatientId] = useState(null);

  const handleSignIn = () => {
    window.location.href = `${process.env.REACT_APP_FHIR_SERVER_A}/authorize?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=http://localhost:3001/callback&launch=YOUR_LAUNCH_ID`;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    const patientId = urlParams.get('patientId');

    if (accessToken && patientId) {
      setAccessToken(accessToken);
      setPatientId(patientId);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken || !patientId) return;

      try {
        const patientResponse = await axios.get(`http://localhost:3001/api/patient/${patientId}`, {
          params: { accessToken },
        });
        setPatientData(patientResponse.data);

        const observationResponse = await axios.get('http://localhost:3001/api/observation', {
          params: { patientId, accessToken },
        });
        setObservationData(observationResponse.data);
      } catch (error) {
        console.error('Error fetching FHIR data:', error);
      }
    };

    fetchData();
  }, [accessToken, patientId]);

  return (
    <div>
      <button onClick={handleSignIn}>Sign In</button>

      <h1>Patient Data</h1>
      {patientData && <JsonToTable json={patientData} />}

      <h1>Observation Data</h1>
      {observationData && <JsonToTable json={observationData} />}
    </div>
  );
}

export default App;
