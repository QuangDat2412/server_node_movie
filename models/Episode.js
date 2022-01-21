const mongoose = require('mongoose');

const EpisodeSchema = new mongoose.Schema(
    {
        movieId: { type: mongoose.Schema.ObjectId, ref: 'Movie' },
        episode: { type: Number, required: true },
        video: { type: Object },
        trailer: { type: String },
        banner: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Episode', EpisodeSchema);
