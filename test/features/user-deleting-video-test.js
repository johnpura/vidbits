const {assert} = require('chai');
const {buildVideoObject} = require('../test-utils');


describe('User deleting a video', () => {
  it('removes the Video from the list', () => {
    const video = buildVideoObject();
    browser.url('/videos/create');
    browser.setValue('#title-input', video.title);
    browser.setValue('#videoUrl-input', video.videoUrl);
    browser.setValue('#description-input', video.description);
    browser.click('#submit-button');
    browser.click('#delete');
    //browser.alertAccept();
    assert.notInclude(browser.getText('body'), video.title);
  });
});
