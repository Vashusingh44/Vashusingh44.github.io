// script.js

document.addEventListener('DOMContentLoaded', () => {
    const messages = document.querySelector('#messages');
    messages.style.display = 'none';
    const submitButton = document.querySelector('#submitButton');
    submitButton.addEventListener('click', submitForm);
});

async function submitForm() {
    const name = document.querySelector('#name').value.trim();
    const feedback = document.querySelector('#feedback').value.trim();
    if (name || feedback) {
        const data = {
            name: name,
            feedback: feedback
        };
        try {
            const response = await fetch('https://feb13-lab6-default-rtdb.firebaseio.com/msg.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Error saving data');
            }
            hideFormFetchDataWithAsyncAwait();
        } catch (error) {
            console.error('Error saving data: ', error.message);
        }
    } else {
        alert('Please fill in the field of course feedback.');
    }
}

function hideForm() {
    const submitForm = document.querySelector('#submitForm');
    const messages = document.querySelector('#messages');

    submitForm.style.display = 'none';
    messages.style.display = 'block';
}

async function hideFormFetchDataWithAsyncAwait() {
    hideForm();
    try {
        const response = await fetch('https://feb13-lab6-default-rtdb.firebaseio.com/msg.json');
        if (!response.ok) {
            throw new Error('Error fetching data');
        }
        const data = await response.json();
        displayMessages(data);
    } catch (error) {
        console.error('Error fetching data: ', error.message);
    }
}

function displayMessages(data) {
    const messagesContainer = document.querySelector('#messages');
    messagesContainer.innerHTML = ''; // Clear previous content

    const messageHeader = document.createElement('h1');
    messageHeader.textContent = 'Messages:';
    messagesContainer.appendChild(messageHeader);

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const message = data[key];
            const messageElement = document.createElement('div');
            messageElement.innerHTML = `<strong>Name:</strong> ${message.name}<br><strong>Message:</strong> ${message.feedback}<br><br>`;
            messagesContainer.appendChild(messageElement);
        }
    }
}
