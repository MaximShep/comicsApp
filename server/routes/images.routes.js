const Router = require('express')
const router = new Router()
const ImagesController = require('../controller/images.controller')

router.post('/addImage', ImagesController.addImage)
router.delete('/deleteImage',ImagesController.deleteImage)
router.post('/getAllImagesByUser',ImagesController.getAllImagesByUser)
router.post('/getCurrentImage', ImagesController.getCurrentImage)
router.put('/updateImage', ImagesController.updateImage)


module.exports = router