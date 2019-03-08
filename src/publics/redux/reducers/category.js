const initialState = {
  data: [],
  isLoading: false
};

export default (categories = (state = initialState, action) => {
  switch (action.type) {
    case "GET_CATEGORY_PENDING":
      return {
        ...state,
        isLoading: true
      };

    case "GET_CATEGORY_REJECTED":
      return {
        ...state,
        isLoading: false
      };

    case "GET_CATEGORY_FULFILLED":
      return {
        ...state,
        data: action.payload.data,
        isLoading: false
      };

    default:
      return state;
  }
});
