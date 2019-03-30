import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import LoginPage from './pages/Login';
import NotFound from './pages/NotFound';
import ListLocationPage from './pages/location/list';
import CreateLocationPage from './pages/location/create';
import EditLocationPage from './pages/location/edit';
import DashboardPage from './pages/Dashboard';
import ListTypesPage from './pages/type-location/list';
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
import ChangePasswordPage from './pages/change-password';
import ListBookTourPage from './pages/book-tour/list';
import BookTourTurnDetail from './pages/book-tour/detail';
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <PrivateRoute exact path='/' component={DashboardPage} />
          <Route exact path='/login' component={LoginPage} />

          <PrivateRoute exact path='/location/list' component={ListLocationPage} />
          <PrivateRoute exact path='/location/create' component={CreateLocationPage} />
          <PrivateRoute exact path='/location/edit/:id' component={EditLocationPage} />

          <PrivateRoute exact path='/type-location/list' component={ListTypesPage} />

          <PrivateRoute exact path='/tour-turn/list' component={ListTourTurnPage} />
          <PrivateRoute exact path='/tour-turn/create' component={CreateTourTurnPage} />
          <PrivateRoute exact path='/tour-turn/edit/:id' component={EditTourTurnPage} />

          <PrivateRoute exact path='/tour/create' component={CreateTourPage} />
          <PrivateRoute exact path='/tour/list' component={ListTourPage} />
          <PrivateRoute exact path='/tour/edit/:id' component={EditTourPage} />

          <PrivateRoute exact path='/route/create' component={CreateRoutePage} />
          <PrivateRoute exact path='/route/list' component={ListRoutePage} />
          <PrivateRoute exact path='/route/edit/:id' component={EditRoutePage} />

          <PrivateRoute exact path='/transport/list' component={ListTransportPage} />

          <PrivateRoute exact path='/type-passenger/list' component={ListTypePassengerPage} />

          <PrivateRoute exact path='/user/list' component={ListUserPage} />

          <PrivateRoute exact path='/admin/change-password' component={ChangePasswordPage} />

          <PrivateRoute exact path='/book-tour/list' component={ListBookTourPage} />

          <PrivateRoute exact path='/book-tour/detail/:id' component={BookTourTurnDetail} />

          <PrivateRoute exact path='' component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
