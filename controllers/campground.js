const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

module.exports.renderIndex = catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.newCamp = catchAsync(async (req, res, next) => {
    req.body.campground.location = `${req.body.campground.city}, ${req.body.campground.state}`
    const geoData = await geocoder.forwardGeocode({
        query: `${req.body.campground.location}`,
        limit: 1,
    }).send();

    let camp = new Campground(req.body.campground)

    camp.geometry = geoData.body.features[0].geometry
    camp.images = req.files.map(file => ({ url: file.path, filename: file.filename }))
    camp.author = req.user._id
    await camp.save()

    console.log(camp)
    req.flash('success', 'Campground added!')
    res.redirect(`/campgrounds/${camp._id}`)
})

module.exports.showCamp = catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
            select: ['_id', 'username'],
        }
    }).populate('author');
    if (!camp) {
        req.flash('error', 'Campground not found :(')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { camp });
})

module.exports.renderEditForm = catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', 'Campground not found :(')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { camp });
})

module.exports.editCamp = catchAsync(async (req, res) => {
    const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }))
    const camp = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground })
    camp.images.push(...imgs)
    await camp.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Campground edited!')
    res.redirect(`/campgrounds/${camp._id}`)
})

module.exports.deleteCamp = catchAsync(async (req, res) => {
    await Campground.findByIdAndRemove(req.params.id)
    req.flash('success', 'Campground deleted!')
    res.redirect('/campgrounds')
})