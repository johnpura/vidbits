const {assert} = require('chai');

describe('User visiting the landing page', () => {
  describe('with no existing videos', () => {
    it('shows no videos', () => {
      browser.url('/');
      assert.equal(browser.getText('#videos-container'),'');
    });
  });

  describe('with existing videos', () => {
    it('renders the videos in the list', () => {
      const title = 'Train Guy';
      browser.url('/videos/create');
      browser.setValue('#title-input', title);
      browser.click('#submit-button');
      browser.url('/');
      assert.equal(browser.getText('#videos-container'), title);
    });
  });
  
  describe('can navigate to', () => {
    it('create page', () => {
      browser.url('/');
      browser.click('a[href="/videos/create"]');
      assert.include(browser.getText('body'), 'Save a video');
    });
  });
});
