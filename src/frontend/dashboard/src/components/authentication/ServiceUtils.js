import apiService from "../../services/apiService";
import Cookie from "js-cookie";

//const token = Cookie.get("token") ? Cookie.get("token") : null;

//to set a cookie

export const signUpUser = (e, data) => {
  e.preventDefault();

  apiService
    .signUpUser(data)
    .then((response) => {
      //console.log(response.data);
      window.location.assign("/login");
    })
    .catch((error) => {
      console.log(error);
    });
};

export const signInUser = (e, data) => {
  e.preventDefault();

  apiService
    .signInUser(data)
    .then((response) => {
      //console.log(response.data.token);
      Cookie.set("token", response.data.token);
      // console.log(Cookie.get("token"));
      // Cookie.remove("token");
      // console.log(Cookie.get("token"));
      //window.location.assign("/login");
    })
    .catch((error) => {
      console.log(error);
    });
};
