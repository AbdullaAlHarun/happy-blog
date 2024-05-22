var navBar = document.getElementById("navBar");

function togglebtn() {
    navBar.classList.toggle("hidemenu");
}

document.addEventListener('DOMContentLoaded', () => {
    const postsGrid = document.getElementById('posts-grid');

    fetch('https://v2.api.noroff.dev/blog/posts/happy_blog?limit=12')
        .then(response => response.json())
        .then(data => {
            data.data.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post-thumbnail');
                // Extract the first 80 characters of the post body
                const shortBody = post.body.slice(0, 80);
                // Add "See more" link to the body
                const bodyContent = shortBody.length < post.body.length ?
                `${shortBody}... <a href="blog-post.html?id=${post.id}">See more</a>` :
                    shortBody;
                // Format tags with "#" symbol and make them bold
                const formattedTags = post.tags.map(tag => `<strong>#${tag}</strong>`).join(' ');
                postElement.innerHTML = `
                    <img src="${post.media.url}" alt="${post.media.alt}">
                    <h2>${post.title}</h2>
                    <p>${bodyContent}</p>
                    <p>${formattedTags}</p>
                `;
                postElement.addEventListener('click', () => {
                    // Redirect to blog post page with post ID as query parameter
                    window.location.href = `blog-post.html?id=${post.id}`;
                   
                });
                postsGrid.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            postsGrid.innerHTML = '<p>Failed to load posts.</p>';
        });
});
