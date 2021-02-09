import { useState, useCallback, useEffect } from 'react'


const storageName = 'userData'


export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [role, setRole] = useState(null)
    const [user, setUser] = useState(null)
    const [ready, setReady] = useState(false)
    const [userId, setUserId] = useState(null)

    const updateUser = useCallback((user) => {
        setUser(user)
        const data = JSON.parse(localStorage.getItem(storageName))
        localStorage.setItem(storageName, JSON.stringify({ ...data, user }))
    }, [])

    const login = useCallback((jwtToken, id, user, role) => {

        setRole(role)
        setToken(jwtToken)
        setUserId(id)
        setUser(user)
        localStorage.setItem(storageName, JSON.stringify({
            userId: id, token: jwtToken, user, role
        }))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)
        setRole(null)
        setUser(null)
        localStorage.removeItem(storageName)
        window.location.reload()
    }, [])

    useEffect(() => {

        const data = JSON.parse(localStorage.getItem(storageName))
        if (data && data.token) {
            login(data.token, data.userId, data.user, data.role)
        }
        setReady(true)
    }, [login])

    return { login, logout, token, userId, ready, user, role, updateUser }
}