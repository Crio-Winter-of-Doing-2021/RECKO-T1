import React from "react";
import clsx from "clsx";
import useStyles from "./style";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import { mainListItems, secondaryListItems } from "./listItems";
import Cookie from "js-cookie";
import Copyright from "../components/footer/Copyright";
import { StylesProvider } from "@material-ui/core/styles";
import NotifyMe from "react-notification-timeline";

export default function Layout(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [notificationData, setNotification] = React.useState([]);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = (e) => {
    //e.preventDefault();

    console.log("Logging out..");
    Cookie.remove("token");
    window.location.reload(false);
  };

  return (
    <StylesProvider injectFirst>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={clsx(classes.appBar, open && classes.appBarShift)}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(
                classes.menuButton,
                open && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Accounting Dashboard
            </Typography>
            {/* <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
              
            </IconButton> */}

            <NotifyMe
              data={notificationData}
              storageKey="notific_key"
              notific_key="timestamp"
              notific_value="update"
              // heading="Notification Alerts"
              sortedByKey={false}
              showDate={true}
              size={24}
              // color="yellow"
            />
            <IconButton color="inherit" onClick={handleLogout}>
              <PowerSettingsNewIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>{mainListItems}</List>
          <Divider />
          <List>{secondaryListItems}</List>
        </Drawer>
        <main className={classes.content}>
          {/* <div className={classes.appBarSpacer} /> */}
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              <main>{props.children}</main>
            </Grid>
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
    </StylesProvider>
  );
}
