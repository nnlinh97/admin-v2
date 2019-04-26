import { combineReducers } from 'redux';
import searchLocation from './searchLocation';
import infoLocation from './location/info';
import listLocation from './location/list';
import locationDetail from './location/detail'
import listTypeLocation from './type-location/list';
import marker from './location/marker';
import listTour from './tour/list';
import tourDetail from './tour/detail';
import listTourTurn from './tour-turn/list';
import tourTurnDetail from './tour-turn/detail';
import listRoute from './route/list';
import routeDetail from './route/detail';
import listTransport from './transport/list';
import transportDetail from './transport/detail';
import listUser from './user/list';
import listTypePassenger from './type-passenger/list';
import listBookTourTurn from './book-tour/list';
import bookTourTurnDetail from './book-tour/detail';
import listCountries from './country/list';
import listProvinces from './province/list';

const appReducers = combineReducers({
   searchLocation,
   infoLocation,
   listTypeLocation,
   listLocation,
   locationDetail,
   marker,
   listTour,
   tourDetail,
   listTourTurn,
   tourTurnDetail,
   listRoute,
   listTransport,
   transportDetail,
   listUser,
   listTypePassenger,
   listBookTourTurn,
   bookTourTurnDetail,
   listCountries,
   listProvinces
});

export default appReducers;