const Movie = require('../models/Movie');
const Episode = require('../models/Episode');

const newMovie = async (req, res) => {
    const newMovie = new Movie(req.body);
    try {
        const savedMovie = await newMovie.save();
        res.status(200).json(savedMovie);
    } catch (err) {
        res.status(500).json(err);
    }
};
const updateMovie = async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedMovie);
    } catch (err) {
        res.status(500).json(err);
    }
};
const deleteMovie = async (req, res) => {
    try {
        await movie.findByIdAndDelete(req.params.id);
        await Episode.deleteMany({ movieId: req.params.id });
        res.status(200).json('Movie has been deleted...');
    } catch (err) {
        res.status(500).json(err);
    }
};
const findMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json(err);
    }
};
const getAllMovie = async (req, res) => {
    try {
        const movies = await Movie.find().populate('episodes', '_id episode ').sort('-episode').exec();
        res.status(200).json(movies);
    } catch (err) {
        res.status(500).json(err);
    }
};
const filterMovie = async (req, res) => {
    try {
        const movies = await Movie.find();
        const arr = req.params.slug.split('-');
        let newMovies;
        let x;
        const slug = req.params.slug;
        switch (arr[0]) {
            case 'genre':
                newMovies = movies.filter((m) => {
                    const a = m.genre.find((g) => {
                        return 'genre-' + convertSlug(g) === slug;
                    });
                    if (a) {
                        x = a;
                    }
                    return a;
                });
                break;
            case 'country':
                newMovies = movies.filter((m) => {
                    const a = convertSlug(m.country);
                    if ('country-' + a === slug) {
                        x = m.country;
                    }
                    return 'country-' + a === slug;
                });
                break;

            case 'year':
                newMovies = movies.filter((m) => {
                    if ('year-' + m.year === slug) {
                        x = m.year;
                    }
                    return 'year-' + m.year === slug;
                });
                break;
            case 'type':
                switch (slug) {
                    case 'type-phim-bo':
                        newMovies = movies?.filter((m) => m.isSeries);
                        x = 'phim-bo';
                        break;
                    case 'type-phim-le':
                        newMovies = movies?.filter((m) => !m.isSeries);
                        x = 'phim-le';
                        break;
                    default:
                    // code block
                }
                break;
        }
        res.status(200).json({ [x]: newMovies });
    } catch (err) {
        res.status(500).json(err);
    }
};
const search = async (req, res) => {
    try {
        const movies = await Movie.find();
        const arrSlug = convertSlug(req.body.data).toLowerCase().split('-');
        const newMovies = await movies.filter((m) => {
            const a = arrSlug.filter((slug) => {
                return convertSlug(m.title).search(slug) >= 0 || convertSlug(m.titleEng).search(slug) >= 0;
            });
            return a[0];
        });
        res.status(200).json(newMovies);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
const convertSlug = (str) => {
    // remove accents
    var from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ',
        to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy';
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(RegExp(from[i], 'gi'), to[i]);
    }

    str = str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\\-]/g, '-')
        .replace(/-+/g, '-');

    return str;
};
module.exports = {
    newMovie,
    updateMovie,
    deleteMovie,
    findMovie,
    getAllMovie,
    filterMovie,
    search,
};
