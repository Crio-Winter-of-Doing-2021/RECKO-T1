import apiService from "../../services/apiService";
import Cookie from "js-cookie";
import { trackPromise } from "react-promise-tracker";

export const signUpUser = (e, data) => {
  e.preventDefault();

  trackPromise(
    apiService
      .signUpUser(data)
      .then((response) => {
        window.location.assign("/login");
      })
      .catch((error) => {
        console.log(error);
      })
  );
};

export const signInUser = (e, data) => {
  e.preventDefault();

  trackPromise(
    apiService
      .signInUser(data)
      .then((response) => {
        Cookie.set("token", response.data.token);
        window.location.reload(false);
      })
      .catch((error) => {
        console.log(error);
      })
  );
};
