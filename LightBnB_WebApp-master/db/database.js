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
const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `WHERE properties.owner_id = $${queryParams.length} `;
  }
  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100); // Convert to cents
    queryParams.push(options.maximum_price_per_night * 100); // Convert to cents
    queryString += `${
      queryParams.length === 1 ? 'WHERE' : 'AND'
    } cost_per_night BETWEEN $${queryParams.length - 1} AND $${queryParams.length} `;
  } else if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100); // Convert to cents
    queryString += `${
      queryParams.length === 1 ? 'WHERE' : 'AND'
    } cost_per_night >= $${queryParams.length} `;
  } else if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100); // Convert to cents
    queryString += `${
      queryParams.length === 1 ? 'WHERE' : 'AND'
    } cost_per_night <= $${queryParams.length} `;
  }

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `${
      queryParams.length === 1 ? 'WHERE' : 'AND'
    } avg(property_reviews.rating) >= $${queryParams.length} `;
  }

  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);
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
