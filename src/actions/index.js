import * as Types from './../constants/index';

export const login = (profile) => {
    return {
        type: Types.LOGIN,
        profile
    }
}

export const searchLocation = (location) => {
    return {
        type: Types.SEARCH_LOCATION,
        location
    }
}


export const changeLocationInfo = (info) => {
    return {
        type: Types.CHANGE_LOCATION_INFO,
        info
    }
}

export const getListTypeLocation = (list) => {
    return {
        type: Types.GET_LIST_TYPE_LOCATION,
        list
    };
}

export const createLocation = (location) => {
    return {
        type: Types.CREATE_LOCAION,
        location
    }
}

export const getListLocation = (locations) => {
    return {
        type: Types.GET_ALL_LOCATION,
        locations
    }
}

export const getLocationDetail = (location) => {
    return {
        type: Types.GET_LOCATION_DETAIL,
        location
    }
}

export const changeMarkerPosition = (marker) => {
    return {
        type: Types.CHANGE_MARKER_POSITION,
        marker
    }
}

export const editLocation = (location) => {
    return {
        type: Types.EDIT_LOCATION,
        location
    }
}

// type
export const createType = (data) => {
    return {
        type: Types.CREATE_TYPE,
        data
    }
}

export const editType = (data) => {
    return {
        type: Types.EDIT_TYPE,
        data
    }
}

//tour

export const getListTour = (tour) => {
    return {
        type: Types.GET_LIST_TOUR,
        tour
    }
}

export const getTourById = (tour) => {
    return {
        type: Types.GET_TOUR_BY_ID,
        tour
    }
}

export const createTour = (tour) => {
    return {
        type: Types.CREATE_TOUR,
        tour
    }
}

export const editTour = (tour) => {
    return {
        type: Types.EDIT_TOUR,
        tour
    }
}

//tour turn

export const getListTourTurn = (tourTurn) => {
    return {
        type: Types.GET_LIST_TOUR_TURN,
        tourTurn
    }
}

export const getTourTurnById = (tourTurn) => {
    return {
        type: Types.GET_TOUR_TURN_BY_ID,
        tourTurn
    }
}

export const createTourTurn = (tourTurn) => {
    return {
        type: Types.CREATE_TOUR_TURN,
        tourTurn
    }
}

export const EditTourTurn = (tourTurn) => {
    return {
        type: Types.EDIT_TOUR_TURN,
        tourTurn
    }
}

//route

export const getListRoute = (route) => {
    return {
        type: Types.GET_LIST_ROUTE,
        route
    }
}

export const getRouteById = (route) => {
    return {
        type: Types.GET_ROUTE_BY_ID,
        route
    }
}

export const createRoute = (route) => {
    return {
        type: Types.CREATE_ROUTE,
        route
    }
}

export const editRoute = (route) => {
    return {
        type: Types.EDIT_ROUTE,
        route
    }
}


//transport
export const getListTransport = (transport) => {
    return {
        type: Types.GET_LIST_TRANSPORT,
        transport
    }
}

export const getTransportById = (transport) => {
    return {
        type: Types.GET_TRANSPORT_BY_ID,
        transport
    }
}

export const createTransport = (transport) => {
    return {
        type: Types.CREATE_TRANSPORT,
        transport
    }
}

export const editTransport = (transport) => {
    return {
        type: Types.EDIT_TRANSPORT,
        transport
    }
}

//user
export const getListUser = (users) => {
    return {
        type: Types.GET_LIST_USER,
        users
    }
}

//type passenger
export const getListTypePassenger = (typePassenger) => {
    return {
        type: Types.GET_LIST_TYPE_PASSENGER,
        typePassenger
    }
}

export const createTypePassenger = (typePassenger) => {
    return {
        type: Types.CREATE_TYPE_PASSENGER,
        typePassenger
    }
}

export const editTypePassenger = (typePassenger) => {
    return {
        type: Types.EDIT_TYPE_PASSENGER,
        typePassenger
    }
}

// book tour turn

export const getListBookTourTurn = (listBook) => {
    return {
        type: Types.GET_LIST_BOOK_TOUR_TURN,
        listBook
    }
}

export const getBookTourTurnById = (book) => {
    return {
        type: Types.GET_BOOK_TOUR_TURN_BY_ID,
        book
    }
}

//country
export const getListCountries = (countries) => {
    return {
        type: Types.GET_LIST_COUNTRY,
        countries
    }
}

export const updateCountry = (country) => {
    return {
        type: Types.UPDATE_COUNTRY,
        country
    }
}

export const createCountry = (country) => {
    return {
        type: Types.CREATE_COUNTRY,
        country
    }
}

//province
export const getListProvinces = (provinces) => {
    return {
        type: Types.GET_LIST_PROVINCE,
        provinces
    }
}

export const updateProvince = (province) => {
    return {
        type: Types.UPDATE_PROVINCE,
        province
    }
}

export const createProvince = (province) => {
    return {
        type: Types.CREATE_PROVINCE,
        province
    }
}





