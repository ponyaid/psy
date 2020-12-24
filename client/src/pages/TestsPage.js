import React, { useCallback, useState, useEffect } from 'react'
import { useHttp } from '../hooks/http.hook'
import { Link } from 'react-router-dom'


export const TestsPage = () => {
    const [tests, setTests] = useState([])
    const { request } = useHttp()

    const getTests = useCallback(async () => {
        try {
            const fetched = await request('/api/tests', 'GET', null)
            setTests(fetched)
        } catch (e) {
        }
    }, [request, setTests])

    useEffect(() => {
        getTests()
    }, [getTests])

    if (!tests) {
        return null
    }

    return (
        <div className="page tests-wrapper">
            <p className="page__title">Пройти тест</p>
            <div className="tests">
                <p className="tests__title">Выберете тест</p>
                <ul className="tests__list">
                    {
                        tests.map((test, index) => {
                            return (
                                <li key={index} className="tests__item">
                                    <Link to={`/tests/${test['id']}`}>{test['name']}</Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
}