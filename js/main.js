var navBar = document.getElementById("navBar");

function togglebtn() {
    navBar.classList.toggle("hidemenu")
}

document.addEventListener('DOMContentLoaded', () => {
    const postsGrid = document.getElementById('posts-grid');

    fetch('https://v2.api.noroff.dev/blog/posts/happy_blog?limit=12')
        .then(response => response.json())
        .then(data => {
            data.data.forEach(post => {
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
                postsGrid.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            postsGrid.innerHTML = '<p>Failed to load posts.</p>';
        });

     // Fetch the 3 latest posts for the Swiper carousel
     fetch('https://v2.api.noroff.dev/blog/posts/happy_blog?limit=3')
     .then(response => response.json())
     .then(data => {
         const swiperWrapper = document.getElementById('swiper-wrapper');
         const swiperPagination = document.querySelector('.swiper-pagination');
         data.data.forEach(post => {
             const slide = document.createElement('div');
             slide.classList.add('swiper-slide');
             slide.style.backgroundImage = `url('${post.media.url}')`;
             slide.innerHTML = `
                 <div class="slide-content">
                     <h2>${post.title}</h2>
                     <p>${post.body.slice(0, 220)}...</p>
                     <br>
                     <a href="blog-post.html?id=${post.id}" class="read-more-btn">Read More</a>
                 </div>
             `;
             swiperWrapper.appendChild(slide);
         });

         // Initialize Swiper
         const swiper = new Swiper('.swiper-container', {
             loop: true,
             pagination: {
                 el: swiperPagination,
                 clickable: true,
             },
             navigation: {
                 nextEl: '.swiper-button-next',
                 prevEl: '.swiper-button-prev',
             },
             autoplay: {
                delay: 3000, // Delay in milliseconds (4 seconds)
            },
         });
     })
     .catch(error => {
         console.error('Error fetching latest posts for the carousel:', error);
     });
});