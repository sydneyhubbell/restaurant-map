import * as actions from '../actions/index.js';

export default function reducer(state, action) {
  const { payload, type } = action;
  switch (type) {
    case actions.TEST:
     return { ...state };
     default:
      return { ...state};
  }
}
