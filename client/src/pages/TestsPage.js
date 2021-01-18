import React, { useState, useContext, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'


export const TestsPage = () => {
    const [tests, setTests] = useState(null)
    const { request } = useHttp()
    const { token } = useContext(AuthContext)

    const getTests = useCallback(async () => {
        try {
            const fetched = await request(`/api/tests`, 'GET', null, {
                'Authorization': `Bearer ${token}`
            })
            setTests(fetched)
        } catch (e) {
        }
    }, [request, token])

    useEffect(() => {
        getTests()
    }, [getTests])

    if (!tests) {
        return null
    }

    return (
        <div className="page tests-page">
            <header className="page__header">
                <Link to='/' className="icon-btn page__icon-btn page__icon-btn_left icon-btn_back"></Link>
                <p className="page__title tests-page__title">Тесты</p>
            </header>

            <div className="tests-page__main">
                <div>
                    <p className="tests-page__main-title">Не пройденные</p>
                    <div className="list">
                        {tests.map((test, index) => {
                            if (!test.solution) {
                                return (
                                    <Link key={index} to={`/tests/${test._id}/${test.condition.id}`} className="list__item">
                                        <p>{test.condition.name}</p>
                                        <p className="list__desc"
                                            dangerouslySetInnerHTML={{ __html: test.condition.desc.slice(0, 64) + ' ...' }} />
                                    </Link>)
                            }
                            return null
                        })}
                    </div>
                </div>
            </div>

            <div className="tests-page__passed">
                <p className="tests-page__passed-title">Пройденные тесты</p>
                <div className="list">
                    {tests.map((test, index) => {
                        if (test.solution) {
                            return (
                                <div key={index} className="tests-page__passed-test">
                                    <p className="list__desc tests-page__date">{test.date}</p>
                                    <div className="list__item">
                                        <p>{test.condition.name}</p>
                                        <p className="list__desc"
                                            dangerouslySetInnerHTML={{ __html: test.condition.desc.slice(0, 64) + ' ...' }} />
                                    </div>
                                </div>)
                        }
                        return null
                    })}
                </div>
            </div>
        </div>
    )

}