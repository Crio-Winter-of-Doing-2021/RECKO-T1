import apiService from "../../services/apiService";
import { trackPromise } from "react-promise-tracker";

export const openInNewTab = (url) => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};

export const authenticateXero = (e) => {
  e.preventDefault();
  trackPromise(
    apiService
      .getXeroAuthUrl()
      .then((response) => {
        openInNewTab(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  );
};

export const authenticateQuickbooks = (e) => {
  e.preventDefault();
  trackPromise(
    apiService
      .getQuickbooksAuthUrl()
      .then((response) => {
        openInNewTab(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  );
};
