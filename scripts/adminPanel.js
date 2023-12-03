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
	console.log(token);
  
	if (!token) {
	  console.error('No JWT token found');
	  // Redirect to login only if there is no token
	  window.location.href = '/login';
	  return;
	}
  
	try {
	  const response = await axios.get(`${apiUrl}/admin`, {
		headers: {
		  Authorization: `${token}`,
		},
	  });
  
	  console.log('Admin data:', response.data);
	  fillData(response.data); // Assuming fillData takes the fetched data as an argument
	} catch (error) {
	  console.error('Failed to fetch admin data', error);
  
	  if (error.response) {
		console.error('Response data:', error.response.data);
		console.error('Response status:', error.response.status);
	  }
  
	  // Redirect to login in case of an error (invalid token, unauthorized, etc.)
	  window.location.href = '/login';
	}
  }
  

// Function to retrieve the JWT token from local storage
function getJwtToken() {
  return window.localStorage.getItem('jwtToken');
}

function uploadImageButton() {
	const imagesSection = document.querySelectorAll('.admin__image');

	imagesSection.forEach(element => {
		element.querySelector(".uploadImage").addEventListener("click", () => {
			element.querySelector(".imageInput").click();
		});
	});
}

// Function to handle text updates
async function handleTextUpdate(element) {
	const textarea = element.querySelector("textarea");
	const button = element.querySelector("button.admin__text__saveButton");
  
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
  }

  // Function to handle image upload
// Function to handle image upload
function uploadImage(key, file, imageIndex, path) {
	
	// Extract the current image path from the corresponding img tag
	const formData = new FormData();
  
	formData.append('image', file);
  
	const button = document.querySelector(`button.admin__button[data-image="${imageIndex}"]`);
	if (button.disabled) {
	  return;
	}
  
	button.disabled = true;
  
	axios.post(`${apiUrl}/upload?path=${path}`, formData)
	  .then((response) => {
		// Handle the response if needed
	  })
	  .catch((error) => {
		alert(`Error uploading image ${error}`);
	  })
	  .finally(() => {
		// Re-enable the button after the request is complete
		button.disabled = true;
	  });
  }  
  
  function handleImageUpdate(element) {
	const input = element.querySelector('input');
	const button = element.querySelector('button.admin__button');
	const img = element.querySelector('img');
	const path = img.src.split('/').slice(-1);
  
	input.addEventListener('change', () => {
	  const file = input.files[0];
	  if (file) {
		img.src = URL.createObjectURL(file);
		button.disabled = false;
		button.classList.add('admin__button--active');
	  }
	});
  
	button.addEventListener('click', async () => {
	  const key = element.dataset.key;
	  const file = input.files[0];
  
	  if (file) {
		try {
			const imageIndex = button.dataset.image; // Assuming you have a data-image attribute
		  await uploadImage(key, file, imageIndex, path);
		  button.disabled = true;
		  button.classList.remove('admin__button--active');
		} catch (error) {
		  console.error('Error uploading image:', error);
		}
	  }
	});
  }

async function saveChange() {
	document.querySelectorAll('.admin__text').forEach(handleTextUpdate);
	document.querySelectorAll('.admin__image').forEach(handleImageUpdate);
  }

// frontend/scripts/adminPanel.js
  

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
uploadImageButton();