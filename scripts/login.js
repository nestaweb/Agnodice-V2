import axios from 'axios';

const apiUrl = 'http://localhost:3001/api';

export async function authenticateUser() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await axios.post(`${apiUrl}/authenticate`, {
      username,
      password,
    });

    if (response.status === 200) {
      const token = response.data.token;
      console.log('Token JWT obtained:', token);

      // Store the token securely, e.g., in a cookie or local storage
      window.localStorage.setItem('jwtToken', token);

      // Redirect to the admin page
      window.location.href = '/admin';
    } else {
      console.error('Authentication failed. Unexpected response status:', response.status);
      alert('Authentication failed. Please check your credentials.');
    }
  } catch (error) {
    console.error('Authentication failed', error);
    alert('Authentication failed. Please check your credentials.');
  }
}


export async function fetchData() {
  const token = getJwtToken();

  try {
    const response = await axios.get(`${apiUrl}/admin`, {
      headers: {
        Authorization: `${token}`,
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


document.getElementById('loginForm').querySelector("button").addEventListener("click", () => {
  authenticateUser();
})

// Ensure that the authenticateUser function is available globally
window.authenticateUser = authenticateUser;

// Example: Make authenticated request after successful login
fetchData();
