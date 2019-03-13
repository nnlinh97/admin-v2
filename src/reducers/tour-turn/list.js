import * as Types from './../../constants/index';
import _ from 'lodash';

const initialState = null;
const getListTourTurn = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_LIST_TOUR_TURN:
            state = [...action.tourTurn];
            return state;

        case Types.CREATE_TOUR_TURN:
            state = [action.tourTurn, ...state];
            return state;

        case Types.EDIT_TOUR_TURN:
            let index = _.findIndex(state, (item) => {
                return item.id === action.tourTurn.id;
            });
            state[index] = action.tourTurn;
            return [...state];

        default: return state;
    }
}

export default getListTourTurn;