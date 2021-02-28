import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Range } from '../components/Range'


export const StatisticPage = () => {
    const { token } = useSelector(state => state.auth)
    const [conditions, setConditions] = useState(null)
    const [conditionId, setConditionId] = useState(null)

    useEffect(() => {
        let headers = {}
        headers['Authorization'] = `Bearer ${token}`
        fetch('/api/statistic/conditions', { headers: headers })
            .then(res => res.json())
            .then(res => setConditions(res))
    }, [token])

    const nullStatusCounter = useCallback((tests) => {
        let count = 0
        for (let test of tests) test.normStatus === undefined && count++
        return count
    }, [])

    const normStatusCounter = useCallback((tests) => {
        let count = 0
        for (let test of tests) test.normStatus === true && count++
        return count
    }, [])

    const notNormStatusCounter = useCallback((tests) => {
        let count = 0
        for (let test of tests) test.normStatus === false && count++
        return count
    }, [])

    const conditionHandler = useCallback(id => {
        setConditionId(id)
    }, [])

    if (!conditions) return null

    if (conditionId) {
        return <StatisticDitails conditionId={conditionId} handler={conditionHandler} />
    }

    return (
        <div className="page">
            <header className="page__header">
                <Link to='/' className="icon-btn page__icon-btn page__icon-btn_left icon-btn_back"></Link>
                <p className="page__title">Статистика</p>
            </header>
            <div>
                {conditions.map(condition =>
                    <div key={condition._id}
                        className="statistic-condition"
                        onClick={() => conditionHandler(condition._id)}>
                        <p className="statistic-condition__title">{condition.conditionName[0]}</p>
                        <Range
                            total={condition.tests.length}
                            norm={normStatusCounter(condition.tests)}
                            notNorm={notNormStatusCounter(condition.tests)}
                        />
                        <div className="statistic-condition__footer">
                            <span className="statistic-condition__indicator green">{normStatusCounter(condition.tests)}</span>
                            <span className="statistic-condition__indicator red">{notNormStatusCounter(condition.tests)}</span>
                            <span className="statistic-condition__indicator blue">{nullStatusCounter(condition.tests)}</span>
                            <p className="statistic-condition__members">{condition.tests.length} участников</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}


const StatisticDitails = ({ conditionId, handler }) => {
    const { token } = useSelector(state => state.auth)
    const [statutes, setStatutes] = useState(null)
    const [norm, setNorm] = useState([])
    const [notNorm, setNotNorm] = useState([])
    const [nullNorm, setNullNorm] = useState([])

    useEffect(() => {
        let headers = {}
        headers['Authorization'] = `Bearer ${token}`
        fetch(`/api/statistic/conditions/${conditionId}`, { headers: headers })
            .then(res => res.json())
            .then(res => {
                for (let status of res) {
                    status._id === false && setNotNorm(status.tests)
                    status._id === true && setNorm(status.tests)
                    status._id === null && setNullNorm(status.tests)
                }
                setStatutes(res)
            })
    }, [conditionId, token])

    if (!statutes) return null

    return (
        <div className="page statistic-details-page">
            <header className="page__header">
                <button
                    onClick={() => handler(null)}
                    className="icon-btn page__icon-btn page__icon-btn_left icon-btn_back"></button>
                <p className="page__title statistic-details-page__title">Статистика</p>
            </header>

            <div className="statistic-details-page__main">
                <div key={statutes[0].tests.conditionId} className="statistic-condition" >
                    <p className="statistic-condition__title">{statutes[0].tests[0].condition[0].name}</p>
                    <Range
                        total={nullNorm.length + norm.length + notNorm.length}
                        norm={norm.length}
                        notNorm={notNorm.length}
                    />
                    <div className="statistic-condition__footer">
                        <span className="statistic-condition__indicator green">{norm.length}</span>
                        <span className="statistic-condition__indicator red">{notNorm.length}</span>
                        <span className="statistic-condition__indicator blue">{nullNorm.length}</span>
                        <p className="statistic-condition__members">{nullNorm.length + norm.length + notNorm.length} участников</p>
                    </div>
                </div>
            </div>

            <div className="statistic-pupils">
                <div className="statistic-pupils__wrapper">
                    <div className="statistic-pupils__group">
                        <div className="statistic-pupils__header">
                            <p className="statistic-pupils__title blue">Не проходили тест</p>
                            <span className="statistic-pupils__count">{nullNorm.length}</span>
                        </div>
                        <div>
                            {
                                nullNorm.map((pupil, index) =>
                                    <div key={index} className="statistic-pupils__item">
                                        {/* <img src="" alt="pic" className="statistic-pupils__pic" /> */}
                                        <div>
                                            <p className="statistic-pupils__name">{pupil.pupil[0].name} {pupil.pupil[0].surname}</p>
                                            <p className="statistic-pupils__details">
                                                {pupil.school[0].name}, {pupil.class[0].number}{pupil.class[0].letter}</p>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>

                    <div className="statistic-pupils__group">
                        <div className="statistic-pupils__header">
                            <p className="statistic-pupils__title green">Положительный показатель</p>
                            <span className="statistic-pupils__count">{norm.length}</span>
                        </div>
                        <div>
                            {
                                norm.map((pupil, index) =>
                                    <div key={index} className="statistic-pupils__item">
                                        {/* <img src="" alt="pic" className="statistic-pupils__pic" /> */}
                                        <div>
                                            <p className="statistic-pupils__name">{pupil.pupil[0].name} {pupil.pupil[0].surname}</p>
                                            <p className="statistic-pupils__details">
                                                {pupil.school[0].name}, {pupil.class[0].number}{pupil.class[0].letter}</p>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>

                    <div className="statistic-pupils__group">
                        <div className="statistic-pupils__header">
                            <p className="statistic-pupils__title red">Отрицательный показатель</p>
                            <span className="statistic-pupils__count">{notNorm.length}</span>
                        </div>
                        <div>
                            {
                                notNorm.map((pupil, index) =>
                                    <Link to={`/solutions/${pupil._id}`} key={index} className="statistic-pupils__item">
                                        {/* <img src="" alt="pic" className="statistic-pupils__pic" /> */}
                                        <div>
                                            <p className="statistic-pupils__name">{pupil.pupil[0].name} {pupil.pupil[0].surname}</p>
                                            <p className="statistic-pupils__details">
                                                {pupil.school[0].name}, {pupil.class[0].number}{pupil.class[0].letter}</p>
                                        </div>
                                    </Link>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}