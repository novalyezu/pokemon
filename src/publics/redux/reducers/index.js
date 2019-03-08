import { combineReducers } from "redux";

import auth from "./auth";
import pokemon from "./pokemon";
import category from "./category";
import type from "./type";

const appReducer = combineReducers({
  auth,
  pokemon,
  category,
  type
});

export default appReducer;
