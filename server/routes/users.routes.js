const Router = require('express')
const router = new Router()
const UsersController = require('../controller/users.controller')

router.post('/createUser', UsersController.createUser)
router.post('/getUser', UsersController.getUser)
router.post('/getUserName',UsersController.getUserName)
router.delete('/deleteUser', UsersController.deleteUser)


module.exports = router

