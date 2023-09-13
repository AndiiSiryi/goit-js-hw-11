
import Notiflix from 'notiflix';
import { fetchImages } from './api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');

let currentPage = 1; 
const perPage = 40; 
let totalHits = 0; 
let currentQuery = ''; 

const lightbox = new SimpleLightbox('.photo-card a');

async function loadImagesAndRender(searchQuery, page = 1) {
  try {
    const { images, total } = await fetchImages(searchQuery, page, perPage);

    if (images.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    totalHits = total; 
    renderGallery(images);
    lightbox.refresh();

    if (page === 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    Notiflix.Notify.failure('An error occurred while fetching data. Please try again later.');
  }
}

function renderGallery(images) {
  let galleryHTML = '';

  images.forEach((image) => {
    galleryHTML += `
      <div class="photo-card">
        <a href="${image.largeImageURL}" data-lightbox="image">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${image.likes}</p>
          <p class="info-item"><b>Views:</b> ${image.views}</p>
          <p class="info-item"><b>Comments:</b> ${image.comments}</p>
          <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
        </div>
      </div>
    `;
  });

  gallery.innerHTML += galleryHTML;
}

async function loadMoreImages() {
  currentPage += 1; 
  loadImagesAndRender(currentQuery, currentPage);
}


window.addEventListener('DOMContentLoaded', () => {});


searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  currentPage = 1; 
  gallery.innerHTML = ''; 
  currentQuery = searchForm.searchQuery.value.trim();
  
  if (currentQuery === "") {
    Notiflix.Notify.failure("Please enter a valid search query.");
    return;
  }
  
  loadImagesAndRender(currentQuery);
});


window.addEventListener('scroll', () => {
  const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 200 && currentPage * perPage < totalHits) {
    loadMoreImages();
  }
});

Notiflix.Notify.init({
width: '300px',
position: 'right-bottom',
    closeButton: false,
    fontSize: "18px",
    fontFamily: "DS Goose",
     
});

