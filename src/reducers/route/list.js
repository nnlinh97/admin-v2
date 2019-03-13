import * as Types from './../../constants/index';
import _ from 'lodash';

const initialState = null;
const getListRoute = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_LIST_ROUTE:
            state = [...action.route];
            return state;

        case Types.CREATE_ROUTE:
            state = [action.route, ...state];
            return state;

        case Types.EDIT_ROUTE:
            console.log(action);
            console.log(state);
            let index = _.findIndex(state, (item) => {
                return item.id === action.route.id;
            });
            console.log(index);
            state[index] = action.route;
            return [...state];

        default: return state;
    }
}

export default getListRoute;