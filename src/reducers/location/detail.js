import * as Types from './../../constants/index';

const initialState = null;
const info = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_LOCATION_DETAIL:
            state = { ...action.location };
            return state;

        default: return state;
    }
}

export default info;