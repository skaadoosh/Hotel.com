const express = require('express')
const router = express.Router()
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')

const User = require('../models/user')

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return err;
            req.flash('success', `Yay! Welcome to YelpCamp ${username}`)
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

const authConfig = {
    failureFlash: true,
    failureRedirect: '/login',
}
router.post('/login', passport.authenticate('local', authConfig), (req, res) => {
    req.flash('success', `Welcome back, ${req.body.username} !`)
    const returnTo = req.session.returnTo || '/campgrounds'
    res.redirect(returnTo)
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'Good Bye !')
    res.redirect('/campgrounds')
})

module.exports = router;