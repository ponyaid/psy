import React, { useState, useCallback, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { ProgressBar } from '../components/ProgressBar'
import { AuthContext } from '../context/AuthContext'


export const CreateTestPage = () => {
    const [step, setStep] = useState(1)
    const [conditionId, setConditionId] = useState(null)
    const [schoolId, setSchoolId] = useState(null)
    const [classId, setClassId] = useState(null)

    const [conditions, setConditions] = useState([])
    const [schools, setSchools] = useState([])
    const [classes, setClasses] = useState([])
    const [group, setGroup] = useState(null)
    const [pupils, setPupils] = useState([])
    const [selectAll, setSelectAll] = useState(false)

    const { token } = useContext(AuthContext)
    const history = useHistory()
    const { request } = useHttp()

    const getConditions = useCallback(async () => {
        try {
            const fetched = await request('/api/conditions', 'GET', null)
            setConditions(fetched)
        } catch (e) { }
    }, [request, setConditions])

    const getSchools = useCallback(async () => {
        try {
            const fetched = await request('/api/schools', 'GET', null,
                { 'Authorization': `Bearer ${token}` })
            setSchools(fetched)
        } catch (e) { }
    }, [request, token])

    const getClasses = useCallback(async () => {
        try {
            const fetched = await request(`/api/schools/${schoolId}`, 'GET', null,
                { 'Authorization': `Bearer ${token}` })
            setClasses(fetched.classes)
        } catch (e) { }
    }, [request, token, schoolId])

    const getGroup = useCallback(async () => {
        try {
            const fetched = await request(`/api/classes/${classId}`, 'GET', null,
                { 'Authorization': `Bearer ${token}` })
            setGroup(fetched)
        } catch (e) { }
    }, [request, token, classId])

    const postTests = useCallback(async () => {
        try {
            const fetched = await request('/api/tests/create', 'POST',
                JSON.stringify({ conditionId, pupils }), {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
            alert(fetched.message)
            history.push('/')
        } catch (e) { }
    }, [conditionId, history, pupils, request, token])


    useEffect(() => {
        getConditions()
        getSchools()
    }, [getConditions, getSchools])

    useEffect(() => {
        if (schoolId) {
            getClasses()
        }
    }, [getClasses, schoolId])

    useEffect(() => {
        if (classId) {
            getGroup()
        }
    }, [getGroup, classId])

    const conditionsHandler = (evt) => {
        setConditionId(evt.currentTarget.id)
        setStep(step + 1)
    }

    const schoolsHandler = (evt) => {
        setSchoolId(evt.currentTarget.id)
        setStep(step + 1)
    }

    const classesHandler = (evt) => {
        setClassId(evt.currentTarget.id)
        setStep(step + 1)
    }

    const backBtnHandler = () => {
        if (step < 2) {
            history.push(`/`)
        }
        setStep(step - 1)
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
            for (let pupil of group.pupils) {
                array.push(pupil._id)
            }
            setSelectAll(true)
            setPupils(array)
        }
    }

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

            <TestsStep step={step} conditions={conditions} clickHandler={conditionsHandler} />

            <SchoolsStep step={step} schools={schools} clickHandler={schoolsHandler} />

            <ClassesStep step={step} classes={classes} clickHandler={classesHandler} />

            <PupilsStep step={step} group={group} pupils={pupils} selectAllHandler={selectAllHandler}
                checkboxHandler={checkboxHandler} clickHandler={sendHandler} selectAll={selectAll} />

        </div>
    )
}


const TestsStep = props => {
    if (props.step !== 1) {
        return null
    }

    return (
        <div className="page__content">
            <h3>Выберете тест</h3>
            <ul className="list">
                {
                    props.conditions.map((condition) => {
                        return (
                            <li onClick={props.clickHandler} className="list__item"
                                key={condition.id} id={condition.id}>
                                <p>{condition.name}</p>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

const SchoolsStep = props => {
    if (props.step !== 2) {
        return null
    }

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

    return (
        <div className="page__content">
            <h3>Выберете класс</h3>
            <ul className="list">
                {
                    props.classes.map((group) => {
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
    if (props.step !== 4 || !props.group) {
        return null
    }

    return (
        <div className="page__content">
            <h3>Выберете учеников</h3>
            <p className="page__desc">
                {props.group.number}{props.group.letter}, всего {props.group.pupils.length} учеников</p>
            <p className={`select-all ${props.selectAll ? 'select-all_active' : null}`}
                onClick={props.selectAllHandler}>Выбрать всех</p>
            <div className="list">
                {
                    props.group.pupils.map((pupil) => {
                        return (
                            <div key={pupil._id} className="list__checkbox">
                                <input id={pupil._id} type="checkbox" name={pupil._id}
                                    checked={props.pupils.includes(pupil._id)}
                                    onChange={props.checkboxHandler} value={pupil._id} />
                                <label htmlFor={pupil._id}>
                                    <div>
                                        <p>{pupil.name} {pupil.surname}</p>
                                        <p className="list__desc">{props.group.school.name},&nbsp;
                                        {props.group.number}{props.group.letter}</p>
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