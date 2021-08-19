const express = require('express')
const router = express.Router()
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')

const { storage } = require('../cloudinary')
const multer = require('multer')
const upload = multer({ storage })

const Campground = require('../controllers/campground')

router.route('/')
    .get(Campground.renderIndex)
    .post(isLoggedIn, upload.array('image'), validateCampground, Campground.newCamp)

router.get('/new', isLoggedIn, Campground.renderNewForm);

router.get('/:id', Campground.showCamp);

router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, Campground.renderEditForm)
    .patch(isLoggedIn, isAuthor, upload.array('image'), validateCampground, Campground.editCamp)

router.delete('/:id/delete', isLoggedIn, isAuthor, Campground.deleteCamp);

module.exports = router;