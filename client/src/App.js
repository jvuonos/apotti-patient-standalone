import React, { useState, useEffect } from 'react';
import SignIn from './components/SignIn';
import PatientData from './components/PatientData';
import ObservationData from './components/ObservationData';
import { fetchPatientData, fetchObservationData } from './services/api';

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [observationData, setObservationData] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('accessToken');
    const id = urlParams.get('patientId');

    if (token && id) {
      setAccessToken(token);
      setPatientId(id);
    }
  }, []);

  useEffect(() => {
    if (accessToken && patientId) {
      const fetchData = async () => {
        try {
          const patient = await fetchPatientData(patientId, accessToken);
          setPatientData(patient);

          const observation = await fetchObservationData(patientId, accessToken);
          setObservationData(observation);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [accessToken, patientId]);

  const handleSignIn = () => {
    window.location.href = `${process.env.REACT_APP_FHIR_SERVER_A}/authorize?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=http://localhost:3001/callback&launch=YOUR_LAUNCH_ID`;
  };

  return (
    <div>
      <h1>Apotti Patient Standalone Application</h1>
      {!accessToken ? (
        <SignIn handleSignIn={handleSignIn} />
      ) : (
        <>
          {patientData && <PatientData patientData={patientData} />}
          {observationData && <ObservationData observationData={observationData} />}
        </>
      )}
    </div>
  );
};

export default App;
