import * as Types from './../../constants/index';

const initialState = null;
const getTourTurnById = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_TRANSPORT_BY_ID:
            state = { ...action.transport };
            return state;

        default: return state;
    }
}

export default getTourTurnById;