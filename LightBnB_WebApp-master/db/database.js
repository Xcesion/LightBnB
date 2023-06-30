const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb'
});

pool.query(`SELECT title FROM properties LIMIT 10;`)
  .then(response => {console.log(response)})


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  const queryString = `SELECT * FROM users 
  WHERE email = $1;`;
  const values = [email];
  return pool.query(queryString, values)
    .then((result) => {
      // console.log("show what's result",result.rows[0]);
      const user = result.rows[0];
      return(user || null);
    })
    .catch((err) => {
      console.log(err.message);
      throw(err);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const queryString = `SELECT * FROM users 
  WHERE id = $1;`;
  const values = [id];
  return pool.query(queryString, values)
    .then((result) => {
      // console.log(result.rows[0]);
      const user = result.rows[0];
      return(user || null);
    })
    .catch((err) => {
      console.log(err.message);
      throw(err);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const queryString = `INSERT INTO users(name, email, password) 
  VALUES ($1, $2, $3) RETURNING *;`;
  const values = [user.name, user.email, user.password];
  return pool.query(queryString, values)
    .then((result) => {
      // console.log(result.rows[0]);
      const newUsers = result.rows[0];
      return newUsers;
    })
    .catch((err) => {
      console.log(err.message);
      throw err;
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  const queryString = `SELECT * FROM reservations WHERE guest_id = $1 LIMIT $2;`;
  const values = [guest_id, limit];
  return pool.query(queryString, values)
    .then((result) => {
      const reservations = result.rows;
      return reservations;
    })
    .catch((err) => {
      console.log(err.message);
      throw err;
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  pool.query(
      `SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
  // const limitedProperties = {};
  // for (let i = 1; i <= limit; i++) {
  //   limitedProperties[i] = properties[i];
  // }
  // return Promise.resolve(limitedProperties);
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
