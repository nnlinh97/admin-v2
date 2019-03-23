import * as Types from './../../constants/index';
import _ from 'lodash';

const initialState = null;
const getAllType = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_LIST_TYPE_PASSENGER:
            state = [...action.typePassenger];
            return state;
        case Types.CREATE_TYPE_PASSENGER:
            state = [...state, action.typePassenger]
            return state;

        case Types.EDIT_TYPE_PASSENGER:
            let index = _.findIndex(state, (item) => {
                return item.id === action.typePassenger.id;
            });
            state[index] = action.typePassenger;
            return [...state];

        default: return state;
    }
}

export default getAllType;