import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getTestsBiPupilId } from '../redux/actions'


export const TestsPage = () => {
    const dispatch = useDispatch()
    const { tests } = useSelector(state => state.test)

    useEffect(() => {
        dispatch(getTestsBiPupilId())
    }, [dispatch])

    const formatDate = useCallback(date => {
        const newDate = new Date(date).toLocaleString('ru', {
            hour: 'numeric',
            minute: 'numeric',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
        return newDate
    }, [])

    if (!tests.length) {
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
                                if (!test.condition) return null
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
                            if (!test.condition) return null
                            return (
                                <Link to={`/solutions/${test._id}`} key={index} className="tests-page__passed-test">
                                    <p className="list__desc tests-page__date">{formatDate(test.date)}</p>
                                    <div className="list__item">
                                        <p>{test.condition.name}</p>
                                        <p className="list__desc"
                                            dangerouslySetInnerHTML={{ __html: test.condition.desc.slice(0, 64) + ' ...' }} />
                                    </div>
                                </Link>)
                        }
                        return null
                    })}
                </div>
            </div>
        </div>
    )

}