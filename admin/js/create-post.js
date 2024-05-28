document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('createPostForm');

    function showLoader() {
        document.getElementById('loader').style.display = 'block';
    }

    function hideLoader() {
        document.getElementById('loader').style.display = 'none';
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const title = document.getElementById('postTitle').value;
        const body = document.getElementById('postBody').value;
        const tags = document.getElementById('postTags').value.split(',').map(tag => tag.trim());
        const imageUrl = document.getElementById('postImage').value;
        const imageAlt = document.getElementById('postAlt').value;
        const username = localStorage.getItem('username');
        const apiKey = localStorage.getItem(`apiKey_${username}`);
        const token = localStorage.getItem('token');

        showLoader();

        fetch('https://v2.api.noroff.dev/blog/posts/happy_blog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Noroff-API-Key': apiKey
            },
            body: JSON.stringify({
                title: title,
                body: body,
                tags: tags,
                media: {
                    url: imageUrl,
                    alt: imageAlt
                },
                writer: username
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create post');
            }
            return response.json();
        })
        .then(data => {
            console.log('Post created:', data);
            alert('Post created successfully!');
            window.location.href = 'dashboard.html';
        })
        .catch(error => {
            console.error('Error creating post:', error);
            alert('Failed to create post. Please try again.');
        })
        .finally(() => {
            hideLoader();
        });
    });
});