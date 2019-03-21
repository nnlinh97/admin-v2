import * as Types from './../../constants/index';
import _ from 'lodash';

const initialState = null;
const getListTour = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_LIST_TOUR:
            state = [...action.tour] ;
            return state;
        
        case Types.CREATE_TOUR:
            state = [ action.tour, ...state]
            return state;
        
        case Types.EDIT_TOUR:
            let index = _.findIndex(state, (item) => {
                return item.id === action.tour.id;
            });
            state[index] = action.data;
        return [...state];

        default: return state;
    }
}

export default getListTour;