import * as Types from './../../constants/index';
import _ from 'lodash';

const initialState = null;
const getListTourTurn = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_LIST_TRANSPORT:
            state = [...action.transport];
            return state;

        case Types.CREATE_TRANSPORT:
            state = [action.transport, ...state];
            return state;

        case Types.EDIT_TRANSPORT:
            let index = _.findIndex(state, (item) => {
                return item.id === action.transport.id;
            });
            state[index] = action.transport;
            return [...state];

        default: return state;
    }
}

export default getListTourTurn;