const express = require('express');

const { check } = require('express-validator')

const codesControllers = require('../controllers/codes-controller')


const router = express.Router();

router.get('/:cid', codesControllers.getCodeById);

router.get('/user/:uid', codesControllers.getCodesByUserId);

router.post('/',[
    check('title').not().isEmpty(),
    check('code').isLength({min: 15})
], codesControllers.createCode);

router.patch('/:cid',
    [
        check('title').not().isEmpty(),
        check('code').isLength({min: 15})
    ],
    codesControllers.updateCode);

router.delete('/:cid', codesControllers.deleteCode);


module.exports = router;
