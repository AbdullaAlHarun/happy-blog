// Function to handle logout
function logout() {
    // Clear token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    window.location.href = 'login.html';
}

// Check if user is logged in
const token = localStorage.getItem('token');
const loginLogoutBtn = document.getElementById('loginLogoutBtn');

if (token) {
    // User is logged in, change button to Logout
    loginLogoutBtn.textContent = 'Logout';
    // Set logout functionality
    loginLogoutBtn.onclick = logout;
} else {
    // User is not logged in, redirect to login page
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function () {
    // Fetch and display the dashboard content here
    fetch('https://v2.api.noroff.dev/blog/posts/happy_blog')
        .then(response => response.json())
        .then(data => {
            const posts = data.data;

            const postTable = document.getElementById('postTable');

            // Populate table with posts
            posts.forEach(post => {
                const tr = document.createElement('tr');

                // Thumbnail
                const thumbnailCell = document.createElement('td');
                const thumbnail = document.createElement('img');
                thumbnail.src = post.media.url;
                thumbnail.alt = post.media.alt;
                thumbnail.className = 'thumbnail';
                thumbnailCell.appendChild(thumbnail);
                tr.appendChild(thumbnailCell);

                // Title
                const titleCell = document.createElement('td');
                titleCell.textContent = post.title;
                tr.appendChild(titleCell);

                // Actions
                const actionsCell = document.createElement('td');
                const updateBtn = document.createElement('button');
                updateBtn.textContent = 'Update Post';
                updateBtn.className = 'update-btn'; // Add class for styling
                updateBtn.onclick = () => updatePost(post.id);
                actionsCell.appendChild(updateBtn);

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete Post';
                deleteBtn.className = 'delete-btn'; // Add class for styling
                deleteBtn.onclick = () => deletePost(post.id);
                actionsCell.appendChild(deleteBtn);

                tr.appendChild(actionsCell);

                // Append row to table body
                postTable.querySelector('tbody').appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
});
