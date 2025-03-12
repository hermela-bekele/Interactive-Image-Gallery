// Async Image Fetching with Error Handling

const fetchImages = async () => {
    try {
        const response = await fetch('https://api.unsplash.com/photos/random?count=10&client_id=qCKZ5qlYlslLrwUCKkGh0V2O_FkuFOKcJcVLXempqJM');
        if (!response.ok) throw new Error('Failed to fetch images');
        return await response.json();
    } catch (error) {
        showError(error.message);
        return [];
    }
};

// DOM Manipulation

const createGalleryItem = (image) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
        <img src="${image.urls.regular}" alt="${image.alt_description}" class="gallery-image">
        <div class="image-info">
            <h3>${image.user.name}</h3>
            <p>${image.description || 'No description'}</p>
        </div>
        `;
        return item;
};

// Functional Programming

const rederGallery = (images) => {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    images.map(createGalleryItem).forEach(item => gallery.appendChild(item));
};

// Event Handling & Modal

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const images = await fetchImages();
        rederGallery(images);

        document.getElementById('search').addEventListener('input', (e) => {
            const serachTerm = e.target.value.toLowerCase();
            const filtered = images.filter(img => 
                img.user.name.toLowerCase().includes(searchTerm) ||
                (img.description || '').toLowerCase().includes(serachTerm)
            );
            rederGallery(filtered);
        });

        document.querySelectorAllL('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const modal = document.getElementById('modal');
                const modalImg = document.getElementById('modal-image');
                modalImg.src = item.querySelector('img').src;
                modal.style.display = 'flex';
            });
        });
        document.querySelector('.close-btn').addEventListener('click', () => {
            document.getElementById('modal').style.display = 'none';
        });
    } catch (error) {
        showError('Failed to initialize gallery');
    }
});

// Error Handling

const showError = (message) => {
    const errorE1 = document.createElement('div');
    errorE1.className = 'error-message';
    errorE1.textContent = message;
    document.body.prepend(errorE1);
    setTimeout(() => errorE1.remove(), 3000);
};