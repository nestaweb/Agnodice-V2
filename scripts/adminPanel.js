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

export async function fetchSpecificText(key) {
	try {
	  const response = await axios.get(`${apiUrl}/data/${key}`);
	  const textData = response.data;
	  return textData[key];
	} catch (error) {
	  console.error(`Failed to fetch text for key '${key}' from /api/data`, error);
	  throw error; // Rethrow the error to propagate it up
	}
}

async function fillData() {
	const elements = document.querySelectorAll('.admin__text');
  
	for (const element of elements) {
		
		try {
		  	const key = element.dataset.key;
		  	if (key) {
			  	const text = await fetchSpecificText(key);
		  
		 		// Assuming you want to set the text content of the element

				const titleElement = element.querySelector(".admin__text__title");
		
				const title = text.title;
				titleElement.innerText = title || '';
				console.log(`Updated textarea for key: ${key}`);
				
			  	const textareaElement = element.querySelector("textarea");
		  
				const content = text.content;
				textareaElement.innerText = content || '';
				console.log(`Updated textarea for key: ${key}`);
			}
		} catch (error) {
		  console.error(`Error fetching or updating text`, error);
		}
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
    fillData();
  } catch (error) {
    console.error('Failed to fetch admin data', error);
  }
}

// Function to retrieve the JWT token from local storage
function getJwtToken() {
  return window.localStorage.getItem('jwtToken');
}

async function saveChange() {
	document.querySelectorAll('.admin__text').forEach((element) => {
		const textarea = element.querySelector("textarea");
		const button = element.querySelector("button");
		
		textarea.addEventListener("input", async () => {
			try {
				const text = await fetchSpecificText(element.dataset.key);
				const textareaContent = textarea.value;
				const originalTextContent = text.content ? text.content.trim() : '';
		
				if (textareaContent !== originalTextContent) {
					button.classList.add("admin__button--active");
					button.disabled = false;
				} else {
					button.disabled = true;
					button.classList.remove("admin__button--active");
				}
			} catch (error) {
				console.error('Error fetching text:', error);
			}
		});
			
		button.addEventListener("click", async () => {
			try {
			const key = element.dataset.key;
			const content = textarea.value;
		
			// Send updated content to the backend
			await updateTextOnBackend(key, content);
		
			// Reset button state
			button.classList.remove("admin__button--active");
			button.disabled = true;
		
			console.log(`Updated content for key: ${key}`);
			} catch (error) {
			console.error('Error updating content:', error);
			}
		});
	});
}
	
async function updateTextOnBackend(key, content) {
	try {
		// Send a request to the backend to update the content
		await axios.put(`${apiUrl}/data/${key}`, { content });
	} catch (error) {
		console.error('Error updating content on the backend:', error);
		throw error;
	}
}



// Call fetchData when the script is loaded (you may want to trigger this based on user actions)
fetchData();
saveChange();
