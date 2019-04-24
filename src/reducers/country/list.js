import * as Types from './../../constants/index';
import _ from 'lodash';

const initialState = null;
const info = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_LIST_COUNTRY:
            state = [...action.countries];
            return state;

        case Types.CREATE_COUNTRY:
            state = [...state, action.country];
            return state;

        case Types.UPDATE_COUNTRY:
            let index = _.findIndex(state, (item) => {
                return item.id === action.country.id
            });
            state[index] = action.country;
            return [...state];

        default: return state;
    }
}

export default info;