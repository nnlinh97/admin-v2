import * as Types from './../../constants/index';
import _ from 'lodash';

const initialState = null;
const getAllType = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_ALL_TYPE:
            state = [...action.allType] ;
            return state;
        
        case Types.CREATE_TYPE:
            state = [...state, action.data]
            return state;
        
        case Types.EDIT_TYPE:
            let index = _.findIndex(state, (item) => {
                return item.id === action.data.id;
            });
            state[index] = action.data;
        return [...state];

        default: return state;
    }
}

export default getAllType;