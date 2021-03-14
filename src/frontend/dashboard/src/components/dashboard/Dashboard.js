import React, { useState } from "react";
import clsx from "clsx";
import useStyles from "./style";

import Drawer from "@material-ui/core/Drawer";

import AppBar from "@material-ui/core/AppBar";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import Chart from "./Chart";
import Deposits from "./Deposits";

import { Container as RContainer } from "reactstrap";
import TableContainer from "../table/tableContainer";
import { Input } from "semantic-ui-react";

import columns from "../../model/SampleColumnHeader";
import originalData from "../../stubs/data";

export default function Dashboard() {
  const classes = useStyles();

  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState(originalData);

  const globalSearch = () => {
    let filteredData = originalData.filter((value) => {
      return (
        value.name.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        value.name.first.toLowerCase().includes(searchInput.toLowerCase()) ||
        value.name.last
          .toString()
          .toLowerCase()
          .includes(searchInput.toLowerCase())
      );
    });
    setData(filteredData);
  };

  const handleChange = (event) => {
    setSearchInput(event.target.value);
    globalSearch();
  };

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
                <Chart />
              </Paper>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Deposits />
              </Paper>
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={12}>
              <RContainer style={{ marginTop: 50 }}>
                <Input
                  fluid
                  icon="search"
                  placeholder="Search..."
                  size="massive"
                  name="searchInput"
                  value={searchInput || ""}
                  onChange={handleChange}
                />
                <br />
                <br />
                <TableContainer
                  columns={columns}
                  data={data}
                  // renderRowSubComponent={renderRowSubComponent}
                />
              </RContainer>
              {/* <Paper className={classes.paper}>
                <Orders />
              </Paper> */}
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
