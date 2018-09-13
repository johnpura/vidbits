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
    it('responds with a 302 status code', async () => {
      const videoObj = buildVideoObject();
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoObj);
      assert.equal(response.status , 302);
    });
    it('redirects to the new Video show page', async () => {
      const videoObj = buildVideoObject();
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoObj);
      assert.include(response.headers.location, '/videos/show');
    });
    it('saves a Video', async () => {
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
    it('renders the Video form', async () => {
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
      assert.include(parseTextFromHTML(response.text, 'form'), 'a Title is required');
    });
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
      assert.include(parseTextFromHTML(response.text, 'form'), 'a Title is required');
    });
  });
  describe('when the URL is missing', () => {
    it('renders the validation error message', async () => {
      const noUrl = {
        title: 'Solar Eclipse',
        description: 'See this reporter watch a full solar eclipse'
      };
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(noUrl);
      const allVideos = await Video.find({});
      assert.include(parseTextFromHTML(response.text, 'form'), 'a URL is required');
    });
    it('preserves the other field values', async () => {
      const noUrl = {
        title: 'Solar Eclipse',
        description: 'See this reporter watch a full solar eclipse'
      };
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(noUrl);
      const allVideos = await Video.find({});
      assert.include(parseTextFromHTML(response.text, 'form'), 'a URL is required');
    });
  });
});
