const fetch = require('node-fetch');
require('dotenv').config();

exports.handler = async function (event) {
  const API_KEY = process.env.UNSPLASH_API_KEY,
        photoAPI = `https://api.unsplash.com/photos/random?content_filter=low&client_id=${API_KEY}`,
        paramTopics = event.queryStringParameters.topics,
        paramOrientation = event.queryStringParameters.orientation,
        photoAPIWithParams = `${photoAPI}&topics=${paramTopics}&orientation=${paramOrientation}`,
        response = await fetch(photoAPIWithParams),
        data = await response.json();

  //console.log(data);
  //console.log(photoAPIWithParams);

  return {
    statusCode: 200,
    body: JSON.stringify({
      photoUrl: data.urls.regular,
      photoAlt: data.alt_description,
      photoDesc: data.description,
      color: data.color,
      photoPage: data.links.html,
      authorName: data.user.name,
      authorPage: data.user.links.html
    })
  }
};