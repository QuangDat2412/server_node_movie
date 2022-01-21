const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const MovieSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        titleEng: { type: String },
        imgTitle: { type: String },
        imgBanner: { type: String },
        desc: { type: String },
        trending: { type: Number },
        year: { type: String },
        genre: { type: Array },
        country: { type: String },
        director: { type: Array },
        actor: { type: Array },
        episodes: [{ type: mongoose.Schema.ObjectId, ref: 'Episode' }],
        movieLength: { type: Number, default: 1 },
        isSeries: { type: Boolean, default: false },
        isVip: { type: Boolean, default: false },
        slug: { type: String, slug: 'title', unique: true },
    },
    { timestamps: true }
);

mongoose.plugin(slug);

module.exports = mongoose.model('Movie', MovieSchema);
