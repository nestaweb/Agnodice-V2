// frontend/scripts/login.js
import axios from 'axios';

const apiUrl = 'http://localhost:3001/api'; // Update this to the correct server port

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

document.getElementById('loginForm').addEventListener('submit', (event) => {
  event.preventDefault();
  authenticateUser();
});

// Ensuring that the authenticateUser function is available globally
window.authenticateUser = authenticateUser;