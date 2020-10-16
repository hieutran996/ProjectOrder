import React from 'react';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
//Recoil
import { useRecoilValue } from 'recoil';
import { openMenuState } from '../Recoil/atom';
//Layouts
import MenuBar from '../Commons/Layouts/Menubar';
import Header from '../Commons/Layouts/Header';
//Components
import Dashboard from '../Components/todoList';
import BranchSell from '../Components/BranchSell';
import TypeProduct from '../Components/TypeProduct';
import Seller from '../Components/Seller';
const drawerWidth = 240;
function ReactRouter() {
  const classes = useStyles();
  const open = useRecoilValue(openMenuState);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header />
      <MenuBar />
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Route path="/" exact component={Dashboard} />
        <Route path="/order_management" component={Dashboard} />
        <Route path="/branch_sell" component={BranchSell} />
        <Route path="/type_product" component={TypeProduct} />
        <Route path="/seller" component={Seller} />
      </main>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
}));
export default withRouter(ReactRouter);
