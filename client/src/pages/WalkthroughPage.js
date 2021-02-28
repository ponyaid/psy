import React, { useState, useEffect, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { useDispatch, useSelector } from 'react-redux'
import { getCondition, hideAlert, showAlert } from '../redux/actions'
import { Loader } from '../components/Loader'
import { FINISH_LOADING, START_LOADING } from '../redux/types'


export const WalkthroughPage = () => {
    const dispatch = useDispatch()
    const { request } = useHttp()

    const { user } = useSelector(state => state.auth)
    const { condition } = useSelector(state => state.test)
    const { loading } = useSelector(state => state.app)

    const [questionId, setQuestionId] = useState(0)
    const [questions, setQuestions] = useState([])
    const [question, setQuestion] = useState(null)
    const [results, setResults] = useState([])
    const [answer, setAnswer] = useState([])
    const [end, setEnd] = useState(false)
    const [normStatus, setNormStatus] = useState(true)

    const conditionId = useParams().conditionId
    const testId = useParams().testId

    useEffect(() => {
        dispatch(getCondition(conditionId))
    }, [conditionId, dispatch])

    const postSolution = useCallback(async () => {
        dispatch({ type: START_LOADING })
        const xml = condition.xml
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(xml, 'text/xml')

        for (let i = 0; i < results.length; i++) {
            const an = xmlDoc.getElementById(results[i])
            an.setAttribute('selected', true)
        }

        xmlDoc.querySelector('root').setAttribute('birthdate', '01.01.2000')
        xmlDoc.querySelector('root').setAttribute('fio', user.name)
        xmlDoc.querySelector('root').setAttribute('gender', user.sex)

        var oSerializer = new XMLSerializer()
        var sXML = oSerializer.serializeToString(xmlDoc)

        try {
            fetch('http://185.68.101.64/SychoDB/hs/TestsExchange/SendTests', {
                method: 'POST',
                body: sXML
            })
                .then(res => res.text())
                .then(res => {

                    const parser = new DOMParser()
                    const document = parser.parseFromString(res, 'text/html')

                    const table = document.querySelectorAll('table')[1]
                    const array = Array.from(table.querySelectorAll('tr')).slice(1)


                    for (let item of array) {
                        const tds = item.querySelectorAll('td')
                        if (tds[1].querySelector('font').getAttribute('color') !== 'black') {
                            setNormStatus(false)
                        }
                    }

                    request('/api/tests/solution', 'POST',
                        JSON.stringify({ solution: res, testId, normStatus }), {
                        'Content-Type': 'application/json',
                    })

                    dispatch({ type: FINISH_LOADING })

                    dispatch(showAlert({ type: 'success', text: 'Тест пройден' }))

                    setTimeout(() => {
                        dispatch(hideAlert())
                        window.location.href = `/solutions/${testId}`
                    }, 2000)
                })

        } catch (e) {
            dispatch({ type: FINISH_LOADING })
            dispatch(showAlert({ type: 'error', text: e }))
        }

    }, [condition, user, results, request, testId, dispatch, normStatus])

    useEffect(() => {
        !!end && postSolution()
    }, [end, postSolution])

    useEffect(() => {
        if (condition) {
            const body = JSON.parse(condition.body)
            const qws = body['root']['test'][0]['section'][0]['qw']
            setQuestions(qws)
        }
    }, [condition])

    useEffect(() => {
        if (questions.length) {
            const qw = questions[questionId]
            setQuestion({
                name: qw.$.name,
                ans: qw.an
            })
            setAnswer([])
        }
    }, [questionId, questions])

    const confirmBtnHandler = () => {
        if (answer.length) {
            const updatedResults = [...results, ...answer]
            setResults(updatedResults)

            if (questionId + 1 !== questions.length) {
                setQuestionId(questionId + 1)
            } else {
                setEnd(!end)
            }
        }
    }

    if (!question) { return null }

    if (loading) { return <Loader /> }

    return (
        <div className="page walkthrough">
            <header className="page__header">
                <Link to='/' className="icon-btn page__icon-btn page__icon-btn_left icon-btn_close"></Link>
                <div className="walkthrough__score">
                    <p>{questionId + 1}</p>
                    <p>{questions.length}</p>
                </div>
            </header>

            <div className="progress-bar walkthrough__progress-bar">
                <span className="progress-bar__progress"
                    style={{ 'width': `${(questionId + 1) * 100 / questions.length}%` }}
                />
            </div>
            <p className="walkthrough__title">{question.name ? question.name : 'Выберите один вариант ответа'}</p>
            <div className="answers-wrapper">
                <p className="answers-wrapper__prompt">Нажми на подходящий ответ</p>
                <div className="answers">
                    {
                        question.ans.map((elem, index) => {
                            return (
                                <label className="answers__item" key={index}>
                                    <input
                                        type="radio" value={elem.$.id}
                                        checked={answer[0] === elem.$.id}
                                        onChange={e => { setAnswer([e.target.value]) }} />
                                    <span>{elem.$.name}</span>
                                </label>
                            )
                        })
                    }
                </div>
                <button onClick={confirmBtnHandler} className={
                    `answers-wrapper__confirm-btn 
                    ${answer.length ? 'answers-wrapper__confirm-btn_active' : null}`}></button>
            </div>
        </div>
    )
}