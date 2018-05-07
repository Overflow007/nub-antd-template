import React from 'react';
//import { Router, Route, Switch, Redirect } from 'react-router';
import Router from 'components/Router';
import history from 'common/history';
import Header from 'components/SiteFrame/Header';
import Aside from 'components/SiteFrame/Aside';
import Container from 'components/SiteFrame/Container';
import http from 'common/http';
import routeConfig from 'config/routeConfig';

export default function RouterConfig() {
  
  return (<Router><Header>test</Header><Aside /><Container /></Router>);
}

/* export default function RouterConfig() {
  return (
    <Router history={history}>
      <Switch>
        <Route path={routeConfig.home} exact>
          <TopBar>
            <span>This is Home Page. Replace your content here.</span>
          </TopBar>
        </Route>
        <Redirect to={routeConfig.home} />
      </Switch>
    </Router>
  );
} */
