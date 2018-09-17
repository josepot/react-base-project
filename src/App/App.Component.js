import React from 'react';
import {Redirect, Route, Switch} from 'react-router';

import Navigation from './Navigation';
import List from './List';
import NewItem from './NewItem';

const App = () => (
  <div>
    <Navigation />
    <Switch>
      <Route exact path="/new" component={NewItem} />
      <Route path="/list" component={List} />
      <Redirect to="/list" />
    </Switch>
  </div>
);

App.displayName = 'App';
export default App;
