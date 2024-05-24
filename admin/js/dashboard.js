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
    // Function to handle post deletion
    function deletePost(postId) {
        // Get the username (or name) from localStorage
  const username = localStorage.getItem('username'); // Replace 'username' with the key you use to store the username
  
  // Get the access token from localStorage
  const accessToken = localStorage.getItem('accessToken');
  
  // Construct the URL for the DELETE request
  const deleteUrl = `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`;
  
  // Send the DELETE request
  fetch(deleteUrl, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .then(response => {
    // Check if the response status is 204 (No Content)
    if (response.status === 204) {
      // Post deleted successfully
      alert('Post deleted successfully.');
      // Reload the page or fetch new posts
      fetchPosts(); // Implement a function to fetch and display posts again
    } else {
      // Post deletion failed
      throw new Error('Failed to delete post.');
    }
  })
  .catch(error => {
    // Log and alert the error
    console.error('Error deleting post:', error);
    alert('Failed to delete post.');
  });
}

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
                deleteBtn.onclick = () => deletePost(post.id); // Call deletePost function with post ID
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
