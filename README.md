# submon-api
node.js backend for Subscription Monitor

Exposes 4 endpoints, auth, users, subscriptions, and subtypes

Users endpoint handles user creation and eventually deletion.
Auth endpoint validates users and provides a json web token (probably needs to have a timer added so it doesn't last forever).
Subtypes endpoint adds and retrieves the subtypes that have been added to the database
Subscriptions endpoint handles all CRUD operations for the logged in user.
