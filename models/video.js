const {mongoose} = require('../database');

const Video = mongoose.model(
  'Video',
  mongoose.Schema({
    title: {
      type: String,
      required: 'a Title is required'
    },
    videoUrl: {
      type: String,
      required: 'a URL is required'
    },
    description: {
      type: String
    }
  })
);

module.exports = Video;
