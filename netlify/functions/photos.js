const fetch = require('node-fetch');
require('dotenv').config();

exports.handler = async function () {
  const API_KEY = process.env.UNSPLASH_API_KEY,
        photoAPI = `https://api.unsplash.com/photos/random?content_filter=low&client_id=${API_KEY}`,
        response = await fetch(photoAPI),
        data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify({
      photoUrl: data.urls.regular,
      photoAlt: data.alt_description,
      color: data.color,
      photoPage: data.links.html,
      authorName: data.user.name,
      authorPage: data.user.links.html
    })
  }
};