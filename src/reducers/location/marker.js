import * as Types from './../../constants/index';

const initialState = null;
const marker = (state = initialState, action) => {
    switch (action.type) {
        case Types.CHANGE_MARKER_POSITION:
            state = { ...action.marker };
            return state;

        default: return state;
    }
}

export default marker;