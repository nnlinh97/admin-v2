import * as Types from './../../constants/index';
import _ from 'lodash';

const initialState = null;
const getListTour = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_LIST_TOUR:
            state = [...action.tour] ;
            return state;
        
        // case Types.CREATE_TYPE:
        //     state = [...state, action.data]
        //     return state;
        
        // case Types.EDIT_TYPE:
        //     let index = _.findIndex(state, (item) => {
        //         return item.id === action.data.id;
        //     });
        //     state[index] = action.data;
        // return [...state];

        default: return state;
    }
}

export default getListTour;