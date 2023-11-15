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
	  window.localStorage.setItem("jwtToken", token);
  
	  // Redirect to the admin page
	  window.location.href = 'admin.html';
	} catch (error) {
	  console.error('Authentication failed', error);
	  alert('Authentication failed. Please check your credentials.');
	}
  }

// Example function for making an authenticated request
export async function fetchData() {
	const token = getJwtToken(); // Implement a function to retrieve the token
	console.log('Token for fetchData:', token);
  
	try {
	  const response = await axios.get(`${apiUrl}/admin`, {
		headers: {
		  Authorization: token,
		},
	  });
  
	  console.log('Admin data:', response.data);
	} catch (error) {
	  console.error('Failed to fetch admin data', error);
	}
  }

// Function to retrieve the JWT token from the cookie
function getJwtToken() {
	if (!window.localStorage.getItem("jwtToken")) {
		window.location.href="/";
	}
  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith('jwtToken'))
    .split('=')[1];

  return cookieValue;
}

fetchData()
