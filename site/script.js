document.addEventListener('DOMContentLoaded', function () {

  // Set up vars
  const main = document.getElementById('main'),
        fetchBtn = document.getElementById('fetch-btn'),
        responseContainer = document.getElementById('response-container'),
        responseContent = document.getElementById('response'),
        responseImage = document.getElementById('response-image'),
        responseLink = document.getElementById('response-link'),
        responseAuthor = document.getElementById('response-author'),
        fetchStatus = document.getElementById('fetch-status'),
        referrerString = '?utm_source=what_to_draw&utm_medium=referral';

  /* Convert photo color from API, from hex to RGB
   * Add alpha channel
   * Used to make image background color more subtle in dark theme
   */
  const convertToSubtleColor = function (hex) {
    let r = 0, g = 0, b = 0;

    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
    return "rgb("+ +r + "," + +g + "," + +b + ", 0.3)";
  };

  // Create error message
  const createErrorMsg = function () {
    let errorMsg = document.createElement('div');
    errorMsg.setAttribute('role', 'alert');
    errorMsg.setAttribute('id', 'error-msg');
    errorMsg.innerHTML = '<p>Sorry, something went wrong! Most likely this page has hit its hourly limit for getting new photos. Please try again later.</p>';
    responseContent.innerHTML = '';
    responseContent.appendChild(errorMsg);
  };

  // Set up error state of page
  const setupErrorState = function () {
    fetchBtn.setAttribute('disabled', 'true');
    responseContainer.classList.add('reference-container--shown');
    responseContent.setAttribute('aria-busy', 'false');
  };

  // Handle errors retrieving data from API
  const handleErrors = function (response) {
    if (!response.ok) {
      createErrorMsg();
      setupErrorState();
    }
    return response;
  };

  // Retrieve + display random photo from API
  const fetchPhoto = async function (delay) {
    responseContent.setAttribute('aria-busy', 'true');
    fetchStatus.innerText = 'Getting photo';

    const topicsValue = document.getElementById('topics').value,
        orientationValue = document.getElementById('orientation').value,
        functionWithParams = `/.netlify/functions/photos?topics=${topicsValue}&orientation=${orientationValue}`;
  
    let response = await fetch(functionWithParams).then(handleErrors).then(response => response.json());
    
    if (response) {
        photoColor = JSON.stringify(response.color).replace(/"/g, ''),
        photoColorSubtle = convertToSubtleColor(photoColor),
        jumbleParts = document.querySelectorAll('.jumble *');

    // Give photo "exit" transition time to run
    setTimeout(function () {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        responseImage.style.backgroundColor = photoColorSubtle;
      } else {
        responseImage.style.backgroundColor = photoColor;
      }

      // Descriptions coming back from the API can be patchy
      if (JSON.stringify(response.photoAlt).replace(/"/g, '') !== 'null') {
        responseAltValue = JSON.stringify(response.photoAlt).replace(/"/g, '');
      } else if (JSON.stringify(response.photoDesc).replace(/"/g, '') !== 'null') {
        responseAltValue = JSON.stringify(response.photoDesc).replace(/"/g, '');
      } else {
        responseAltValue = 'No description provided';
      }
      
      // Add values to image + metadata
      responseImage.setAttribute('src', JSON.stringify(response.photoUrl).replace(/"/g, ''));
      responseImage.setAttribute('alt', responseAltValue);
      responseLink.setAttribute('href', JSON.stringify(response.photoPage).replace(/"/g, '') + referrerString);
      responseAuthor.innerText = JSON.stringify(response.authorName).replace(/"/g, '');
      responseAuthor.setAttribute('href', JSON.stringify(response.authorPage).replace(/"/g, '') + referrerString);

      // Give a short mental break after previous photo fades out
      setTimeout(function () {
        responseContainer.classList.add('reference-container--shown');
        responseContent.setAttribute('aria-busy', 'false');
        fetchStatus.innerText = `New photo by ${JSON.stringify(response.authorName).replace(/"/g, '')} loaded`;
        for (let i = 0; i < jumbleParts.length; i++) {
          jumbleParts[i].style.fill = photoColor;
        }
      }, delay);
    }, delay);
    }
  };

  // Show photo on first fetch
  const setupPhotoContainer = function () {
    responseContainer.removeAttribute('hidden');
    fetchPhoto(0);
  };

  setupPhotoContainer();

  // Update photo upon user request
  const updatePhotoContainer = function () {
    responseContainer.classList.remove('reference-container--shown');
    fetchPhoto(300);
  };

  // Fetch new photo on clicking button
  fetchBtn.addEventListener('click', updatePhotoContainer, false);
});