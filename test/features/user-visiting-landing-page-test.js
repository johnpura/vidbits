const {assert} = require('chai');
const {buildVideoObject} = require('../test-utils');


describe('User visiting the landing page', () => {
  it('can navigate to add a video', () => {
    browser.url('/');
    browser.click('a[href="/videos/create"]');
    assert.include(browser.getText('body'), 'Save a video');
  });
});
describe('with no existing videos', () => {
  it('shows no videos', () => {
    browser.url('/');
    assert.equal(browser.getText('#videos-container'),'');
  });
});
describe('with an existing videos', () => {
  it('renders it in the list', () => {
    const videoObj = buildVideoObject();
    browser.url('/videos/create');
    browser.setValue('#title-input', videoObj.title);
    browser.setValue('#videoUrl-input', videoObj.videoUrl);
    browser.setValue('#description-input', videoObj.description);
    browser.click('#submit-button');
    assert.include(browser.getText('body'), videoObj.title);
    assert.include(browser.getAttribute('iframe', 'src'), videoObj.videoUrl);
  });
  it('can navigate to a video', () => {
    const videoObj = buildVideoObject();
    browser.url('/videos/create');
    browser.setValue('#title-input', videoObj.title);
    browser.setValue('#videoUrl-input', videoObj.videoUrl);
    browser.setValue('#description-input', videoObj.description);
    browser.click('#submit-button');
    browser.url('/videos');
    browser.click('.video-title a');
    assert.include(browser.getText('body'), videoObj.title);
  });
});
