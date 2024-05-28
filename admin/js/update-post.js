document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const apiKey = localStorage.getItem(`apiKey_${username}`);

    console.log('Token:', token); // Debugging token
    console.log('Username:', username); // Debugging username
    console.log('API Key:', apiKey); // Debugging API Key

    // Check if token, username, or API key is missing in localStorage
    if (!token || !username || !apiKey) {
        console.error('Token, username, or API Key not found in localStorage');
        alert('Unauthorized access. Please log in.');
        window.location.href = 'login.html';
        return;
    }

    const postId = new URLSearchParams(window.location.search).get('id');

    if (!postId) {
        console.error('No post ID provided in URL');
        return;
    }

    // Fetch post details to populate the form
    fetch(`https://v2.api.noroff.dev/blog/posts/${username}/${postId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'X-Noroff-API-Key': apiKey // Include the API key in the headers
        }
    })
    .then(response => {
        if (response.status === 401) {
            throw new Error('Unauthorized');
        }
        return response.json();
    })
    .then(data => {
        const post = data.data;
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postBody').value = post.body;
        document.getElementById('postTags').value = post.tags.join(', ');
        document.getElementById('postImage').value = post.media.url;
        document.getElementById('postAlt').value = post.media.alt;
    })
    .catch(error => {
        console.error('Error fetching post:', error);
        if (error.message === 'Unauthorized') {
            alert('Failed to fetch post. Unauthorized access. Please log in.');
            window.location.href = 'login.html';
        }
    });

    // Handle post update
    document.getElementById('updatePostForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('postTitle').value;
        const body = document.getElementById('postBody').value;
        const tags = document.getElementById('postTags').value.split(',').map(tag => tag.trim());
        const mediaUrl = document.getElementById('postImage').value;
        const mediaAlt = document.getElementById('postAlt').value;

        // Show loader while the request is in progress
        showLoader();

        fetch(`https://v2.api.noroff.dev/blog/posts/${username}/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Noroff-API-Key': apiKey // Include the API key in the headers
            },
            body: JSON.stringify({
                title: title,
                body: body,
                tags: tags,
                media: {
                    url: mediaUrl,
                    alt: mediaAlt
                }
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update post');
            }
            return response.json();
        })
        .then(data => {
            console.log('Post updated:', data);
            alert('Post updated successfully!');
            window.location.href = 'dashboard.html'; // Redirect to dashboard after update
        })
        .catch(error => {
            console.error('Error updating post:', error);
            alert('Failed to update post. Please try again.');
        })
        .finally(() => {
            // Hide loader when the request is complete
            hideLoader();
        });
    });

    // Handle post deletion
    document.getElementById('deletePostBtn').addEventListener('click', function () {
        if (confirm("Are you sure you want to delete this post?")) {
            // Show loader while the request is in progress
            showLoader();

            fetch(`https://v2.api.noroff.dev/blog/posts/${username}/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Noroff-API-Key': apiKey // Include the API key in the headers
                }
            })
            .then(response => {
                if (response.status === 204) {
                    // Post deleted successfully
                    alert('Post deleted successfully!');
                    window.location.href = 'dashboard.html'; // Redirect to dashboard after deletion
                } else {
                    // Failed to delete post
                    throw new Error('Failed to delete post');
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
    });
});

// Define the showLoader and hideLoader functions
function showLoader() {
    // Show your loader element here
    // For example:
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'block';
    } else {
        console.error('Loader element not found');
    }
}

function hideLoader() {
    // Hide your loader element here
    // For example:
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
    } else {
        console.error('Loader element not found');
    }
}
