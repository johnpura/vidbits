const {assert} = require('chai');
const request = require('supertest');
const Video = require('../../models/video');
const app = require('../../app');
const {parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, disconnectDatabase} = require('../database-utils');

describe('Server path: /videos', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(disconnectDatabase);

  describe('GET', () => {
    it('renders existing Videos', async () => {
      const video = await seedItemToDatabase();
      const response = await request(app)
        .get('/');
      assert.include(parseTextFromHTML(response.text, '.video-title'), video.title);
    });
  });

  describe('POST', () => {
    it('responds with a 201 status code', async () => {
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send();
      assert.equal(response.status , 201);
    });
  });

  describe('POST', () => {
    it('saves a video', async () => {
      const fields = {
        title: 'Solar Eclipse',
        description: 'See this reporter watch a full solar eclipse'
      };
      const video = new Video(fields);
      await video.save();
      const stored = await Video.findOne({ 'title': 'Solar Eclipse' });
      assert.include(stored, fields);
    });
  });
});
