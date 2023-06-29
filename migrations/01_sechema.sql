DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS property_reviews CASCADE;


-- DROP TABLE IF EXISTS your_table_name_here CASCADE;

CREATE TABLE users 
(id SERIAL PRIMARY KEY NOT NULL, 
name varchar(255) NOT NULL,
email varchar(255) NOT NULL,
password varchar(255));

CREATE TABLE reservations
(id SERIAL PRIMARY KEY NOT NULL,
start_date date NOT NULL, 
end_date date NOT NULL, 
property_id int REFERENCES properties(id) ON DELETE CASCADE,
guest_id INTEGER REFERENCES users(id) ON DELETE CASCADE);

CREATE TABLE property_reviews
(id SERIAL PRIMARY KEY NOT NULL, 
guest_id INTEGER REFERENCES users(id) ON DELETE CASCADE, 
property_id int REFERENCES properties(id) ON DELETE CASCADE, 
reversation_id int REFERENCES reservations(id) ON DELETE CASCADE, 
rating smallint NOT NULL default 0, 
message text);

CREATE TABLE properties
(id SERIAL PRIMARY KEY NOT NULL, 
owner_id int REFERENCES users(id) ON DELETE CASCADE, 
title VARCHAR(255) NOT NULL, description TEXT, 
thumbnail_photo_url VARCHAR(255) NOT NULL,
cover_photo_url VARCHAR(255) NOT NULL,
cost_per_night INTEGER  NOT NULL DEFAULT 0,
parking_spaces INTEGER  NOT NULL DEFAULT 0,
number_of_bathrooms INTEGER  NOT NULL DEFAULT 0,
number_of_bedrooms INTEGER  NOT NULL DEFAULT 0,
country VARCHAR(255) NOT NULL,
street VARCHAR(255) NOT NULL,
city VARCHAR(255) NOT NULL,
province VARCHAR(255) NOT NULL,
post_code VARCHAR(255) NOT NULL,
active BOOLEAN NOT NULL DEFAULT TRUE
);