import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import useStyles from "./style";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import Container from "@material-ui/core/Container";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";

import AppBar from "@material-ui/core/AppBar";
import apiService from "../../services/apiService";

import * as constUtils from "./ServiceUtils";

export default function ServiceList() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Recent Orders */}
            <Grid item xs={12}>
              <List className={classes.root}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      alt="Xero logo"
                      src="http://assets.stickpng.com/images/58482945cef1014c0b5e49f8.png"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Xero all-in-one accounting software"
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          Connect to your bank
                        </Typography>
                        {
                          " Set up bank feeds from your bank accounts so transactions are imported securely into Xero each business day."
                        }
                      </React.Fragment>
                    }
                  />
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={(e) => constUtils.authenticateXero(e)}
                  >
                    Add
                  </Button>
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      alt="Quickbooks logo"
                      src="https://quickbooks.intuit.com/cas/dam/IMAGE/A6OWCozsM/qb_thumb.png"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Intuit QuickBooks"
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          Get a real-time view of your cash flow
                        </Typography>
                        {
                          " Connect your bank account to automatically import and categorize transactions. "
                        }
                      </React.Fragment>
                    }
                  />
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={(e) => constUtils.authenticateQuickbooks(e)}
                  >
                    Add
                  </Button>
                </ListItem>
                <Divider variant="inset" component="li" />
              </List>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
