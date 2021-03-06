import React, { useState, useEffect, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getCondition, showAlert } from '../redux/actions'
import { Loader } from '../components/Loader'
import { FINISH_LOADING, START_LOADING } from '../redux/types'


export const WalkthroughPage = () => {
    const dispatch = useDispatch()

    const { user } = useSelector(state => state.auth)
    const { condition } = useSelector(state => state.test)
    const { loading } = useSelector(state => state.app)

    const [questionId, setQuestionId] = useState(0)
    const [questions, setQuestions] = useState([])
    const [question, setQuestion] = useState(null)
    const [results, setResults] = useState([])
    const [answer, setAnswer] = useState([])
    const [end, setEnd] = useState(false)

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

                    let status = true

                    if (!['4', '216', '213'].includes(conditionId)) {
                        for (let item of array) {
                            const tds = item.querySelectorAll('td')
                            if (!tds[1].querySelector('font')
                                || tds[1].querySelector('font').getAttribute('color') !== 'black') {
                                status = false
                            }
                        }
                    }

                    return fetch('/api/tests/solution', {
                        method: 'POST',
                        body: JSON.stringify({ solution: res, testId, normStatus: status }),
                        headers: { 'Content-Type': 'application/json' }
                    })
                })
                .then(() => {
                    dispatch({ type: FINISH_LOADING })
                    window.location.href = `/`
                })

        } catch (e) {
            dispatch({ type: FINISH_LOADING })
            dispatch(showAlert({ type: 'error', text: e }))
        }

    }, [condition, user, results, testId, conditionId, dispatch])

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

            if (conditionId === '209') {
                qw.an.pop()
            }

            setQuestion({
                name: qw.$.name,
                ans: qw.an
            })

            setAnswer([])
        }
    }, [conditionId, questionId, questions])

    const confirmBtnHandler = useCallback(() => {
        if (answer.length) {
            const updatedResults = [...results, ...answer]
            setResults(updatedResults)

            if (questionId + 1 !== questions.length) {
                setQuestionId(questionId + 1)
            } else {
                setEnd(!end)
            }
        }
    }, [answer, end, questionId, questions, results])

    const setNewAnswer = useCallback(value => {
        setAnswer([value])
    }, [])

    if (!question) return null

    if (loading) { return <Loader /> }

    return (
        <div className="page walkthrough">
            <header className="page__header">
                <Link to='/tests' className="icon-btn page__icon-btn page__icon-btn_left icon-btn_close"></Link>
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
            {!['216', '4'].includes(conditionId)
                || (['216'].includes(conditionId) && questionId === questions.length - 1) ?
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
                                            onChange={e => setNewAnswer(e.target.value)} />
                                        <span>{elem.$.name}</span>
                                    </label>
                                )
                            })
                        }
                    </div>
                    <button onClick={confirmBtnHandler} className={
                        `answers-wrapper__confirm-btn 
                    ${answer.length ? 'answers-wrapper__confirm-btn_active' : null}`}></button>
                </div> :
                <Range
                    answer={answer}
                    question={question}
                    confirmBtnHandler={confirmBtnHandler}
                    setAnswer={setNewAnswer}
                />
            }
        </div>
    )
}


const Range = ({ question, answer, confirmBtnHandler, setAnswer }) => {
    const [value, setValue] = useState(0)
    const [min, setMin] = useState(0)
    const [max, setMax] = useState(0)
    const [btnActive, setBtnActive] = useState(false)

    useEffect(() => {
        setValue(0)
        setBtnActive(false)
        if (question) {
            setMax(question.ans.length - 1)
        }
    }, [question])

    const handleChange = e => {
        setBtnActive(true)
        setValue(e.target.value)
        setAnswer(question.ans[e.target.value].$.id)
    }

    const useDotes = useCallback(() => {
        const dotes = []
        for (var i = 0; i < question.ans.length; i++) {
            dotes.push(<li style={i >= value ? { 'background': `#DEEBF9` } : null} key={i}></li>)
        }
        return dotes
    }, [question, value])

    return (
        <div className="walk-range-wrapper">

            <div className="walk-range">
                <span className='walk-range__min'>{min}</span>
                <span className='walk-range__max'>{max}</span>
                <ul className="walk-range__dotes">{useDotes()}</ul>
                <input onChange={handleChange}
                    className="walk-range__slider"
                    type="range" min={min} max={max} value={value} />
                <div className="walk-range__progress" style={{ 'width': `${(value - min) * 100 / (max - min)}%` }} />
            </div>

            <button
                onClick={confirmBtnHandler}
                className={`walk-range-wrapper__button 
                ${btnActive ? 'walk-range-wrapper__button_active' : null}`}>
            </button>
            <p>Потяните ползунок чтобы выбрать подходящий ответ</p>
        </div>
    )
}