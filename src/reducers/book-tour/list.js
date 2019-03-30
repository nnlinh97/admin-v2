import * as Types from './../../constants/index';

const initialState = null;
const info = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_LIST_BOOK_TOUR_TURN:
            state = [...action.listBook];
            return state;

        default: return state;
    }
}

export default info;