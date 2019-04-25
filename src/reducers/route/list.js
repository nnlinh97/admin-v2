import * as Types from './../../constants/index';
import _ from 'lodash';

const initialState = [];
const getListRoute = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_LIST_ROUTE:
            state = [...action.route];
            return state;

        case Types.CREATE_ROUTE:
            state = [action.route, ...state];
            return state;

        case Types.EDIT_ROUTE:
            let index = _.findIndex(state, (item) => {
                return item.id === action.route.id;
            });
            state[index] = action.route;
            return [...state];

        default: return state;
    }
}

export default getListRoute;