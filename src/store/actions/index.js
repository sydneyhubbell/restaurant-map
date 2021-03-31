// Action Types
export const TEST = 'TEST';


// Action creators

/**
 * A test action
 * @param {string} param the sample parameter
 * @returns {object} action to perform test activity
 */
export function test(param) {
  return {
    type: TEST,
    payload: param
  };
}
