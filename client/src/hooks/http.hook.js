import { useState, useCallback } from 'react'
import { useAuth } from './auth.hook'


export const useHttp = () => {
    const { logout } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true)
        try {

            // if (body) {
            //     body = JSON.stringify(body)
            //     headers['Content-Type'] = 'application/json'
            // }

            const response = await fetch(url, {
                // mode: 'no-cors', 
                // credentials: 'include',
                method, headers, body
            })

            if (response.status === 401) {
                logout()
            }

            if (response.headers.get('content-type').includes('application/json')) {
                try {
                    const data = await response.json()
                    if (!response.ok) {
                        throw new Error(data.message || 'Что-то пошло не так')
                    }

                    setLoading(false)
                    return data

                } catch (e) { throw e }
            }

            try {
                const data = await response.text()

                if (!response.ok) {
                    throw new Error('Что-то пошло не так')
                }

                setLoading(false)
                return data

            } catch (e) { throw e }

        } catch (e) {
            setLoading(false)
            setError(e.message)
            throw e
        }
    }, [logout])

    const clearError = useCallback(() => setError(null), [])

    return { loading, error, request, clearError }
}