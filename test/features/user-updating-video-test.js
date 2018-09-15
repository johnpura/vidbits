const {assert} = require('chai');
const {buildVideoObject} = require('../test-utils');


describe('User updating Video', () => {
  it('changes the values', () => {
    const video = buildVideoObject();
    const newTitle = 'Excited Train Guy';
    browser.url('/videos/create');
    browser.setValue('#title-input', video.title);
    browser.setValue('#videoUrl-input', video.videoUrl);
    browser.setValue('#description-input', video.description);
    browser.click('#submit-button');
    browser.click('#edit');
    browser.setValue('#title-input', newTitle);
    browser.click('#submit-button');
    assert.include(browser.getText('body'), newTitle);
  });
  it('does not create an additional video', () => {
    const video = buildVideoObject();
    const newTitle = 'Excited Train Guy';
    browser.url('/videos/create');
    browser.setValue('#title-input', video.title);
    browser.setValue('#videoUrl-input', video.videoUrl);
    browser.setValue('#description-input', video.description);
    browser.click('#submit-button');
    browser.click('#edit');
    browser.setValue('#title-input', newTitle);
    browser.click('#submit-button');
    browser.url('/videos');
    assert.notEqual(browser.getText('.video-title'), video.title);
  });
});
