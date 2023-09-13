
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(searchQuery, page, perPage) {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        key: '39394386-12c3b52eaf972581324ad5a3b',
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: perPage, 
      },
    });

    return { images: response.data.hits, total: response.data.totalHits };
  } catch (error) {
    throw new Error('An error occurred while fetching data.');
  }
}
