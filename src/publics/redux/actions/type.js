import axios from "axios";
import { server } from "../../../utils/server";

export const getType = () => {
  return {
    type: "GET_TYPE",
    payload: axios({
      method: "get",
      url: `${server.url}/api/v1/types`
    })
  };
};
