const {assert} = require('chai');
const request = require('supertest');
const Video = require('../../models/video');
const app = require('../../app');

const {buildVideoObject, seedVideoToDatabase, parseTextFromHTML, queryHTML} = require('../test-utils');
const {connectDatabaseAndDropData, disconnectDatabase} = require('../database-utils');

describe('Routes:', () => {
  beforeEach(connectDatabaseAndDropData);
  afterEach(disconnectDatabase);

  describe('GET /videos', () => {
    it('renders existing Videos', async () => {
      const video = await seedVideoToDatabase();
      const response = await request(app)
        .get(`/videos`);

      assert.include(parseTextFromHTML(response.text, '.video-title'), video.title);
    });
  });
  describe('GET /videos/show/:id', () => {
    it('renders the Video', async () => {
      const video = await seedVideoToDatabase();
      const response = await request(app)
        .get(`/videos/show/${video._id}`);

      assert.include(parseTextFromHTML(response.text, '.video-title'), video.title);
      assert.include(parseTextFromHTML(response.text, '.video-description'), video.description);
      const iFrame = queryHTML(response.text, 'iframe');
      assert.equal(iFrame.src, video.videoUrl);
    });
  });
  describe('GET /videos/:id/edit', () => {
    it('renders a form for the Video', async () => {
      const video = await seedVideoToDatabase();
      const response = await request(app)
        .get(`/videos/${video._id}/edit`);

      const url = queryHTML(response.text, 'input#videoUrl-input');
      const title = queryHTML(response.text, 'input#title-input');
      assert.equal(url.value, video.videoUrl);
      assert.equal(title.value, video.title);
      assert.include(parseTextFromHTML(response.text, '#description-input'), video.description);
    });
  });
  describe('POST videos/:id/updates', () => {
    it('updates the record', async () => {
      const video = await seedVideoToDatabase();
      const updates = {
        title: 'New Title',
        videoUrl: 'www.newurl.com',
        description: 'New description'
      };
      const response = await request(app)
        .post(`/videos/${video._id}/updates`)
          .type('form')
          .send(updates);
      const updatedVideo = await Video.findById(video._id);
      assert.include(updatedVideo, updates);
    });
    it('redirects to the show page', async () => {
      const video = await seedVideoToDatabase();
      const updates = {
        title: 'New Title',
        videoUrl: 'www.newurl.com',
        description: 'New description'
      };
      const response = await request(app)
        .post(`/videos/${video._id}/updates`)
        .type('form')
        .send(updates);
      assert.equal(response.status, 302);
      assert.equal(response.headers.location, `/videos/show/${video._id}`);
    });
  });
  describe('when the record is invalid', () => {
    it('does not save the record', async () => {
      const video = await seedVideoToDatabase();
      const updates = {
        title: '',
        videoUrl: ''
      };
      const response = await request(app)
        .post(`/videos/${video._id}/updates`)
        .type('form')
        .send(updates);
      const updatedVideo = await Video.findById(video._id);
      assert.equal(updatedVideo.title, video.title);
      assert.equal(updatedVideo.videoUrl, video.videoUrl);
    });
    it('responds with a 400 status code', async () => {
      const video = await seedVideoToDatabase();
      const updates = {
        title: '',
        videoUrl: ''
      };
      const response = await request(app)
        .post(`/videos/${video._id}/updates`)
        .type('form')
        .send(updates);
      assert.equal(response.status , 400);
    });
    it('renders the edit form', async () => {
      const video = await seedVideoToDatabase();
      const updates = {
        title: '',
        videoUrl: video.videoUrl
      };
      const response = await request(app)
        .post(`/videos/${video._id}/updates`)
        .type('form')
        .send(updates);
      const videoUrlInput = queryHTML(response.text, '[name="videoUrl"]');
      assert.equal(videoUrlInput.value, video.videoUrl);
    });
  });
  describe('POST /videos', () => {
    it('responds with a 302 status code', async () => {
      const video = buildVideoObject();
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(video);
      assert.equal(response.status , 302);
    });
    it('redirects to the new Video show page', async () => {
      const video = buildVideoObject();
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(video);
      assert.include(response.headers.location, '/videos/show');
    });
    it('saves a Video', async () => {
      const video = buildVideoObject();
      const newVideo = new Video(video);
      await newVideo.save();
      const stored = await Video.findOne({ 'title': 'Train Guy' });
      assert.include(stored, video);
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
  describe('POST /videos/:id/deletions', () => {
    it('removes the record', async () => {
      const video = await seedVideoToDatabase();
      await request(app).post(`/videos/${video._id}/deletions`);
      const allVideos = await Video.find();
      assert.equal(allVideos.length, 0)
    });
    it('redirects to the landing page', async () => {
      const video = await seedVideoToDatabase();
      const response = await request(app).post(`/videos/${video._id}/deletions`);
      assert.equal(response.headers.location, '/videos');
    });
  });
});
