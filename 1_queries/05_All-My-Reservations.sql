SELECT reservations.id as id, properties.title as title, properties.cost_per_night as cost_per_night, 
reservations.start_date as start_date, AVG(property_reviews.rating) as average_rating
FROM reservations
JOIN properties ON reservations.property_id = properties.id
JOIN property_reviews ON property_reviews.property_id = properties.id
WHERE reservations.guest_id = 1
GROUP BY properties.id, reservations.id
ORDER BY reservations.start_date 
LIMIT 10;