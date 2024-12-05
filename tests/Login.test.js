import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import '@testing-library/jest-dom/extend-expect';
import Login from '../Login'; // Update the path as needed
import theme from '../../path-to-your-theme'; // Replace with your actual theme import

// Mock the `userLogin` function
jest.mock('../services/auth-service', () => ({
  userLogin: jest.fn(() => Promise.resolve({ status: 200, token: 'fakeToken' })),
}));

// Mock `AppContext` lazily inside the factory
jest.mock('../Context/AppContext', () => {
  const React = jest.requireActual('react'); // Lazily import React
  return {
    __esModule: true,
    default: React.createContext({
      setAuth: jest.fn(),
      handleAccessToken: jest.fn(),
    }),
  };
});

describe('Login Component', () => {
  test('renders the login form', () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <ToastContainer />
          <Login />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Check for form fields and button
    expect(screen.getByLabelText(/User Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('updates input fields on change', () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <ToastContainer />
          <Login />
        </ThemeProvider>
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText(/User Name/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
  });

  test('calls the login function on form submission', async () => {
    const mockUserLogin = require('../services/auth-service').userLogin;

    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <ToastContainer />
          <Login />
        </ThemeProvider>
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText(/User Name/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(loginButton);

    // Wait for the mocked login function to be called
    expect(mockUserLogin).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123',
    });
  });

  test('displays error toast on failed login', async () => {
    const mockUserLogin = require('../services/auth-service').userLogin;
    mockUserLogin.mockImplementationOnce(() => Promise.reject(new Error('Invalid credentials')));

    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <ToastContainer />
          <Login />
        </ThemeProvider>
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText(/User Name/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    fireEvent.click(loginButton);

    // Check for toast error message
    const errorMessage = await screen.findByText(/Login failed/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
