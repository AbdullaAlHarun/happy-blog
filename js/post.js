document.addEventListener('DOMContentLoaded', () => {
    // Get the post ID from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    // Fetch the single post data using the provided API endpoint
    fetch(`https://v2.api.noroff.dev/blog/posts/happy_blog/${postId}`)
        .then(response => response.json())
        .then(data => {
            // Extract post data from the response
            const post = data.data;

            // Update HTML elements to display post information
            document.getElementById('post-title').textContent = post.title;
            document.getElementById('post-author').textContent = `Author: ${post.author.name}`;
            document.getElementById('post-date').textContent = `Published: ${new Date(post.created).toLocaleDateString()}`;
            document.getElementById('post-image').src = post.media.url;
            document.getElementById('post-image').alt = post.media.alt;
            document.getElementById('post-content').innerHTML = post.body;
        })
        .catch(error => {
            console.error('Error fetching post:', error);
            // Display an error message if fetching the post fails
            document.getElementById('post-content').textContent = 'Failed to load post.';
        });

    // Fetch latest posts, excluding the current post
    fetch('https://v2.api.noroff.dev/blog/posts/happy_blog?limit=12')
        .then(response => response.json())
        .then(data => {
            const latestPostsGrid = document.getElementById('latest-posts-grid');
            // Filter out the current post from the latest posts
            const latestPosts = data.data.filter(post => post.id !== postId).slice(0, 3);

            latestPosts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post-thumbnail');
                const shortBody = post.body.slice(0, 80);
                const bodyContent = shortBody.length < post.body.length ?
                    `${shortBody}... <a href="blog-post.html?id=${post.id}">See more</a>` :
                    shortBody;
                const formattedTags = post.tags.map(tag => `<strong>#${tag}</strong>`).join(' ');

                postElement.innerHTML = `
                    <img src="${post.media.url}" alt="${post.media.alt}">
                    <h2>${post.title}</h2>
                    <p>${bodyContent}</p>
                    <p>${formattedTags}</p>
                `;
                postElement.addEventListener('click', () => {
                    window.location.href = `blog-post.html?id=${post.id}`;
                });
                latestPostsGrid.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error('Error fetching latest posts:', error);
            // Display an error message if fetching the latest posts fails
            document.getElementById('latest-posts-grid').textContent = 'Failed to load latest posts.';
        });
});
