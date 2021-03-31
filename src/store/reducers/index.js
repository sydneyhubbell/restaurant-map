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
     default:
      return { ...state};
  }
}
