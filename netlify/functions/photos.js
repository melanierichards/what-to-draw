const fetch = require('node-fetch');
require('dotenv').config();

exports.handler = async function (event) {
  const API_KEY = process.env.UNSPLASH_API_KEY,
        photoAPI = `https://api.unsplash.com/photos/random?content_filter=low&client_id=${API_KEY}`,
        paramTopics = event.queryStringParameters.topics,
        paramOrientation = event.queryStringParameters.orientation;

  /* Only add non-null parameter values from user filters to the request.
   * Previously sent "any" values, which the Unsplash API had silently ignored. Summer 2023 it started returning an error instead.
   * Unsplash API will currently accept null values, but stripping those out in case that changes.
   */
  let photoAPIWithParams = photoAPI;
  if (paramTopics) {photoAPIWithParams = photoAPIWithParams + `&topics=${paramTopics}`;}
  if (paramOrientation) {photoAPIWithParams = photoAPIWithParams + `&orientation=${paramOrientation}`;}

  // Fetch a random photo from Unsplash!
  const response = await fetch(photoAPIWithParams),
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