const {jsdom} = require('jsdom');
const Video = require('../models/video');

const buildVideoObject = (options = {}) => {
  const title = options.title || 'Train Guy';
  const videoUrl = options.videoUrl || 'https://www.youtube.com/embed/6lutNECOZFw';
  const description = options.description || 'See the heritage unit';
  return {title, videoUrl, description};
};

const seedVideoToDatabase = async (options = {}) => {
  const video = await Video.create(buildVideoObject(options));
  return video;
};

const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.textContent;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

const queryHTML = (htmlAsString, selector) => {
  return jsdom(htmlAsString).querySelector(selector);
};

module.exports = {
  buildVideoObject,
  seedVideoToDatabase,
  parseTextFromHTML,
  queryHTML
};
