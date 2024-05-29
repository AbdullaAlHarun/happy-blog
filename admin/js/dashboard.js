(function () {
    // // Function to handle logout
    // function logout() {
    //     // Clear token and API key from localStorage
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('apiKey');
    //     // Redirect to login page
    //     window.location.href = 'login.html';
    // }

    // // Check if user is logged in
    // const token = localStorage.getItem('token');
    // const loginLogoutBtn = document.getElementById('loginLogoutBtn');

    // if (token) {
    //     // User is logged in, change button to Logout
    //     loginLogoutBtn.textContent = 'Logout';
    //     // Set logout functionality
    //     loginLogoutBtn.onclick = logout;
    // } else {
    //     // User is not logged in, redirect to login page
    //     window.location.href = 'login.html';
    // }

    document.addEventListener('DOMContentLoaded', function () {
        // Function to show loader
        function showLoader() {
            const loader = document.getElementById('loader');
            if (loader) {
                loader.style.display = 'block';
            } else {
                console.error('Loader element not found');
            }
        }

        // Function to hide loader
        function hideLoader() {
            const loader = document.getElementById('loader');
            if (loader) {
                loader.style.display = 'none';
            } else {
                console.error('Loader element not found');
            }
        }

        // Function to handle post deletion
        function deletePost(postId) {
            const username = localStorage.getItem('username');
            const apiKey = localStorage.getItem(`apiKey_${username}`);
            const accessToken = localStorage.getItem('token');
            const deleteUrl = `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`;

            if (confirm("Are you sure you want to delete this post?")) {
                // Show loader while the request is in progress
                showLoader();

                fetch(deleteUrl, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'X-Noroff-API-Key': apiKey // Add API key header
                    }
                })
                    .then(response => {
                        if (response.status === 204) {
                            alert('Post deleted successfully.');
                            fetchPosts(); // Fetch and display posts again after deletion
                        } else {
                            throw new Error('Failed to delete post.');
                        }
                    })
                    .catch(error => {
                        console.error('Error deleting post:', error);
                        alert('Failed to delete post. Please try again.');
                    })
                    .finally(() => {
                        // Hide loader when the request is complete
                        hideLoader();
                    });
            }
        }

        // Function to fetch and display posts
        function fetchPosts() {
            const apiKey = localStorage.getItem('apiKey'); // Retrieve API key from localStorage
            fetch('https://v2.api.noroff.dev/blog/posts/happy_blog', {
                headers: {
                    'X-Noroff-API-Key': apiKey // Add API key header
                }
            })
                .then(response => response.json())
                .then(data => {
                    const posts = data.data;
                    const postTable = document.getElementById('postTable');
                    if (!postTable) {
                        console.error('Post table element not found.');
                        return;
                    }
                    postTable.querySelector('tbody').innerHTML = ''; // Clear existing rows

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
                        updateBtn.className = 'update-btn';
                        updateBtn.onclick = () => window.location.href = `update-post.html?id=${post.id}`;
                        actionsCell.appendChild(updateBtn);

                        const deleteBtn = document.createElement('button');
                        deleteBtn.textContent = 'Delete Post';
                        deleteBtn.className = 'delete-btn';
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
        }

        fetchPosts(); // Initial fetch of posts
    });
})();
