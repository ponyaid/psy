import { createContext } from 'react'

const noop = () => { }

export const AuthContext = createContext({
    role: null,
    token: null,
    userId: null,
    user: null,
    login: noop,
    logout: noop,
    isAuthenticated: false
})