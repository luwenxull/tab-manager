import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import MD from '../mdui';

const useStyles = makeStyles((theme) =>
  createStyles({
    fab: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }),
);

export default function Fab(props) {
  const classes = useStyles()
  return <MD.Fab {...props} className={classes.fab}/>
}
