import * as Types from './../../constants/index';

const initialState = null;
const getTourTurnById = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_ROUTE_BY_ID:
            state = { ...action.route };
            return state;

        default: return state;
    }
}

export default getTourTurnById;