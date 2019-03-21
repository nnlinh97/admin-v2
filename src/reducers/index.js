import { combineReducers } from 'redux';
import searchLocation from './searchLocation';
import infoLocation from './location/info';
import allLocation from './location/list';
import locationDetail from './location/detail'
import allType from './type';
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

const appReducers = combineReducers({
   searchLocation,
   infoLocation,
   allType,
   allLocation,
   locationDetail,
   marker,
   listTour,
   tourDetail,
   listTourTurn,
   tourTurnDetail,
   listRoute,
   listTransport,
   transportDetail,
   listUser
});

export default appReducers;