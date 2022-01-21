const router = require('express').Router();
const movieCtrl = require('../controllers/movie');
const { verifyTokenAndAdmin } = require('../verifyToken');

router.post('/', verifyTokenAndAdmin, movieCtrl.newMovie);
router.put('/:id', verifyTokenAndAdmin, movieCtrl.updateMovie);
router.delete('/:id', verifyTokenAndAdmin, movieCtrl.deleteMovie);
router.get('/find/:id', movieCtrl.findMovie);
router.get('/', movieCtrl.getAllMovie);
router.get('/:slug', movieCtrl.filterMovie);
router.post('/search', movieCtrl.search);

// router.get('/search', async (req, res) => {
//     try {
//         // movie.ensureIndex({ title: 'text', titleEng: 'text', country: 'text', genre: 'text', director: 'text', year: 'text', actor: 'text' });
//         const movies = await movie.find({ slug: { $regex: /hoi/i } });

//         res.status(200).json(movies);
//         console.log(movies);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json(err);
//     }
// });

module.exports = router;
