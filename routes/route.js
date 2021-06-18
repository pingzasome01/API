const router = require('express-promise-router')();
const Controller = require('../controllers/controller')

router.route('/model/:schema')
    .get(Controller.readAllData)
    .post(Controller.createUser)

router.route('/user/readbyid')
    .post(Controller.readUserById)

router.route('/putin/readbytemplate')
    .post(Controller.readPutinByTemplate)

router.route('/model/:schema/:_id')
    // .get(Controller.readDataById)
    .get(Controller.readDataByIdMember)

router.route('/login')
    .post(Controller.userLogin)

router.route('/readbyid2/:schema/:id')
    .get(Controller.readDataById2)

router.route('/readbyuserid/:schema/:_id')
    .get(Controller.readDataByIdMember2)

module.exports = router
