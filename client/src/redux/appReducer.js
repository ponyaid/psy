import { START_LOADING, FINISH_LOADING, SHOW_ALERT, HIDE_ALERT } from './types'

const initialState = {
    loading: false,
    alert: null
}

export const appReducer = (state = initialState, action) => {
    switch (action.type) {

        case START_LOADING:
            return { ...state, loading: true }

        case FINISH_LOADING:
            return { ...state, loading: false }

        case SHOW_ALERT:
            return { ...state, alert: action.payload }

        case HIDE_ALERT:
            return { ...state, alert: null }
            
        default:
            return state
    }
}