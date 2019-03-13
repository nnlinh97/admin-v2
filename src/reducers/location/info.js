import * as Types from './../../constants/index';

const initialState = null;
const info = (state = initialState, action) => {
    switch (action.type) {
        case Types.CHANGE_LOCATION_INFO:
            state = { ...action.info };
            return state;

        default: return state;
    }
}

export default info;