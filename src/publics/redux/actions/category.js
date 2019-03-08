import axios from "axios";
import { server } from "../../../utils/server";

export const getCategory = () => {
  return {
    type: "GET_CATEGORY",
    payload: axios({
      method: "get",
      url: `${server.url}/api/v1/categories`
    })
  };
};
