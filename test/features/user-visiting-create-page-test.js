const {assert} = require('chai');
const {buildVideoObject} = require('../test-utils');

describe('User visits the create page', () => {
  describe('can fill out and submit the form', () => {
    it('to save a video', () => {
      const newVideo = buildVideoObject();
      browser.url('/videos/create');
      browser.setValue('#title-input', newVideo.title);
      browser.setValue('#description-input', newVideo.description);
      browser.click('#submit-button');
      assert.include(browser.getText('body'), newVideo.title);
      assert.include(browser.getText('body'), newVideo.description);
    });
  });
});
