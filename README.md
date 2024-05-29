# Apotti Patient Standalone Application

This project is a standalone application to interact with FHIR servers. It allows users to authenticate with an OAuth2 provider, retrieve patient data, and view observations, specifically vital signs, from the FHIR server.

## Project Structure

apotti-patient-standalone/

├── client/

│ ├── public/

│ └── src/

├── server/

│ ├── .env

│ ├── package.json

│ ├── server.js

├── .gitignore

├── README.md


## Getting Started


### Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)

### Environment Variables

Create a `.env` file in the `server` directory with the following variables:

REACT_APP_FHIR_SERVER=https://gw.apottiekosysteemi.fi/Interconnect-FHIR-EKO01/api/FHIR/R4
REACT_APP_FHIR_SERVER_A=https://gw.apottiekosysteemi.fi/Interconnect-FHIR-EKO01/oauth2
REACT_APP_CLIENT_ID=813e058d-4934-4498-b412-46c8504772da


### Installation

1. Clone the repository:


git clone https://github.com/your-username/apotti-patient-standalone.git
cd apotti-patient-standalone

2. Install server dependencies:

cd server
npm install

3. Install client dependencies:

cd ../client
npm install

### Running the Application

Starting the Server

cd ../client
npm start

Starting the Client

cd ../client
npm start

The client will typically be available at http://localhost:3000 and the server at http://localhost:3001.

API Endpoints
Launch Endpoint
Redirects to the OAuth2 authorization URL.

URL: /launch
Method: GET
Callback Endpoint
Handles the OAuth2 authorization code exchange, retrieves the access token, and redirects to the frontend with the access token and patient ID.

URL: /callback
Method: GET
Query Parameters:
code - Authorization code returned from the OAuth2 provider
Patient Data Endpoint
Fetches patient data from the FHIR server.

URL: /api/patient/:patientId
Method: GET
Query Parameters:
accessToken - Access token for authorization
Path Parameters:
patientId - ID of the patient
Observation Data Endpoint
Fetches observation data (vital signs) for the given patient.

URL: /api/observation
Method: GET
Query Parameters:
patientId - ID of the patient
accessToken - Access token for authorization
Troubleshooting
Ensure that the .env file is correctly configured and located in the server directory.
Verify that all dependencies are correctly installed.
Ensure that the server is started from the server directory.
Check the console for any error messages and stack traces to help identify issues.
Contributing
Please feel free to submit issues, fork the repository, and send pull requests! We welcome all contributions.

### License
This project is licensed under the MIT License - see the LICENSE file for details.

### Acknowledgements
Express
Axios
http-proxy-middleware
React

### Notes:

- Replace `https://github.com/your-username/apotti-patient-standalone.git` with your actual GitHub repository URL.
- Ensure that the provided endpoint URLs and environment variable names match your actual setup.
- Add any additional information specific to your project as needed.











