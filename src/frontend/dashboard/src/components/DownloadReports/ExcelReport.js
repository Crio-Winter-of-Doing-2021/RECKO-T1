import React, { useState, useEffect } from "react";
import apiService from "../../services/apiService";
import { trackPromise } from "react-promise-tracker";
import LoadingIndicator from "../loading/LoadingIndicator";
import ErrorBox from "../error/ErrorBox";
import { Redirect } from "react-router-dom";

export default function ExcelReport() {
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    trackPromise(
      apiService
        .getExcelReport()
        .then((response) => {
          setRedirect(true);

          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "file.xlsx");
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          console.log(error);
          setError("Error downloading report. Try again.");
        })
    );
  }, []);

  return (
    <div>
      {error != "" && <ErrorBox message={error} />}
      <br />
      {/* <LoadingIndicator /> */}
      <br />
      <br />
      <br />
      <br />
      {redirect == true ? (
        <Redirect to="/table" />
      ) : (
        <div>
          <h3>"Generating Excel report. Please wait..."</h3>
        </div>
      )}
    </div>
  );
}
