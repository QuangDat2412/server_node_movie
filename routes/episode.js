const router = require('express').Router();
const episodeCtrl = require('../controllers/episode');
const { verifyTokenAndAdmin } = require('../verifyToken');

router.post('/', verifyTokenAndAdmin, episodeCtrl.addEpisode);
router.put('/:id', verifyTokenAndAdmin, episodeCtrl.updateEpisode);
router.delete('/:id', verifyTokenAndAdmin, episodeCtrl.deleteEpisode);
router.delete('/movie/:id', verifyTokenAndAdmin, episodeCtrl.deleteEpisodes);
router.get('/episode/:id', episodeCtrl.getEpisodeByIdMovie);
router.get('/', episodeCtrl.getAllEpisode);

module.exports = router;
