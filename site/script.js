document.addEventListener('DOMContentLoaded', () => {

  // Set up vars
  const fetchBtn = document.getElementById('fetch-btn');
  const responseContainer = document.getElementById('response-container');
  const responseImage = document.getElementById('response-image');
  const responseLink = document.getElementById('response-link');
  const responseAuthor = document.getElementById('response-author');

  // Retrieve random photo from API
  const fetchPhoto = async function (delay) {
    const response = await fetch('/.netlify/functions/photos').then(response => response.json());
    const photoColor = JSON.stringify(response.color).replace(/"/g, '');
    const jumbleParts = document.querySelectorAll('.jumble *');
    responseImage.style.backgroundColor = photoColor;
    responseImage.setAttribute('src', JSON.stringify(response.photoUrl).replace(/"/g, ''));
    responseImage.setAttribute('alt', JSON.stringify(response.photoAlt).replace(/"/g, ''));
    responseLink.setAttribute('href', JSON.stringify(response.photoPage).replace(/"/g, ''));
    responseAuthor.innerText = JSON.stringify(response.authorName).replace(/"/g, '');
    responseAuthor.setAttribute('href', JSON.stringify(response.authorPage).replace(/"/g, ''));
    setTimeout(() => {
      responseContainer.classList.add('reference-container--shown');
      for (let i = 0; i < jumbleParts.length; i++) {
        jumbleParts[i].style.fill = photoColor;
      }
    }, delay);
  };

  // Show photo on first fetch
  const setupPhotoContainer = function () {
    responseContainer.removeAttribute('hidden');
    fetchPhoto(0);
  }

  setupPhotoContainer();

  // Update photo upon user request
  const updatePhotoContainer = function () {
    responseContainer.classList.remove('reference-container--shown');
    fetchPhoto(500);
  };

  // Fetch new photo on clicking button
  fetchBtn.addEventListener('click', updatePhotoContainer, false);
});