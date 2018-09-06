const router = require('express').Router();
const Video = require('../models/video');

router.get('/', async (req, res, next) => {
  const videos = await Video.find({});
  res.render('videos/index', {videos});
});

router.get('/videos/create', async (req, res, next) => {
  res.render('videos/create');
});

router.post('/videos', async (req, res, next) => {
  const {title, description} = req.body;
  const newVideo = await Video.create({title, description});
  res.render('/videos/show', {newVideo}, function(err, html) {
    res.status(201).send(`
      <h1>${title}</h1>
      <p>${description}</p>
    `);
  });
});

module.exports = router;
