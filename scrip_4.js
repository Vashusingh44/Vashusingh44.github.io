const databaseUrl = 'https://comp165-default-rtdb.firebaseio.com//chatMsg.json';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('sendButton').addEventListener('click', sendMessage);
    displayAllMessages();
});

async function sendMessage() {
    const usernameInput = document.getElementById('username');
    const messageInput = document.getElementById('message');
    const categoryInput = document.getElementById('category'); // New: select element for category

    const username = usernameInput.value;
    const message = messageInput.value;
    const category = categoryInput.value; // New: get selected category

    if (username || message) {
        const timestamp = new Date();
        const data = { username, message, category, timestamp }; // New: include category in data

        try {
            const response = await fetch(databaseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }
            messageInput.value = '';
            usernameInput.value = '';
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
}

async function displayAllMessages() {
    try {
        const response = await fetch(databaseUrl);
        const data = await response.json();
        const dataContainer = document.getElementById('messages');
        dataContainer.innerHTML = "<h2>Messages</h2>";
        for (const postId in data) {
            const post = data[postId];
            const timestamp = post.timestamp; 
            const time = new Date(timestamp).toLocaleString("en-US", {timeZone: "America/Vancouver"});
            dataContainer.innerHTML += `
            <p>${time}</p>
                <p><u><strong></strong> ${post.username}</u>:
                    <strong></strong> ${post.message} (${post.category})</p><br>
            `;
        } 
        
        const databaseRef = new EventSource(databaseUrl);
        databaseRef.addEventListener('put', async (event) => {
            try {
                const newData = JSON.parse(event.data);
                const messageData = newData.data;
                const time = new Date(messageData.timestamp).toLocaleString("en-US", {timeZone: "America/Vancouver"});
                if (messageData.username || messageData.message) {
                    dataContainer.innerHTML += `
                    <p>${time}</p>
                    <p><u><strong></strong>${messageData.username}</u>:
                            <strong></strong>${messageData.message} (${messageData.category})</p><br>
                    `;
                }
            } catch (error) {
                console.error('Error handling real-time update:', error);
            }
        });
    } catch (error) {
        throw new Error('Error fetching data:', error);
    }
}
