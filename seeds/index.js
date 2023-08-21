const mongoose = require('mongoose');
const axios = require('axios');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true, ova ne mora vekje vo ovaa verzija
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];


async function seedImg() {
    try {
        const resp = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                client_id: '5tFUixNp8epcyBEUyPF9vq3mjhSLM0cPJzBbaTfjsok',
                collections: 1114848,
            },
        })
        return resp.data.urls.small
    } catch (err) {
        console.error(err)
    }
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //YOUR USER ID
            author: "64d6664696f355edf11f7527",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dljsi5rdk/image/upload/v1692039143/YelpCamp/czp6ojimyfetdvxirtj3.jpg',
                    filename: 'YelpCamp/czp6ojimyfetdvxirtj3'
                },
                {
                    url: 'https://res.cloudinary.com/dljsi5rdk/image/upload/v1692039143/YelpCamp/hoe3vsoo2d0tq6lu2lqv.jpg',
                    filename: 'YelpCamp/hoe3vsoo2d0tq6lu2lqv'
                },
                {
                    url: 'https://res.cloudinary.com/dljsi5rdk/image/upload/v1692039144/YelpCamp/shfia6qfzy2gpmmd73fv.jpg',
                    filename: 'YelpCamp/shfia6qfzy2gpmmd73fv'
                }
            ],
        })
        await camp.save();
    }
}




// const seedDB = async () => {
//     await Campground.deleteMany({})
//     for (let i = 0; i < 20; i++) {
//       // setup
//       const placeSeed = Math.floor(Math.random() * places.length)
//       const descriptorsSeed = Math.floor(Math.random() * descriptors.length)
//       const citySeed = Math.floor(Math.random() * cities.length)

//       // seed data into campground
//       const camp = new Campground({
//         imageUrl: await seedImg(),
//         title: `${descriptors[descriptorsSeed]} ${places[placeSeed]}`,
//         location: `${cities[citySeed].city}, ${cities[citySeed].state}`,
//         description:
//           'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis, nihil tempora vel aspernatur quod aliquam illum! Iste impedit odio esse neque veniam molestiae eligendi commodi minus, beatae accusantium, doloribus quo!',
//       })

//       await camp.save()
//     }
//   }

seedDB().then(() => {
    mongoose.connection.close();
})