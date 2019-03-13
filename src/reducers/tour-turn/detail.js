import * as Types from './../../constants/index';

const initialState = null;
const getTourTurnById = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_TOUR_TURN_BY_ID:
            state = { ...action.tourTurn };
            return state;

        default: return state;
    }
}

export default getTourTurnById;