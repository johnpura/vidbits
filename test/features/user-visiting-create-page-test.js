const {assert} = require('chai');
const {buildVideoObject} = require('../test-utils');

describe('', () => {
  describe('User visiting the create page', () => {
    it('can save a video', () => {
      const newVideo = buildVideoObject();
      browser.url('/videos/create');
      browser.setValue('#title-input', newVideo.title);
      browser.setValue('#videoUrl-input', newVideo.videoUrl);
      browser.setValue('#description-input', newVideo.description);
      browser.click('#submit-button');
      assert.include(browser.getText('body'), newVideo.title);
    });
  });
});
