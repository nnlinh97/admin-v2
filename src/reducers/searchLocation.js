import * as Types from './../constants/index';

const initialState = null;
const searchLocation = (state = initialState, action) => {
    switch (action.type) {
        case Types.SEARCH_LOCATION:
            state = { ...action.location };
            return state;

        default: return state;
    }
}

export default searchLocation;