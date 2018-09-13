const router = require('express').Router();
const Video = require('../models/video');

router.get('/videos', async (req, res, next) => {
  const videos = await Video.find({});
  res.render('videos/index', {videos});
});

router.get('/videos/create', async (req, res, next) => {
  res.render('videos/create');
});

router.post('/videos', async (req, res, next) => {
  const {title, videoUrl, description} = req.body;
  const video = new Video({title, videoUrl, description});
  video.validateSync();
  if(video.errors) {
    res.status(400).render('videos/create', { video:video });
  } else {
    await video.save();
    res.redirect('/videos/show/' + video._id);
  }
});

router.get('/videos/:id', async (req, res, next) => {
  const id = req.params.id;
  const video = await Video.findById(id);
  res.render('videos/show', {video});
});

router.get('/videos/show/:id', async (req, res, next) => {
  const id = req.params.id;
  const video = await Video.findById(id);
  res.render('videos/show', {video});
});

module.exports = router;
