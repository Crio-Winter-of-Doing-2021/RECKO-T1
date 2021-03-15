import axios from "axios";
// import config from "./Constants";

// export default class ApiService {
//   static get(params) {
//     return axios.get(config.url.API_HOST + "/" + config.url.API_ENDPOINT, {
//       params,
//     });
//   }
// }

//TODO: replace URL with Constants.

const instance = axios.create({
  baseURL: "https://recko-t1.herokuapp.com/api",
  headers: {
    // "content-type": "application/octet-stream",
    // "x-rapidapi-host": "example.com",
    // "x-rapidapi-key": process.env.RAPIDAPI_KEY,
    Authorization: "Token 98490be4c0082385e66079f58857deb18861a583",
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
  // postData: () =>
  //   instance({
  //     method: "POST",
  //     url: "/api",
  //     data: {
  //       item1: "data1",
  //       item2: "item2",
  //     },
  //     headers: {
  //       "content-type": "application/json", // override instance defaults
  //     },
  //   }),
};
