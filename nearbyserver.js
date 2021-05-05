const express = require('express');

const app = express();
const port = process.env.PORT || 4002;

app.use(express.json());

let places = [];

app.get('/', (request, response) => {
    response.send('Welcome to mynearbyplaces serverside. This is the home page of the database.');
});

app.post('/place', (request, response) => {
    let name = request.body.name;
    let address = request.body.address;
    let place = {name: name, address: address};
    places.push(place);
    response.send(`The place ${name} was added.`);
});

app.get('/places', (request, response) => {
    response.json(places);
});

/*
app.post('/review/:placeName', (request, response) => {

});
*/
/*
app.get('/search/:placeName/:location', (request, response) => {

});
*/
app.listen(port, () => console.log('Listening on port ' + port));