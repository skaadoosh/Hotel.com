const express = require('express')
const router = express.Router({ mergeParams: true })

const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware')

const Campground = require('../models/campground')
const Review = require('../models/review');

// REVIEW ROUTE

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const { id } = req.params
    const review = new Review(req.body.review)
    const camp = await Campground.findById(id)
    review.author = req.user._id
    camp.reviews.push(review)
    await review.save()
    await camp.save()
    req.flash('success', 'Review added :)')
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:reviewId/delete', isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Review.findByIdAndDelete(reviewId)
    const camp = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    req.flash('success', 'Review deleted!')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;