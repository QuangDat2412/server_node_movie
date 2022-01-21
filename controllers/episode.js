const Episode = require('../models/Episode');
const Movie = require('../models/Movie');

const addEpisode = async (req, res) => {
    const newEpisode = new Episode(req.body);

    try {
        const savedEpisode = await newEpisode.save();
        const savedMovie = await Movie.findByIdAndUpdate(req.body.movieId, { $push: { episodes: savedEpisode._id } }, { new: true });
        res.status(200).json({ ...savedEpisode, ...savedMovie });
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
};
const updateEpisode = async (req, res) => {
    try {
        const updatedEpisode = await Episode.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedEpisode);
    } catch (err) {
        res.status(500).json(err);
    }
};
const deleteEpisode = async (req, res) => {
    try {
        await Episode.findByIdAndDelete(req.params.id);
        res.status(200).json('Movie has been deleted...');
    } catch (err) {
        res.status(500).json(err);
    }
};
const deleteEpisodes = async (req, res) => {
    try {
        await Episode.deleteMany({ movieId: req.params.id });
        res.status(200).json('Movie has been deleted...');
    } catch (err) {
        res.status(500).json(err);
    }
};
const getEpisodeByIdMovie = async (req, res) => {
    try {
        const episode = await Episode.findById(req.params.id);
        const { video, ...others } = episode;
        res.status(200).json(video);
    } catch (err) {
        res.status(500).json(err);
    }
};
const getAllEpisode = async (req, res) => {
    try {
        const episodes = await Episode.find();
        res.status(200).json(episodes.reverse());
    } catch (err) {
        res.status(500).json(err);
    }
};
module.exports = {
    addEpisode,
    updateEpisode,
    deleteEpisode,
    deleteEpisodes,
    getEpisodeByIdMovie,
    getAllEpisode,
};
