import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { ProgressBar } from '../components/ProgressBar'
import { Loader } from '../components/Loader'
import {
    getConditionsINedded,
    getSchoolsINedded,
    changeConditionId,
    getSchoolINedded,
    getClassINedded,
    stepUp,
    stepDown,
    showAlert,
    hideAlert
} from '../redux/actions'
import { STEP_RESET } from '../redux/types'


export const CreateTestPage = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const { step, conditions, conditionId } = useSelector(state => state.test)
    const { schools, schoolData, classData } = useSelector(state => state.school)
    const { loading } = useSelector(state => state.app)
    const { token } = useSelector(state => state.auth)
    const [selectAll, setSelectAll] = useState(false)
    const [pupils, setPupils] = useState([])
    const { request } = useHttp()

    useEffect(() => {
        dispatch(getConditionsINedded())
        dispatch(getSchoolsINedded())
    }, [dispatch])

    const backBtnHandler = () => {
        if (step < 2) {
            history.push(`/`)
        } else {
            dispatch(stepDown())
        }
    }

    const conditionsHandler = (evt) => {
        dispatch(changeConditionId(evt.currentTarget.id))
        dispatch(stepUp())
    }

    const schoolsHandler = (evt) => {
        dispatch(getSchoolINedded(evt.currentTarget.id))
        dispatch(stepUp())
    }

    const classesHandler = (evt) => {
        dispatch(getClassINedded(evt.currentTarget.id))
        dispatch(stepUp())
    }

    const checkboxHandler = evt => {
        const array = [...pupils]
        const index = array.indexOf(evt.target.name)

        if (index > -1) {
            array.splice(index, 1)
        } else {
            array.push(evt.target.name)
        }
        setSelectAll(false)
        setPupils(array)
    }

    const selectAllHandler = () => {
        if (selectAll) {
            setPupils([])
            setSelectAll(false)
        } else {
            const array = []
            for (let pupil of classData.pupils) {
                array.push(pupil._id)
            }
            setSelectAll(true)
            setPupils(array)
        }
    }

    const postTests = useCallback(async () => {
        try {
            const fetched = await request('/api/tests/create', 'POST',
                JSON.stringify({ conditionId, pupils }), {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })

            dispatch(showAlert({ type: 'success', text: fetched.message }))

            setTimeout(() => {
                dispatch(hideAlert())
                dispatch({ type: STEP_RESET })
            }, 2000)

        } catch (e) {
            dispatch(showAlert({ type: 'error', text: e.message }))
        }
    }, [conditionId, pupils, request, token, dispatch])

    const sendHandler = () => {
        postTests()
    }

    return (
        <div className="page create-test">
            <header className="page__header">
                <button to="/" className="icon-btn page__icon-btn page__icon-btn_left icon-btn_back"
                    onClick={backBtnHandler}></button>
                <p className="page__title">Отправить тест</p>
            </header>

            <ProgressBar step={step} total={5} color='red' />

            <TestsStep step={step} loading={loading} conditions={conditions} clickHandler={conditionsHandler} />

            <SchoolsStep step={step} loading={loading} schools={schools} clickHandler={schoolsHandler} />

            <ClassesStep loading={loading} step={step} schoolData={schoolData} clickHandler={classesHandler} />

            <PupilsStep step={step} classData={classData} pupils={pupils} loading={loading}
                selectAllHandler={selectAllHandler}
                checkboxHandler={checkboxHandler}
                clickHandler={sendHandler}
                selectAll={selectAll}
            />

        </div>
    )
}


const TestsStep = props => {
    if (props.step !== 1) { return null }

    if (props.loading) { return <Loader /> }

    return (
        <div className="page__content">
            <h3>Выберете тест</h3>
            <ul className="list">
                {
                    props.conditions.map((condition) => {
                        return (
                            <li onClick={props.clickHandler} className="list__item"
                                key={condition.id} id={condition.id}><p>{condition.name}</p>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

const SchoolsStep = props => {
    if (props.step !== 2) { return null }

    if (props.loading) { return <Loader /> }

    return (
        <div className="page__content">
            <h3>Выберете школу</h3>
            <ul className="list">
                {
                    props.schools.map((school) => {
                        return (
                            <li onClick={props.clickHandler} className="list__item"
                                key={school._id} id={school._id}>
                                <p>{school.name}</p>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

const ClassesStep = props => {
    if (props.step !== 3) { return null }

    if (props.loading || !props.schoolData) { return <Loader /> }

    return (
        <div className="page__content">
            <h3>Выберете класс</h3>
            <ul className="list">
                {
                    props.schoolData.classes.map((group) => {
                        return (
                            <li onClick={props.clickHandler} className="list__item"
                                key={group._id} id={group._id}>
                                <p>{group.number}{group.letter}</p>
                                <p className="list__desc">{group.pupils.length} участников</p>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

const PupilsStep = props => {
    if (props.step !== 4) { return null }

    if (props.loading || !props.classData) { return <Loader /> }

    const group = props.classData

    return (
        <div className="page__content">
            <h3>Выберете учеников</h3>
            <p className="page__desc">
                {group.number}{group.letter}, всего {group.pupils.length} учеников</p>
            <p className={`select-all ${props.selectAll ? 'select-all_active' : null}`}
                onClick={props.selectAllHandler}>Выбрать всех</p>
            <div className="list">
                {
                    group.pupils.map((pupil) => {
                        return (
                            <div key={pupil._id} className="list__checkbox">
                                <input id={pupil._id} type="checkbox" name={pupil._id}
                                    checked={props.pupils.includes(pupil._id)}
                                    onChange={props.checkboxHandler} value={pupil._id} />
                                <label htmlFor={pupil._id}>
                                    <div>
                                        <p>{pupil.name} {pupil.surname}</p>
                                        <p className="list__desc">{group.school.name},&nbsp;
                                        {group.number}{group.letter}</p>
                                    </div>
                                </label>
                            </div>
                        )
                    })
                }
            </div>
            <div className="send-btn">
                <button onClick={props.clickHandler} className="main-btn">Отправить</button>
            </div>
        </div>
    )
}