const cors = require('cors');
const express = require('express');
const db = require('./db');

const app = express();
const port = process.env.PORT || 4002;

app.use(express.json());
app.use(cors());

app.get('/', (request, response) => {
    response.send('Welcome to mynearbyplaces serverside. This is the home page of the database.');
});

app.post('/place', (request, response) => {
    let name = request.body.name;
    let location = request.body.location;
    db.savePlace(name, location)
    .then(() => response.send(`The place was added successfully.`))
    .catch(e => {console.log(e); response.status(500).send('There was a problem adding the place.')});
});

app.get('/places', (request, response) => {
    db.getPlaces()
    .then(places => response.json(places))
    .catch(e => {console.log(e); response.status(500).send('There was a problem getting the places.')});
});


app.post('/review/:placeName', (request, response) => {
    let placeName = request.params.placeName;
    //let placeid = request.something;
    let comment = request.body.comment;
    let rating = request.body.rating;
    let customerName = request.body.customerName;
    db.addReview(placeName, comment, rating, customerName)
    .then(() => response.send(`The review was added successfully.`))
    .catch(e => {console.log(e); response.status(500).send('There was a problem adding the place.')});
});


app.get('/search/:placeName?/:location?', (request, response) => {
    let placeName = request.query.placeName;
    let location = request.query.location;
    console.log(`name: ${placeName} - ${typeof(placeName)}`);
    console.log(`location: ${location} - ${typeof(location)}`);
    db.findPlaces(placeName, location)
    .then(places => response.json(places))
    .catch(e => {console.log(e); response.status(500).send('There was a problem finding the place.')});
    
});

app.listen(port, () => console.log('Listening on port ' + port));