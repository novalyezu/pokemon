import { AsyncStorage } from "react-native";

const initialState = {
  data: [],
  access_token: [],
  isLoading: false,
  isAuth: false
};

export default (auth = (state = initialState, action) => {
  switch (action.type) {
    case "GET_USER_PENDING":
      return Object.assign({}, state, {
        isLoading: true
      });

    case "GET_USER_REJECTED":
      return Object.assign({}, state, {
        isLoading: false,
        isAuth: false
      });

    case "GET_USER_FULFILLED":
      return Object.assign({}, state, {
        data: action.payload.data,
        isLoading: false,
        isAuth: true
      });

    case "LOGIN_PENDING":
      return Object.assign({}, state, {
        isLoading: true
      });

    case "LOGIN_REJECTED":
      return Object.assign({}, state, {
        isLoading: false,
        isAuth: false
      });

    case "LOGIN_FULFILLED":
      AsyncStorage.setItem("token", action.payload.data.access_token.token);
      AsyncStorage.setItem(
        "refreshToken",
        action.payload.data.access_token.refreshToken
      );
      return Object.assign({}, state, {
        access_token: action.payload.data.access_token,
        isLoading: false,
        isAuth: true
      });

    case "REGISTER_PENDING":
      return Object.assign({}, state, {
        isLoading: true
      });

    case "REGISTER_REJECTED":
      return Object.assign({}, state, {
        isLoading: false,
        isAuth: false
      });

    case "REGISTER_FULFILLED":
      return Object.assign({}, state, {
        data: action.payload.data,
        access_token: action.payload.data.access_token,
        isLoading: false,
        isAuth: true
      });

    case "REFRESH_TOKEN_PENDING":
      return Object.assign({}, state, {
        isLoading: true
      });

    case "REFRESH_TOKEN_REJECTED":
      return Object.assign({}, state, {
        isLoading: false,
        isAuth: false
      });

    case "REFRESH_TOKEN_FULFILLED":
      return Object.assign({}, state, {
        access_token: action.payload.data,
        isLoading: false,
        isAuth: true
      });

    case "LOGOUT_PENDING":
      return Object.assign({}, state, {
        isLoading: true
      });

    case "LOGOUT_REJECTED":
      return Object.assign({}, state, {
        isLoading: false,
        isAuth: true
      });

    case "LOGOUT_FULFILLED":
      return Object.assign({}, state, {
        data: [],
        access_token: [],
        isLoading: false,
        isAuth: false
      });

    default:
      return state;
  }
});
