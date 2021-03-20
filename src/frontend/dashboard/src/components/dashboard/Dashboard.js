import React, { useState } from "react";
import useStyles from "./style";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import { Container as RContainer } from "reactstrap";
import TableContainer from "./table/tableContainer";
import { Input } from "semantic-ui-react";

import columns from "./model/TableColumnHeader";
import originalData from "../../stubs/data";

export default function Dashboard() {
  const classes = useStyles();

  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState(originalData);

  const globalSearch = () => {
    let filteredData = originalData.filter((value) => {
      return value.account_name
        .toLowerCase()
        .includes(searchInput.toLowerCase());
    });
    setData(filteredData);
  };

  const handleChange = (event) => {
    setSearchInput(event.target.value);
    globalSearch();
  };

  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <RContainer style={{ marginTop: 50 }}>
                <br />
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
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
