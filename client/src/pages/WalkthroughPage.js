import React, { useState, useEffect, useCallback, useContext } from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'


export const WalkthroughPage = () => {
    const history = useHistory()
    const { request } = useHttp()
    const { user } = useContext(AuthContext)

    const [condition, setCondition] = useState(null)
    const [questionId, setQuestionId] = useState(0)
    const [questions, setQuestions] = useState([])
    const [question, setQuestion] = useState(null)
    const [answer, setAnswer] = useState([])
    const [results, setResults] = useState([])
    const [end, setEnd] = useState(false)

    const conditionId = useParams().conditionId
    const testId = useParams().testId

    const getCondition = useCallback(async () => {
        try {
            const fetched = await request(`/api/conditions/${conditionId}`)
            setCondition(fetched)
        } catch (e) {
            console.log(e)
        }
    }, [request, conditionId])

    const postSolution = useCallback(async () => {
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

            await request('/api/tests/solution', 'POST',
                JSON.stringify({ solution: sXML, testId }), {
                'Content-Type': 'application/json',
            })

            alert('Тест пройден')


        } catch (e) { }

        try {
            // const encodedData = window.btoa('HTTP:1234567890')
            // GET http://185.68.101.64/SychoDiag/hs/ConnectionTest/MakeTest
            // POST http://185.68.101.64/SychoDiag/hs/TestsExchange/SendTests
            await request('http://185.68.101.64/SychoDiag/hs/TestsExchange/SendTests', 'POST', sXML,
                {
                    // 'Content-Type': 'application/xml',
                    // 'Authorization': `Basic ${encodedData}`
                })

                history.push('/')

        } catch (e) {
            console.log(e)
        }

    }, [request, results, condition, user])

    useEffect(() => { getCondition() }, [getCondition])

    useEffect(() => {
        // eslint-disable-next-line no-unused-expressions
        end ? postSolution() : null
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

    if (!question) {
        return null
    }


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