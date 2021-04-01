import { getRestaurants } from '../../services/index.js';

// Action Types
export const FETCHING_RESTAURANTS = 'FETCHING_RESTAURANTS';
export const FETCHING_RESTAURANTS_SUCCESS = 'FETCHING_RESTAURANTS_SUCCESS';
export const FETCHING_RESTAURANTS_FAILURE = 'FETCHING_RESTAURANTS_FAILURE';

export const ADD_RESTAURANT = 'ADD_RESTAURANT';
export const UPDATE_RESTAURANT = 'UPDATE_RESTAURANT';
export const DELETE_RESTAURANT = 'DELETE_RESTAURANT';


// Action creators

/**
 * An action to fetch the restaurants
 * @returns {Promise} The promise to fetch restaurant data
 */
export function fetchRestaurants() {
  return (dispatch) => {
    dispatch({ type: FETCHING_RESTAURANTS });

    return getRestaurants()
      .then((restaurants) => {
        dispatch({ type: FETCHING_RESTAURANTS_SUCCESS, payload: restaurants });
      })
      .catch((error) => {
        dispatch({ type: FETCHING_RESTAURANTS_FAILURE, payload: error });
      });
  };
}

/**
 * An action to add a new restaurant to the restaurants list
 * @param {object} restaurant the restaurant to add
 * @returns {object} The action item
 */
export function addRestaurant(restaurant) {
  return {
    type: ADD_RESTAURANT,
    payload: restaurant
  };
}

/**
 * An action to update an existing restaurant in the restaurants list
 * @param {object} restaurant the restaurant to update
 * @returns {object} The action item
 */
export function updateRestaurant(restaurant) {
  return {
    type: UPDATE_RESTAURANT,
    payload: restaurant
  };
}

/**
 * An action to delete a restaurant from the restaurants list
 * @param {number} id the id of the restaurant to delete
 * @returns {object} The action item
 */
export function deleteRestaurant(id) {
  return {
    type: DELETE_RESTAURANT,
    payload: id
  };
}
