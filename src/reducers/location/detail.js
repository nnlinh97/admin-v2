import * as Types from './../../constants/index';

const initialState = null;
const info = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_LOCATION_DETAIL:
        console.log(action.tour)
            state = { ...action.location };
            return state;

        default: return state;
    }
}

export default info;