import apiService from "../../services/apiService";
import { trackPromise } from "react-promise-tracker";

export const fetchDashboardData = (e, setData) => {
  //e.preventDefault();
  trackPromise(
    apiService
      .getDashboardData()
      .then((response) => {
        console.log(response.data.data);
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      })
  );
};
