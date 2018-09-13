const {assert} = require('chai');
const request = require('supertest');
const Video = require('../../models/video');
const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, disconnectDatabase} = require('../database-utils');

describe('', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(disconnectDatabase);

  describe('GET /videos', () => {
    it('renders existing Videos', async () => {
      const video = await seedItemToDatabase();
      const response = await request(app)
        .get(`/videos`);
      assert.include(parseTextFromHTML(response.text, '.video-title'), video.title);
    });
  });
});
