const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');

const {seedItemToDatabase, parseTextFromHTML} = require('../test-utils');
const {connectDatabaseAndDropData, disconnectDatabase} = require('../database-utils');

describe('', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(disconnectDatabase);

  describe('GET /videos/:id', () => {
    it('renders the Video', async () => {
      const video = await seedItemToDatabase();
      const videoId = video._id;
      const response = await request(app)
        .get('/videos/' + videoId)
        .send(videoId);
      assert.equal(response.status , 200);
      assert.include(parseTextFromHTML(response.text, '#videos-container'), video.title);
      //assert.include(browser.getAttribute('iframe', 'src'), videoObj.videoUrl);
    });
  });
});
