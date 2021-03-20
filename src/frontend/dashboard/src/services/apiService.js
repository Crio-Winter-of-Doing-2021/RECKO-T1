import axios from "axios";
import Cookie from "js-cookie";
// import config from "./Constants";

// export default class ApiService {
//   static get(params) {
//     return axios.get(config.url.API_HOST + "/" + config.url.API_ENDPOINT, {
//       params,
//     });
//   }
// }

//TODO: replace URL with Constants.
const token = Cookie.get("token") ? Cookie.get("token") : null;

const instance = axios.create({
  baseURL: "https://recko-t1.herokuapp.com/api",
  headers: {
    // "content-type": "application/octet-stream",
    // "x-rapidapi-host": "example.com",
    // "x-rapidapi-key": process.env.RAPIDAPI_KEY,
    Authorization: "Token " + token, //98490be4c0082385e66079f58857deb18861a583
  },
});

export default {
  getXeroAuthUrl: () =>
    instance({
      method: "GET",
      url: "/xero/auth/request",
      // params: {
      //   search: "parameter",
      // },
      // transformResponse: [
      //   function (data) {
      //     // Do whatever you want to transform the data
      //     console.log("Transforming data...");
      //     const json = JSON.parse(data);
      //     // list of nested object keys
      //     const dates = Object.keys(json["nested object"]);
      //     data = {
      //       dates,
      //     };
      //     return data;
      //   },
      // ],
    }),
  getQuickbooksAuthUrl: () =>
    instance({
      method: "GET",
      url: "/quickbooks/auth/request",
    }),
  getDashboardData: () =>
    instance({
      method: "GET",
      url:
        "https://recko-t1.herokuapp.com/api/account/transactions?page=1&per_page=30&order_by=type&order_direction=desc",
    }),
  signUpUser: (signUpFormData) =>
    instance({
      method: "POST",
      url: "/user/create/",
      data: signUpFormData,
      headers: {
        "content-type": "application/x-www-form-urlencoded", // override instance defaults
      },
    }),
  signInUser: (signInFormData) =>
    instance({
      method: "POST",
      url: "/user/token/",
      data: signInFormData,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    }),
};
