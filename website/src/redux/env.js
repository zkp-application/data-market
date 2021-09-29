// types
const UPDATE = 'env/UPDATE_ENV';
// reducers
const defaultEnv = {
  address: '',
};
const reducers = {
  env(state = defaultEnv, action = {}) {
    switch (action.type) {
      case UPDATE:
        return {
          ...state,
          ...action.payload,
        };
      default:
        return state;
    }
  },
};

// action creators
const actions = {
  update: (obj) => (dispatch) => {
    dispatch({
      type: UPDATE,
      payload: obj,
    });
  },
};

export default reducers;
export { actions };
