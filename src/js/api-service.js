import axios from 'axios';

const KEY = '29541275-d631332db7b3701d55f9f7fc0';
axios.defaults.baseURL = 'https://pixabay.com/api';

export class APIService {
  constructor() {
    this.page = 1;
    this.query = '';
    this.step = 40;
  }
  async fetchImages() {
    const { data } = await axios.get(
      `/?key=${KEY}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.step}&page=${this.page}`
    );
    return data;
  }
  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
}
