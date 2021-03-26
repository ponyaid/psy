import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Range } from '../components/Range'
import { Loader } from '../components/Loader'
import { FINISH_LOADING, START_LOADING } from '../redux/types'


export const StatisticPage = () => {
    const dispatch = useDispatch()
    const { token } = useSelector(state => state.auth)
    const { loading } = useSelector(state => state.app)
    const [conditions, setConditions] = useState(null)
    const [conditionId, setConditionId] = useState(null)
    const [schoolId, setSchoolId] = useState(null)
    const [classId, setClassId] = useState(null)

    useEffect(() => {
        if (classId) {
            dispatch({ type: START_LOADING })
            let headers = {}
            headers['Authorization'] = `Bearer ${token}`
            fetch(`/api/statistic/conditions/${classId}`, { headers: headers })
                .then(res => res.json())
                .then(res => {
                    setConditions(res)
                    dispatch({ type: FINISH_LOADING })
                })
        }
    }, [token, dispatch, classId])

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

    const schoolHandler = useCallback(id => {
        setSchoolId(id)
    }, [])

    const classHandler = useCallback(id => {
        setClassId(id)
    }, [])


    if (!schoolId) return <SchoolFilter
        nullStatusCounter={nullStatusCounter}
        normStatusCounter={normStatusCounter}
        notNormStatusCounter={notNormStatusCounter}
        schoolHandler={schoolHandler}
    />

    if (schoolId && !classId) return <ClassFilter
        schoolId={schoolId}
        classHandler={classHandler}
        nullStatusCounter={nullStatusCounter}
        normStatusCounter={normStatusCounter}
        notNormStatusCounter={notNormStatusCounter}
        classBackHandler={schoolHandler}
    />

    if (loading) return <Loader />

    if (!conditions) return null

    if (conditionId) {
        return <StatisticDitails
            conditionId={conditionId}
            handler={conditionHandler}
            classId={classId}
        />
    }

    return (
        <div className="page">
            <header className="page__header">
                <button
                    onClick={() => classHandler(null)}
                    className="icon-btn page__icon-btn page__icon-btn_left icon-btn_back"></button>
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


const StatisticDitails = ({ conditionId, handler, classId }) => {
    const { token } = useSelector(state => state.auth)
    const [statutes, setStatutes] = useState(null)
    const [norm, setNorm] = useState([])
    const [notNorm, setNotNorm] = useState([])
    const [nullNorm, setNullNorm] = useState([])

    useEffect(() => {
        let headers = {}
        headers['Authorization'] = `Bearer ${token}`
        fetch(`/api/statistic/conditions/${classId}/${conditionId}`, { headers: headers })
            .then(res => res.json())
            .then(res => {
                for (let status of res) {
                    status._id === false && setNotNorm(status.tests)
                    status._id === true && setNorm(status.tests)
                    status._id === null && setNullNorm(status.tests)
                }
                setStatutes(res)
            })
    }, [classId, conditionId, token])

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

                    <div className="statistic-pupils__group">
                        <div className="statistic-pupils__header">
                            <p className="statistic-pupils__title green">Положительный показатель</p>
                            <span className="statistic-pupils__count">{norm.length}</span>
                        </div>
                        <div>
                            {
                                norm.map((pupil, index) =>
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


const SchoolFilter = ({ schoolHandler, nullStatusCounter, normStatusCounter, notNormStatusCounter }) => {
    const dispatch = useDispatch()
    const { token } = useSelector(state => state.auth)
    const { loading } = useSelector(state => state.app)
    const [schools, setSchools] = useState(null)

    useEffect(() => {
        dispatch({ type: START_LOADING })
        let headers = {}
        headers['Authorization'] = `Bearer ${token}`
        fetch(`/api/statistic/for-schools`, { headers: headers })
            .then(res => res.json())
            .then(res => {
                setSchools(res)
                dispatch({ type: FINISH_LOADING })
            })

    }, [dispatch, token])

    if (loading) {
        return <Loader />
    }

    if (!schools) return null

    return (
        <div className="page">
            <header className="page__header">
                <Link to='/' className="icon-btn page__icon-btn page__icon-btn_left icon-btn_back"></Link>
                <p className="page__title">Статистика</p>
            </header>

            <div>
                {schools.map((school, index) => (
                    <div
                        key={index}
                        className="statistic-condition"
                        onClick={() => schoolHandler(school._id)}>
                        <p className="statistic-condition__title">{school.schoolName[0]}</p>

                        <Range
                            total={school.tests.length}
                            norm={normStatusCounter(school.tests)}
                            notNorm={notNormStatusCounter(school.tests)}
                        />
                        <div className="statistic-condition__footer">
                            <span className="statistic-condition__indicator green">{normStatusCounter(school.tests)}</span>
                            <span className="statistic-condition__indicator red">{notNormStatusCounter(school.tests)}</span>
                            <span className="statistic-condition__indicator blue">{nullStatusCounter(school.tests)}</span>
                            <p className="statistic-condition__members">{school.tests.length} участников</p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}


const ClassFilter = ({
    schoolId,
    classHandler,
    nullStatusCounter,
    normStatusCounter,
    notNormStatusCounter,
    classBackHandler }) => {
    const dispatch = useDispatch()
    const { token } = useSelector(state => state.auth)
    const { loading } = useSelector(state => state.app)
    const [classes, setClasses] = useState(null)

    useEffect(() => {
        if (schoolId) {
            dispatch({ type: START_LOADING })
            let headers = {}
            headers['Authorization'] = `Bearer ${token}`
            fetch(`/api/statistic/for-classes/${schoolId}`, { headers: headers })
                .then(res => res.json())
                .then(res => {
                    setClasses(res)
                    dispatch({ type: FINISH_LOADING })
                })
        }
    }, [dispatch, schoolId, token])

    if (loading) {
        return <Loader />
    }

    if (!classes) return null

    return (
        <div className="page">
            <header className="page__header">
                <button
                    onClick={() => classBackHandler(null)}
                    className="icon-btn page__icon-btn page__icon-btn_left icon-btn_back"></button>
                <p className="page__title">Статистика</p>
            </header>
            <div>
                {classes.map((group, index) => (
                    <div
                        key={index}
                        className="statistic-condition"
                        onClick={() => classHandler(group._id)}>
                        <p className="statistic-condition__title">{group.classNumber[0]} {group.classLetter[0]}</p>

                        <Range
                            total={group.tests.length}
                            norm={normStatusCounter(group.tests)}
                            notNorm={notNormStatusCounter(group.tests)}
                        />
                        <div className="statistic-condition__footer">
                            <span className="statistic-condition__indicator green">{normStatusCounter(group.tests)}</span>
                            <span className="statistic-condition__indicator red">{notNormStatusCounter(group.tests)}</span>
                            <span className="statistic-condition__indicator blue">{nullStatusCounter(group.tests)}</span>
                            <p className="statistic-condition__members">{group.tests.length} участников</p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}