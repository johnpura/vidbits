const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');

const {seedItemToDatabase, parseTextFromHTML} = require('../test-utils');
const {connectDatabaseAndDropData, disconnectDatabase} = require('../database-utils');

describe('Server path: /videos/:id', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(disconnectDatabase);

  describe('GET', () => {
    it('renders a single video', async () => {
      const video = await seedItemToDatabase();
      const videoId = video._id;
      const response = await request(app)
        .get('/videos/' + videoId)
        .send(videoId);
      assert.equal(response.status , 200);
      assert.include(parseTextFromHTML(response.text, '#videos-container'), video.title);
      //assert.include(parseTextFromHTML(response.text, '#video-description'), video.description);
    });
  });
});
