import apiService from "../../services/apiService";

export const openInNewTab = (url) => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};

export const authenticateXero = (e) => {
  e.preventDefault();
  apiService
    .getXeroAuthUrl()
    .then((response) => {
      openInNewTab(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const authenticateQuickbooks = (e) => {
  e.preventDefault();
  apiService
    .getQuickbooksAuthUrl()
    .then((response) => {
      openInNewTab(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};
