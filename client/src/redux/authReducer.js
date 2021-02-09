import { LOGIN, LOGOUT, UPDATE_USER } from './types'


const initialState = {
    role: null,
    user: null,
    token: null
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            const { role, user, token } = action.payload
            return { ...state, role, user, token }
        case LOGOUT:
            return { ...state, role: null, user: null, token: null }
        case UPDATE_USER:
            return { ...state, user: action.payload }
        default:
            return state
    }
}