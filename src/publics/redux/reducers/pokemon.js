const initialState = {
  data: [],
  isLoading: false,
  detail: [],
  search: []
};

export default (pokemons = (state = initialState, action) => {
  switch (action.type) {
    case "GET_POKEMONS_PENDING":
      return {
        ...state,
        isLoading: true
      };

    case "GET_POKEMONS_REJECTED":
      return {
        ...state,
        isLoading: false
      };

    case "GET_POKEMONS_FULFILLED":
      return {
        ...state,
        data: action.payload.data,
        isLoading: false
      };

    case "GET_POKEMON_FILTER_PENDING":
      return {
        ...state,
        isLoading: true
      };

    case "GET_POKEMON_FILTER_REJECTED":
      return {
        ...state,
        isLoading: false
      };

    case "GET_POKEMON_FILTER_FULFILLED":
      return {
        ...state,
        data: action.payload.data,
        isLoading: false
      };

    case "MORE_POKEMON_PENDING":
      return {
        ...state,
        isLoading: true
      };

    case "MORE_POKEMON_REJECTED":
      return {
        ...state,
        isLoading: false
      };

    case "MORE_POKEMON_FULFILLED":
      let newData = {
        data: [...state.data.data, ...action.payload.data.data],
        lastPage: action.payload.data.lastPage,
        page: action.payload.data.page,
        perPage: action.payload.data.perPage,
        total: action.payload.data.total
      };
      return {
        ...state,
        data: newData,
        isLoading: false
      };

    case "MORE_POKEMON_FILTER_PENDING":
      return {
        ...state,
        isLoading: true
      };

    case "MORE_POKEMON_FILTER_REJECTED":
      return {
        ...state,
        isLoading: false
      };

    case "MORE_POKEMON_FILTER_FULFILLED":
      let newDataFilter = {
        data: [...state.data.data, ...action.payload.data.data],
        lastPage: action.payload.data.lastPage,
        page: action.payload.data.page,
        perPage: action.payload.data.perPage,
        total: action.payload.data.total
      };
      return {
        ...state,
        data: newDataFilter,
        isLoading: false
      };

    case "SEARCH_POKEMON_PENDING":
      return {
        ...state,
        isLoading: true
      };

    case "SEARCH_POKEMON_REJECTED":
      return {
        ...state,
        isLoading: false
      };

    case "SEARCH_POKEMON_FULFILLED":
      return {
        ...state,
        search: action.payload.data,
        isLoading: false
      };

    case "GET_POKEMON_PENDING":
      return {
        ...state,
        isLoading: true
      };

    case "GET_POKEMON_REJECTED":
      return {
        ...state,
        isLoading: false
      };

    case "GET_POKEMON_FULFILLED":
      return {
        ...state,
        detail: action.payload.data,
        isLoading: false
      };

    case "STORE_POKEMON_PENDING":
      return {
        ...state,
        isLoading: true
      };

    case "STORE_POKEMON_REJECTED":
      return {
        ...state,
        isLoading: false
      };

    case "STORE_POKEMON_FULFILLED":
      state.data.data.push(action.payload.data);
      state.data.data.total = state.data.data.total + 1;
      return {
        ...state,
        data: state.data,
        isLoading: false
      };

    case "UPDATE_POKEMON_PENDING":
      return {
        ...state,
        isLoading: true
      };

    case "UPDATE_POKEMON_REJECTED":
      return {
        ...state,
        isLoading: false
      };

    case "UPDATE_POKEMON_FULFILLED":
      let findUpdate = state.data.data.find(obj => {
        return obj.id === action.payload.data.id;
      });
      Object.assign(findUpdate, {
        name: action.payload.data.name,
        image_url: action.payload.data.image_url,
        type_id: action.payload.data.type_id,
        category_id: action.payload.data.category_id,
        latitude: action.payload.data.latitude,
        longitude: action.payload.data.longitude
      });
      return {
        ...state,
        data: state.data,
        detail: action.payload.data,
        isLoading: false
      };

    case "DELETE_POKEMON_PENDING":
      return {
        ...state,
        isLoading: true
      };

    case "DELETE_POKEMON_REJECTED":
      return {
        ...state,
        isLoading: false
      };

    case "DELETE_POKEMON_FULFILLED":
      const index = state.data.data.findIndex(
        obj => parseInt(obj.id) === parseInt(action.payload.data.id)
      );
      if (index !== -1) state.data.data.splice(index, 1);
      return {
        ...state,
        data: state.data,
        isLoading: false
      };

    default:
      return state;
  }
});
