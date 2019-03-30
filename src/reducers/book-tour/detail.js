import * as Types from './../../constants/index';

const initialState = null;
const info = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_BOOK_TOUR_TURN_BY_ID:
            state = { ...action.book };
            return state;

        default: return state;
    }
}

export default info;