const API_URL = 'https://jsonplaceholder.typicode.com/posts';
const loadBtn = document.getElementById('loadBtn');
const searchInput = document.getElementById('searchInput');
const statusText = document.getElementById('status');
const postsContainer = document.getElementById('posts');
let allPosts = [];

// Clear the container and render post cards to the page
function showPosts(posts) {
  postsContainer.innerHTML = '';
  if (posts.length === 0) {
    statusText.textContent = 'No matching posts found.';
    return;
  }
  statusText.textContent = 'Showing ' + posts.length + ' post(s).';

  // Build and insert an article card for each post
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const card = document.createElement('article');
    card.className = 'card';
    const title = document.createElement('h2');
    title.textContent = post.title;
    const body = document.createElement('p');
    body.textContent = post.body;
    card.appendChild(title);
    card.appendChild(body);
    postsContainer.appendChild(card);
  }
}

// Fetch posts from the API and store the first 12
async function loadPosts() {
  loadBtn.disabled = true;
  statusText.textContent = 'Loading posts...';
  try {
    const response = await fetch(API_URL);
    if (response.ok === false) {
      throw new Error('HTTP ' + response.status);
    }
    const posts = await response.json();
    if (Array.isArray(posts) === false) {
      throw new Error('Unexpected API response');
    }
    allPosts = posts.slice(0, 12);
    filterPosts();
  } catch (error) {
    allPosts = [];
    postsContainer.innerHTML = '';
    statusText.textContent = 'Could not load posts: ' + error.message;
  } finally {
    loadBtn.disabled = false;
  }
}

// Filter all posts by matching title text with the search input
function filterPosts() {
  const keyword = searchInput.value.trim().toLowerCase();
  const filtered = [];

  // Add posts whose titles match the search term into the filtered array
  for (let i = 0; i < allPosts.length; i++) {
    const post = allPosts[i];
    const postTitle = post.title.toLowerCase();
    if (postTitle.includes(keyword)) {
      filtered.push(post);
    }
  }
  showPosts(filtered);
}

// Attach user click and search input events
loadBtn.addEventListener('click', loadPosts);
searchInput.addEventListener('input', filterPosts);
