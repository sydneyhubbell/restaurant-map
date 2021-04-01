import * as actions from '../actions/index.js';

export default function reducer(state, action) {
  const { payload, type } = action;
  switch (type) {
    case actions.FETCHING_RESTAURANTS:
     return { ...state };
    case actions.FETCHING_RESTAURANTS_SUCCESS:
      return {
        ...state,
        restaurants: payload
      };
    case actions.FETCHING_RESTAURANTS_FAILURE:
      return { ...state };
    case actions.ADD_RESTAURANT:
      const nextId = state.restaurants.length;
      return {
        ...state,
        restaurants: [
          ...state.restaurants,
          {
            id: nextId,
            ...payload
          }
        ]
      };
    case actions.UPDATE_RESTAURANT:
      return {
        ...state,
        restaurants: [
          ...state.restaurants.slice(0, payload.id),
          { ...payload },
          ...state.restaurants.slice(payload.id + 1)
        ]
      };
    case actions.DELETE_RESTAURANT:
      return {
        ...state,
        restaurants: [
          ...state.restaurants.slice(0, payload),
          ...state.restaurants.slice(payload + 1)
        ]
      };
     default:
      return { ...state};
  }
}
