import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { getTestsBiPupilId } from '../redux/actions'
import { Info } from '../components/Info'


export const TestsPage = () => {
    let history = useHistory()
    const dispatch = useDispatch()
    const [info, setInfo] = useState(null)
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

    const infoBtnHandler = useCallback(e => {
        if (!info) {
            e.stopPropagation()
            const iter = e.target.id
            setInfo({
                name: tests[iter].condition.name,
                desc: tests[iter].condition.desc
            })
        } else {
            setInfo(null)
        }
    }, [info, tests])

    if (!tests.length) {
        return null
    }

    if (info) {
        return <Info name={info.name} desc={info.desc} handler={infoBtnHandler} />
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
                                    <div
                                        key={index}
                                        className="list__item"
                                        onClick={() => { history.push(`/tests/${test._id}/${test.condition.id}`) }}>
                                        <button id={index} className="list__info-btn" onClick={infoBtnHandler}></button>
                                        <p>{test.condition.name}</p>
                                        <p className="list__desc"
                                            dangerouslySetInnerHTML={{ __html: test.condition.desc.slice(0, 64) + ' ...' }} />
                                    </div>)
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
                                <div key={index} className="tests-page__passed-test" style={{ position: 'relative' }}>
                                    <p className="list__desc tests-page__date">{formatDate(test.date)}</p>
                                    {test.isVisible && <span className='list__desc'
                                        style={{ position: 'absolute', top: 0, right: 0, }}>
                                        Результат доступен</span>}
                                    <div
                                        className="list__item"
                                        onClick={() => { test.isVisible && history.push(`/solutions/${test._id}`) }}>
                                        <button id={index} className="list__info-btn" onClick={infoBtnHandler}></button>
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