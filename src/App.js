import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import LoginPage from './pages/login/';
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
import ListRoutePage from './pages/route/list';
import ListTransportPage from './pages/transport/list';
import ListTypePassengerPage from './pages/type-passenger/list';
import ListUserPage from './pages/user/list';
import ChangePasswordPage from './pages/change-password';
import ListBookTourPage from './pages/book-tour/list';
import BookTourTurnDetail from './pages/book-tour/detail';
import ListCountryPage from './pages/country/list';
import ListProvincePage from './pages/province/list';
import PrintListPassenger from './components/book-tour/print';
import BookTourDetail from './pages/book-tour-detail';
import PhoneCall from './pages/phone-call';
import PrivateRoute from './components/private-route/';
import PrivateRouteManager from './components/private-route-manager';
import BillCancelBooking from './components/book-tour-detail/bill-cancel';
import BillPayment from './components/book-tour-detail/bill-payment';
import ListAdmin from './pages/admin/list';
import ListRole from './pages/role/list';
import Chart from './pages/chart';
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>

          {/* dashboard */}
          <PrivateRoute exact path='/' component={DashboardPage} />

          {/* login */}
          <Route exact path='/login' component={LoginPage} />

          {/* location */}
          <PrivateRoute exact path='/location/list' component={ListLocationPage} />
          <PrivateRoute exact path='/location/create' component={CreateLocationPage} />
          <PrivateRoute exact path='/location/edit/:id' component={EditLocationPage} />

          {/* type location */}
          <PrivateRoute exact path='/type-location/list' component={ListTypesPage} />

          {/* tour turn  */}
          <PrivateRoute exact path='/tour-turn/list' component={ListTourTurnPage} />
          <PrivateRoute exact path='/tour-turn/create' component={CreateTourTurnPage} />
          <PrivateRoute exact path='/tour-turn/edit/:id' component={EditTourTurnPage} />

          {/* tour  */}
          <PrivateRoute exact path='/tour/create' component={CreateTourPage} />
          <PrivateRoute exact path='/tour/list' component={ListTourPage} />
          <PrivateRoute exact path='/tour/edit/:id' component={EditTourPage} />

          {/* route */}
          <PrivateRoute exact path='/route/list' component={ListRoutePage} />

          {/* transport */}
          <PrivateRoute exact path='/transport/list' component={ListTransportPage} />

          {/* type passenger */}
          <PrivateRoute exact path='/type-passenger/list' component={ListTypePassengerPage} />

          {/* user */}
          <PrivateRoute exact path='/user/list' component={ListUserPage} />

          {/* change password */}
          <PrivateRoute exact path='/admin/change-password' component={ChangePasswordPage} />

          {/* book tour */}
          <PrivateRoute exact path='/book-tour/list' component={ListBookTourPage} />
          <PrivateRoute exact path='/book-tour/:id' component={BookTourTurnDetail} />
          <PrivateRoute exact path='/book-tour-detail/:code' component={BookTourDetail} />
          <PrivateRoute exact path='/print/bill-cancel-booking/:code' component={BillCancelBooking} />
          <PrivateRoute exact path='/print/bill-payment/:code' component={BillPayment} />

          {/* country */}
          <PrivateRoute exact path='/country/list' component={ListCountryPage} />

          {/* province */}
          <PrivateRoute exact path='/province/list' component={ListProvincePage} />

          {/* print */}
          <PrivateRoute exact path='/print-passengers/:id' component={PrintListPassenger} />

          {/* phone call */}
          <PrivateRoute exact path='/phone-call' component={PhoneCall} />

          {/* admin */}
          <PrivateRoute exact path='/admin/list' component={ListAdmin} />

          {/* role */}
          <PrivateRoute exact path='/role/list' component={ListRole} />

          {/* chart */}
          <PrivateRoute exact path='/statistical' component={Chart} />

          {/* not found */}
          <PrivateRoute exact path='' component={NotFound} />

        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
