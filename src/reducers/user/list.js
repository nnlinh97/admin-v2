import * as Types from './../../constants/index';
import _ from 'lodash';

const initialState = null;
const getAllType = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_LIST_USER:
            state = [...action.users] ;
            return state;

        default: return state;
    }
}

export default getAllType;