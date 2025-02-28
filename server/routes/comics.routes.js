const Router = require('express')
const router = new Router()
const ComicsController = require('../controller/comics.controller')

router.post('/createComics', ComicsController.createComics)
router.get('/deleteComics',ComicsController.deleteComics)
router.get('/getAllComics',ComicsController.getAllComics)
router.post('/getAllComicsByUSer', ComicsController.getAllComicsByUSer)
router.post('/getCurrentComics', ComicsController.getCurrentComics)
router.put('/updateComics', ComicsController.updateComics)


module.exports = router