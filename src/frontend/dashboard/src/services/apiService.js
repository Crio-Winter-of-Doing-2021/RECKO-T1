import axios from "axios";
import config from "./Constants";

export default class ApiService {
  static get(params) {
    return axios.get(config.url.API_HOST + "/" + config.url.API_ENDPOINT, {
      params,
    });
  }
}
