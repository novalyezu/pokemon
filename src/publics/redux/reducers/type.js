const initialState = {
  data: [],
  isLoading: false
};

export default (types = (state = initialState, action) => {
  switch (action.type) {
    case "GET_TYPE_PENDING":
      return {
        ...state,
        isLoading: true
      };

    case "GET_TYPE_REJECTED":
      return {
        ...state,
        isLoading: false
      };

    case "GET_TYPE_FULFILLED":
      return {
        ...state,
        data: action.payload.data,
        isLoading: false
      };

    default:
      return state;
  }
});
