import { getRestaurants } from '../../services/index.js';

// Action Types
export const FETCHING_RESTAURANTS = 'FETCHING_RESTAURANTS';
export const FETCHING_RESTAURANTS_SUCCESS = 'FETCHING_RESTAURANTS_SUCCESS';
export const FETCHING_RESTAURANTS_FAILURE = 'FETCHING_RESTAURANTS_FAILURE';


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
