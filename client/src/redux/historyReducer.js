import { GET_HISTORY } from './types'


const initialState = {
    histories: [],
}

export const historyReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_HISTORY:
            return { ...state, histories: action.payload }
        default:
            return state
    }
}