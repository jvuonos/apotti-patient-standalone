require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const qs = require('qs');
const app = express();
const port = 3001;

app.use(cors());

const proxyOptions = {
  target: process.env.REACT_APP_FHIR_SERVER_A,
  changeOrigin: true,
  pathRewrite: {
    '^/fhir': '', // Remove the '/fhir' prefix when forwarding requests
  },
};

app.use('/fhir', createProxyMiddleware(proxyOptions));

app.get('/launch', (req, res) => {
  const authorizeUrl = `${process.env.REACT_APP_FHIR_SERVER_A}/authorize?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=http://localhost:3001/callback&launch=YOUR_LAUNCH_ID`;
  res.redirect(authorizeUrl);
});

app.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;

    const tokenResponse = await axios.post(
      `${process.env.REACT_APP_FHIR_SERVER_A}/token`,
      qs.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'http://localhost:3001/callback',
        client_id: process.env.REACT_APP_CLIENT_ID,
        state: '1234',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    const patientId = tokenResponse.data.patient;

    res.redirect(`http://localhost:3000?accessToken=${accessToken}&patientId=${patientId}`);
  } catch (error) {
    console.error('Error exchanging authorization code for access token:', error);
    res.status(error.response.status || 500).send(error.response.data || 'Internal server error');
  }
});

app.get('/api/patient/:patientId', async (req, res) => {
  const { patientId } = req.params;
  const { accessToken } = req.query;

  console.log(`Received request for patientId: ${patientId} with accessToken: ${accessToken}`);

  try {
    const response = await axios.get(`${process.env.REACT_APP_FHIR_SERVER}/Patient/${patientId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('Successfully fetched patient data:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching patient data:', {
      message: error.message,
      config: error.config,
      code: error.code,
      request: error.request,
      response: error.response ? {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data
      } : null,
    });
    res.status(error.response?.status || 500).send(error.response?.data || 'Internal server error');
  }
});

app.get('/api/observation', async (req, res) => {
  try {
    const { patientId, accessToken } = req.query;

    const observationResponse = await axios.get(`${process.env.REACT_APP_FHIR_SERVER}/Observation?patient=${patientId}&category=vital-signs`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json(observationResponse.data);
  } catch (error) {
    console.error('Error fetching observation data:', error);
    res.status(error.response.status || 500).send(error.response.data || 'Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
