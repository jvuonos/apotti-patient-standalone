import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders the application title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Apotti Patient Standalone Application/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders SignIn component when no accessToken is provided', () => {
    render(<App />);
    const signInButton = screen.getByText(/Sign In/i);
    expect(signInButton).toBeInTheDocument();
  });

  test('calls handleSignIn when Sign In button is clicked', () => {
    render(<App />);
    const signInButton = screen.getByText(/Sign In/i);
    fireEvent.click(signInButton);
    expect(window.location.href).toContain(`${process.env.REACT_APP_FHIR_SERVER_A}/authorize`);
  });

  // Mock fetchPatientData and fetchObservationData to test their rendering
  test('renders PatientData and ObservationData components when accessToken is provided', async () => {
    const mockPatientData = { id: 'patient1', name: 'John Doe' };
    const mockObservationData = { observation: 'data' };

    jest.mock('./services/api', () => ({
      fetchPatientData: jest.fn(() => Promise.resolve(mockPatientData)),
      fetchObservationData: jest.fn(() => Promise.resolve(mockObservationData)),
    }));

    const originalLocation = window.location;
    delete window.location;
    window.location = {
      ...originalLocation,
      search: '?accessToken=mockToken&patientId=mockPatientId',
    };

    render(<App />);
    const patientDataElement = await screen.findByText(/Patient Data/i);
    const observationDataElement = await screen.findByText(/Observation Data/i);

    expect(patientDataElement).toBeInTheDocument();
    expect(observationDataElement).toBeInTheDocument();

    window.location = originalLocation;
  });
});
