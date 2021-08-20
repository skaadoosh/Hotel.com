const mongoose = require('mongoose');

const Campground = require('../models/campground');
const cities = require('../seeds/cities');
const { descriptors, places } = require('../seeds/seedHelpers');
const { cityData } = require('./in')

mongoose.connect('mongodb+srv://dbUserMain:RQNIQA7HD9coE2nL@cluster0.e61jn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('database connected!');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i <= 200; i++) {
        const random300 = Math.floor(Math.random() * 300);
        const price = Math.floor(Math.random() * 2000 + 1000);
        const lngLat = [`${cityData[random300].lng}`, `${cityData[random300].lat}`]
        let camp = new Campground({
            location: `${cityData[random300].city}, ${cityData[random300].admin_name}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/kksenpai01/image/upload/v1628939807/YelpCamp/wpbc8j8juurhyyyubggh.jpg',
                    filename: 'YelpCamp/g6v4n1wl4dttbfia0ymg'
                },
                {
                    url: 'https://res.cloudinary.com/kksenpai01/image/upload/v1628939300/YelpCamp/x7z5vdmuimurifnompbx.jpg',
                    filename: 'YelpCamp/x7z5vdmuimurifnompbx'
                }
            ],
            geometry: { coordinates: lngLat, type: 'Point' },
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda nesciunt sunt delectus beatae architecto facere incidunt nulla itaque quod voluptatem quis, quasi cumque recusandae at quidem ut molestias veritatis. Magnam?',
            price,
            author: '611012bfca02d12c1cc25b8e'
        });
        await camp.save();
    }
};

seedDB().then(() => {
    console.log('database updated')
    mongoose.connection.close();
});
