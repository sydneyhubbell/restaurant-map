import { restaurants } from '../data/restaurants';

/**
 * Get the restaurant data
 * @returns {Promise} Promise to return the restaurants
 */
export function getRestaurants() {
  // TODO TEMPORARILY RETURNS LOCAL STORED DATA UNTIL BACKEND IS SETUP
  return Promise.resolve(restaurants);
}
