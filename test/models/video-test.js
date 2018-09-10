const Video = require('../../models/video');
const {assert} = require('chai');
const {mongoose, databaseUrl, options} = require('../../database');

const {connectDatabaseAndDropData, disconnectDatabase} = require('../database-utils');

describe('Model: Video', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(disconnectDatabase);

  describe('#title', () => {
    it('is a String', () => {
      const titleAsInt = 1;
      const video = new Video({title: titleAsInt});
      assert.strictEqual(video.title, titleAsInt.toString());
    });
    /*
    it('is required', () => {
      const video = new Video({});
      video.validateSync();
      assert.equal(video.errors.title.message, 'Path `title` is required.');
    });
    */
  });

  describe('#videoUrl', () => {
    it('is a String', () => {
      const videoUrlAsInt = 1;
      const video = new Video({videoUrl: videoUrlAsInt});
      assert.strictEqual(video.videoUrl, videoUrlAsInt.toString());
    });
    /*
    it('is required', () => {

    });
    */
  });

  describe('#description', () => {
    it('is a String', () => {
      const descriptionAsNonString = 1;
      const video = new Video({description: descriptionAsNonString});
      assert.strictEqual(video.description, descriptionAsNonString.toString());
    });
    /*
    it('is required', () => {
      const video = new Video({});
      video.validateSync();
      assert.equal(video.errors.description.message, 'Path `description` is required.');
    });
    */
  });
});
