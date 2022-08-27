import { Notify } from 'notiflix';
import { APIService } from './js/api-service';
import { getCardMarkup } from './js/templates';
import 'modern-normalize';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const api = new APIService();
let totalHits = 0;
let currentHits = 0;

const showMessage = ({ type = 'info', message = '' }) => {
  Notify[type](message);
};

const clear = () => {
  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
  api.resetPage();
  totalHits = 0;
  currentHits = 0;
};

const renderCards = cards => {
  const markup = cards.map(getCardMarkup).join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
};

const loadMore = async () => {
  const { hits, totalHits } = await api.fetchImages();
  renderCards(hits);
  api.incrementPage();
  return totalHits;
};

const onFormSubmit = async e => {
  e.preventDefault();
  clear();
  api.query = e.currentTarget.elements.searchQuery.value;
  totalHits = await loadMore();

  if (totalHits === 0) {
    showMessage({
      type: 'failure',
      message:
        'Sorry, there are no images matching your search query. Please try again.',
    });
    return;
  }
  showMessage({
    type: 'success',
    message: `Hooray! We found ${totalHits} hits`,
  });
  if (totalHits <= 40) {
    showMessage({
      message: "We're sorry, but you've reached the end of search results.",
    });
    return;
  }
  refs.loadMoreBtn.classList.remove('is-hidden');
  currentHits += api.step;
};

const onButtonClick = async e => {
  await loadMore();

  currentHits += api.step;
  if (currentHits >= totalHits) {
    showMessage({
      message: "We're sorry, but you've reached the end of search results.",
    });
    refs.loadMoreBtn.classList.add('is-hidden');
  }
};

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onButtonClick);
