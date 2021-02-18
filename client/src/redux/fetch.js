import { isExpired } from 'react-jwt'
import { LOGOUT } from "./types"


// eslint-disable-next-line import/no-anonymous-default-export
export default async function (url, init, getState, dispatch) {
    init = { ...init, "credentials": "include" }
    let { token } = getState().auth

    const isMyTokenExpired = isExpired(token)
    if (isMyTokenExpired) {
        return dispatch({type: LOGOUT})
    }

    let headers = { ...init.headers }
    headers['Authorization'] = `Bearer ${token}`

    const response = await fetch(url, { ...init, headers: headers })
    const json = await response.json()

    if (!response.ok) {
        throw new Error(json.message || 'Что-то пошло не так')
    }

    return json
}