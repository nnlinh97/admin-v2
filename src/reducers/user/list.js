import * as Types from './../../constants/index';

const initialState = null;
const getListTypeLocation = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_LIST_USER:
            state = [...action.users] ;
            return state;

        default: return state;
    }
}

export default getListTypeLocation;