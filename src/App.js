import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import LoginPage from './pages/Login';
import NotFound from './pages/NotFound';
import ListLocationPage from './pages/location/list';
import CreateLocationPage from './pages/location/create';
import EditLocationPage from './pages/location/edit';
import DashboardPage from './pages/Dashboard';
import ListTypesPage from './pages/type/list';
import ListTourTurnPage from './pages/tour-turn/list';
import ListTourPage from './pages/tour/list';
import EditTourPage from './pages/tour/edit';
import CreateTourPage from './pages/tour/create';
import CreateTourTurnPage from './pages/tour-turn/create';
import EditTourTurnPage from './pages/tour-turn/edit';
import PrivateRoute from './components/private-route';

import ListRoutePage from './pages/route/list';
import CreateRoutePage from './pages/route/create';
import EditRoutePage from './pages/route/edit';

import ListTransportPage from './pages/transport/list';

import ListTypePassengerPage from './pages/type-passenger/list';
import ListUserPage from './pages/user/list';
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <PrivateRoute exact path='/' component={DashboardPage} />
          <Route exact path='/login' component={LoginPage} />

          <Route exact path='/location/list' component={ListLocationPage} />
          <Route exact path='/location/create' component={CreateLocationPage} />
          <Route exact path='/location/edit/:id' component={EditLocationPage} />

          <Route exact path='/type/list' component={ListTypesPage} />

          <Route exact path='/tour-turn/list' component={ListTourTurnPage} />
          <Route exact path='/tour-turn/create' component={CreateTourTurnPage} />
          <Route exact path='/tour-turn/edit/:id' component={EditTourTurnPage} />

          <Route exact path='/tour/create' component={CreateTourPage} />
          <Route exact path='/tour/list' component={ListTourPage} />
          <Route exact path='/tour/edit/:id' component={EditTourPage} />

          <Route exact path='/route/create' component={CreateRoutePage} />
          <Route exact path='/route/list' component={ListRoutePage} />
          <Route exact path='/route/edit/:id' component={EditRoutePage} />

          <Route exact path='/transport/list' component={ListTransportPage} />

          <Route exact path='/type-passenger/list' component={ListTypePassengerPage} />

          <Route exact path='/user/list' component={ListUserPage} />

          <Route exact path='' component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
