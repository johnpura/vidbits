const {assert} = require('chai');
const request = require('supertest');
const Video = require('../../models/video');
const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase, buildVideoObject} = require('../test-utils');
const {connectDatabaseAndDropData, disconnectDatabase} = require('../database-utils');

describe('Server path: /videos/create', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(disconnectDatabase);

  describe('POST', () => {
    it('responds with a 201 status code', async () => {
      const videoObj = buildVideoObject();
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoObj);
      assert.equal(response.status , 201);
    });
  });

  describe('POST', () => {
    it('saves a video', async () => {
      const videoObj = buildVideoObject();
      const newVideo = new Video(videoObj);
      await newVideo.save();
      const stored = await Video.findOne({ 'title': 'Train Guy' });
      assert.include(stored, videoObj);
    });
  });

  describe('when the title is missing', () => {
    it('does not save the video', async () => {
      const noTitle = {
        videoUrl: 'https://www.youtube.com/embed/XMknFpZu5AQ',
        description: 'See this reporter watch a full solar eclipse'
      };
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(noTitle);
      const allVideos = await Video.find({});
      assert.equal(allVideos.length, 0);
    });
    it('responds with a 400 status code', async () => {
      const noTitle = {
        videoUrl: 'https://www.youtube.com/embed/XMknFpZu5AQ',
        description: 'See this reporter watch a full solar eclipse'
      };
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(noTitle);
      const allVideos = await Video.find({});
      assert.equal(response.status, 400);
    });
    it('renders the video form', async () => {
      const noTitle = {
        videoUrl: 'https://www.youtube.com/embed/XMknFpZu5AQ',
        description: 'See this reporter watch a full solar eclipse'
      };
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(noTitle);
      const allVideos = await Video.find({});
      assert.include(parseTextFromHTML(response.text, 'form'), 'Title');
    });

    it('renders the validation error message', async () => {
      const noTitle = {
        videoUrl: 'https://www.youtube.com/embed/XMknFpZu5AQ',
        description: 'See this reporter watch a full solar eclipse'
      };
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(noTitle);
      const allVideos = await Video.find({});
      assert.include(parseTextFromHTML(response.text, 'form'), 'Title is required');
    });
    //
    ////TODO: step 24
    //
    it('preserves the other field values', async () => {
      const noTitle = {
        videoUrl: 'https://www.youtube.com/embed/XMknFpZu5AQ',
        description: 'See this reporter watch a full solar eclipse'
      };
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(noTitle);
      const allVideos = await Video.find({});
      assert.include(parseTextFromHTML(response.text, 'form'), 'Title is required');
    });
  });
});
