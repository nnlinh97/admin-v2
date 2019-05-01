import * as Types from './../../constants/index';
import _ from 'lodash';

const initialState = null;
const profile = (state = initialState, action) => {
    switch (action.type) {
        case Types.LOGIN:
            state = {...action.profile};
            return state;

        default: return state;
    }
}

export default profile;