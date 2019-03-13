import * as Types from './../../constants/index';
import _ from 'lodash';

const initialState = null;
const getListTour = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_TOUR_BY_ID:
            state = { ...action.tour };
            return state;

        default: return state;
    }
}

export default getListTour;