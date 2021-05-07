require('dotenv').config();
const { Pool } = require('pg');

let host = process.env.host;
let database = process.env.database;
let port = process.env.port;
let username = process.env.dbusername;
let password = process.env.password;

let connectionString = 
`postgres://${username}:${password}@${host}:${port}/${database}`;

let connection = {
    connectionString: process.env.DATABASE_URL ? process.env.DATABASE_URL : connectionString,
    ssl : {rejectUnauthorized: false}
};

const pool = new Pool(connection);
/*
let saveAddress = (street, city, state, postalCode) => {
    return pool.query(`insert into nearbyplaces.address(street, city, state, postalcode) values ($1, $2, $3, $4) returning id`, [street, city, state, postalCode])
    .then(result => {console.log('Address was saved'); return result.rows[0].id})
    .catch(e => console.log(e));
}
*/
let savePlace = (name, location) => {
    return pool.query(`insert into nearbyplaces.place(name, location) values ($1, $2)`, [name, location])
    .then(() => console.log('Place was saved'));
}

let saveCustomer = (name, email, password) => {
    return pool.query('insert into imagequiz.customers(name, email, password) values ($1, $2, $3) returning id', [name, email, password])
    .then(result => {console.log('The user was saved'); return result.rows[0].id});
}

let getPlaces = () => {
    let sql = `select p.name, p.location,  
    from nearbyplaces.place p `;
    return pool.query(sql)
    .then(result => result.rows);
}

let findPlaces = (name, location) => {
    let sql = `select p.name, p.location, 
    json_agg(json_build_object('comment', r.comment, 'rating', r.rating, 'customer', c."name")) as reviews 
    from nearbyplaces.place p 
    left join nearbyplaces.review r on p.id = r.placeid 
    left join nearbyplaces.customer c on r.customerid = c.id 
    where 
    (lower(p.name) like lower('${!name ? '%%' : `%${name}%`}')) 
    and (lower(p.location) like lower('${!location ? '%%' : `%${location}%`}')) 
    group by p.name, p.location `;
    console.log(sql);
    return pool.query(sql)
    .then(result => result.rows);
}

let addReview = (placeName, comment, rating, customerName) => {
    return pool.query(`insert into nearbyplaces.review(placeid, comment, rating, customerid) 
    values (
    (select id from nearbyplaces.place
    where name = $1),
    $2, $3, 
    (select id from nearbyplaces.customer
    where name = $4)        
    )`, [placeName, comment, rating, customerName])
    .then(() => {console.log('Review added.'); });
}

module.exports = { savePlace, saveCustomer, getPlaces, findPlaces, addReview };