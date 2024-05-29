import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export const fetchPatientData = async (patientId, accessToken) => {
  const response = await axios.get(`${API_BASE_URL}/api/patient/${patientId}`, {
    params: { accessToken }
  });
  return response.data;
};

export const fetchObservationData = async (patientId, accessToken) => {
  const response = await axios.get(`${API_BASE_URL}/api/observation`, {
    params: { patientId, accessToken }
  });
  return response.data;
};
