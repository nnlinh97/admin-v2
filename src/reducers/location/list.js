import * as Types from './../../constants/index';
import _ from 'lodash';

const initialState = [];
const info = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_ALL_LOCATION:
            state = [...action.locations];
            return state;
        
        case Types.CREATE_LOCAION:
            state = [...state, action.location];
            return state;

        case Types.EDIT_LOCATION:
            let index = _.findIndex(state, (item) => {
                return item.id === action.location.id
            });
            state[index] = action.location;
            return [...state];

        default: return state;
    }
}

export default info;