import React, { useState, useEffect } from "react";
import clsx from "clsx";
import useStyles from "./style";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import AccountLineGraph from "./lineGraph";
import Deposits from "./Deposits";

import AccountPieChart from "./pieChart";
import AccountBarGraph from "./barGraph";

import apiService from "../../services/apiService";
import { trackPromise } from "react-promise-tracker";

export default function Report() {
  const [pieChartData, setPieChartData] = useState([]);
  const [barGraphData, setBarGraphData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [lineGraphData, setLineGraphData] = useState([]);

  useEffect(() => {
    trackPromise(
      apiService
        .getLineGraphData()
        .then((response) => {
          setLineGraphData(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        }),

      apiService
        .getTotalData()
        .then((response) => {
          setTotalData(response.data.data[0].total_deposits);
        })
        .catch((error) => {
          console.log(error);
        }),

      apiService
        .getPieChartData()
        .then((response) => {
          setPieChartData(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        }),

      apiService
        .getBarGraphData()
        .then((response) => {
          setBarGraphData(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        })
    );
  }, []);

  const classes = useStyles();

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <AccountLineGraph lineGraphData={lineGraphData} />
              </Paper>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Deposits totalData={totalData} />
              </Paper>
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={12} md={4} lg={6}>
              <Paper className={classes.paper}>
                <AccountPieChart pieChartData={pieChartData} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={6}>
              <Paper className={classes.paper}>
                <AccountBarGraph barGraphData={barGraphData} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
