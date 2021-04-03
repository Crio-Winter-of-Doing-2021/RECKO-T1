import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";
import moment from "moment";

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Deposits(props) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Total Deposits</Title>
      <Typography component="p" variant="h4">
        ₹{props.totalData}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        {moment().format("DD-MM-YYYY hh:mm:ss")}
      </Typography>
      <div>
        <Link color="primary" href="/table">
          View Details
        </Link>
      </div>
    </React.Fragment>
  );
}
