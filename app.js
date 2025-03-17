// Configuration
const API_KEY = 'https://api.unsplash.com/photos/random?count=10&client_id=qCKZ5qlYlslLrwUCKkGh0V2O_FkuFOKcJcVLXempqJM';
let currentPage = 1;
let isLoading = false;

// Enhanced Image Fetching with Pagination
const fetchImages = async (page = 1, query = '') => {
    try {
        toggleLoading(true);
        const url = query ? 
            `https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=${API_KEY}` :
            `https://api.unsplash.com/photos?page=${page}&client_id=${API_KEY}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch images');
        const data = await response.json();
        return query ? data.results : data;
    } catch (error) {
        showError(error.message);
        return [];
    } finally {
        toggleLoading(false);
    }
};

// Gallery Item Creation
const createGalleryItem = (image) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
        <img src="${image.urls.regular}" 
             alt="${image.alt_description}" 
             class="gallery-image"
             loading="lazy">
        <div class="image-info">
            <h3>${image.user.name}</h3>
            <p>${image.description || 'No description available'}</p>
            <div class="image-tags">
                ${image.tags?.slice(0, 3).map(tag => `
                    <span class="tag">${tag.title}</span>
                `).join('') || ''}
            </div>
        </div>
    `;
    return item;
};

// Enhanced Search with Debounce
let searchTimeout;
const handleSearch = async (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
        currentPage = 1;
        const images = await fetchImages(1, e.target.value);
        renderGallery(images);
    }, 500);
};

// Infinite Scroll
const handleScroll = async () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading) {
        currentPage++;
        const newImages = await fetchImages(currentPage, document.getElementById('search').value);
        appendGalleryItems(newImages);
    }
};

// Toggle Loading State
const toggleLoading = (state) => {
    isLoading = state;
    document.getElementById('loading').style.display = state ? 'flex' : 'none';
};

// Initialize Gallery
window.addEventListener('DOMContentLoaded', async () => {
    const initialImages = await fetchImages();
    renderGallery(initialImages);

    document.getElementById('search').addEventListener('input', handleSearch);
    window.addEventListener('scroll', handleScroll);

    // Modal Handling
    document.addEventListener('click', (e) => {
        if (e.target.closest('.gallery-item')) {
            const imgSrc = e.target.closest('.gallery-item').querySelector('img').src;
            document.getElementById('modal-image').src = imgSrc;
            document.getElementById('modal').style.display = 'flex';
        }
    });

    document.querySelector('.close-btn').addEventListener('click', () => {
        document.getElementById('modal').style.display = 'none';
    });
});

// Helper Functions
const renderGallery = (images) => {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    appendGalleryItems(images);
};

const appendGalleryItems = (images) => {
    const gallery = document.getElementById('gallery');
    images.forEach(image => {
        gallery.appendChild(createGalleryItem(image));
    });
};

const showError = (message) => {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    document.body.prepend(errorEl);
    setTimeout(() => errorEl.remove(), 3000);
};