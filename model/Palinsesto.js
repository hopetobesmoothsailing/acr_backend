const mongoose = require('mongoose');

// Define the schema
const eventDataSchema = new mongoose.Schema({
  _id: String,
  day: String,
  id: String,
  events: [{
    id: String,
    name: String,
    title: String,
    episode_title: String,
    episode: String,
    season: String,
    description: String,
    channel: {
      name: String,
      logo: String,
      logo_svg: String,
      category_path: String,
      palinsesto_url: String,
      palinsesto_name: String,
      date: String,
      hour: String,
      time_interval: String,
      duration: String,
      duration_in_minutes: String,
      duration_small_format: String,
      path_id: String,
      weblink: String,
      has_audio: Boolean,
      audio_uniquename: String,
      image: String,
      images: {
        square: String,
        landscape: String,
        landscape_43_logo: String,
        cover: String
      },
      hex_color: String,
      playlist_id: String
    },
    program: {
      id: String,
      name: String,
      pipe: String,
      category_path: String,
      weblink: String,
      configuratore: String,
      contestual_page: String,
      path_id: String,
      description: String,
      az: Boolean,
      start_date: Date,
      end_date: Date
    },
    downloadable_audio: {
      title: String,
      url: String,
      type: String
    },
    dfp: {
      escaped_name: String,
      escaped_typology_name: String,
      escaped_genre_name: String
    }
  }]
});

// Create the model
module.exports = mongoose.model('Palinsesto', eventDataSchema, 'palinsesto');