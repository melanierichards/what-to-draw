document.addEventListener('DOMContentLoaded', () => {

  // Set up vars
  const fetchBtn = document.getElementById('fetch-btn');
  const responseContainer = document.getElementById('response-container');
  const responseImage = document.getElementById('response-image');
  const responseLink = document.getElementById('response-link');
  const responseAuthor = document.getElementById('response-author');

  /* Convert photo color from API, from hex to RGB
   * Add alpha channel
   * Used to make image background color more subtle in dark theme
   */
  function convertToSubtleColor(hex) {
    let r = 0, g = 0, b = 0;

    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
    return "rgb("+ +r + "," + +g + "," + +b + ", 0.3)";
  }

  // Retrieve + display random photo from API
  const fetchPhoto = async function (delay) {
    const response = await fetch('/.netlify/functions/photos').then(response => response.json());
    const photoColor = JSON.stringify(response.color).replace(/"/g, '');
    const photoColorSubtle = convertToSubtleColor(photoColor);
    const jumbleParts = document.querySelectorAll('.jumble *');

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      responseImage.style.backgroundColor = photoColorSubtle;
    } else {
      responseImage.style.backgroundColor = photoColor;
    }
    
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