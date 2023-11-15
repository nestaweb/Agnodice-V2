// frontend/scripts/adminPanel.js
import axios from 'axios';

const apiUrl = 'http://localhost:3001/api';

export async function authenticateUser() {
  try {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await axios.post(`${apiUrl}/authenticate`, {
      username,
      password,
    });

    const token = response.data.token;
    console.log('Token JWT obtained:', token);

    // Store the token securely, e.g., in a cookie or local storage
    window.localStorage.setItem('jwtToken', token);

    // Redirect to the admin page
    window.location.href = '/admin';
  } catch (error) {
    console.error('Authentication failed', error);
    alert('Authentication failed. Please check your credentials.');
  }
}

// Example function for making an authenticated request
export async function fetchData() {
  const token = getJwtToken();
  if (!token) {
    console.error('No JWT token found');
    window.location.href = '/login';
    return;
  }

  try {
    const response = await axios.get(`${apiUrl}/admin`, {
      headers: {
        Authorization: `Bearer ${token}`, // Ensure 'Bearer' is prepended to the token
      },
    });

    console.log('Admin data:', response.data);
  } catch (error) {
    console.error('Failed to fetch admin data', error);
  }
}

// Function to retrieve the JWT token from local storage
function getJwtToken() {
  return window.localStorage.getItem('jwtToken');
}

// Call fetchData when the script is loaded (you may want to trigger this based on user actions)
fetchData();
