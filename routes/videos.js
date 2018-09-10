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
  if(!video.title) {
    res.status(400).render('videos/create', { video:video, error:'Title is required' });
  } else {

    await video.save();
    res.render('videos/show', {video}, function() {
      res.status(201).send();
    });
  }
});

router.get('/videos/:id', async (req, res, next) => {
  const id = req.params.videoId;
  const video = await Video.findById(id);
  res.render('videos/show', {video});
});

module.exports = router;
