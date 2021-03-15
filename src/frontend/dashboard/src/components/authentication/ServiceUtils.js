import apiService from "../../services/apiService";

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
