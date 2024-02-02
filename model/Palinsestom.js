const mongoose = require('mongoose');

const PalinsestoSchema = new mongoose.Schema({
  id: String,
  day: String,
  events: [
    {
      title: String,
      channel: {
        name: String,
        category_path: String,
        palinsesto_url: String,
        palinsesto_name: String
      },
      date: String,
      hour: String,
      time_interval: String,
      duration: String,
      duration_in_minutes: String,
      duration_small_format: String,
      start_date: String,
      end_date: String
    }
  ]
});

module.exports = mongoose.model('Palinsesto', PalinsestoSchema);
