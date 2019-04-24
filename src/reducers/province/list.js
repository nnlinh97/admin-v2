import * as Types from './../../constants/index';
import _ from 'lodash';

const initialState = null;
const info = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_LIST_PROVINCE:
            state = [...action.provinces];
            return state;
        
            case Types.CREATE_PROVINCE:
            state = [...state, action.province];
            return state;

        case Types.UPDATE_PROVINCE:
            let index = _.findIndex(state, (item) => {
                return item.id === action.province.id
            });
            state[index] = action.province;
            return [...state];

        default: return state;
    }
}

export default info;