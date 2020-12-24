import React, { useState, useEffect, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'


export const WalkthroughPage = () => {
    const { request } = useHttp()
    const [test, setTest] = useState(null)

    const [questionId, setQuestionId] = useState(0)
    const [questions, setQuestions] = useState([])
    const [question, setQuestion] = useState(null)
    const [answer, setAnswer] = useState([])
    const [results, setResults] = useState([])
    const [end, setEnd] = useState(false)

    const testId = useParams().id

    const getTest = useCallback(async () => {
        try {
            const fetched = await request(`/api/tests/${testId}`)
            setTest(fetched)
        } catch (e) {
            console.log(e)
        }
    }, [request, testId])

    const postTest = useCallback(async () => {
        const xml = test.xml
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(xml, 'text/xml')

        for (let i = 0; i < results.length; i++) {
            const an = xmlDoc.getElementById(results[i])
            an.setAttribute('selected', true)
        }

        xmlDoc.querySelector('root').setAttribute('birthdate', '01.01.2000')
        xmlDoc.querySelector('root').setAttribute('fio', 'Test Test')
        xmlDoc.querySelector('root').setAttribute('gender', 1)


        var oSerializer = new XMLSerializer()
        var sXML = oSerializer.serializeToString(xmlDoc)

        try {
            // const encodedData = window.btoa('HTTP:1234567890')
            // GET http://185.68.101.64/SychoDiag/hs/ConnectionTest/MakeTest
            // POST http://185.68.101.64/SychoDiag/hs/TestsExchange/SendTests
            const data = await request('http://185.68.101.64/SychoDiag/hs/TestsExchange/SendTests', 'POST', sXML,
                {
                    // 'Content-Type': 'application/xml',
                    // 'Authorization': `Basic ${encodedData}`
                })
            console.log(data)
            alert(data)
        } catch (e) {
            console.log(e)
        }

    }, [request, results, test])

    useEffect(() => { getTest() }, [getTest])

    useEffect(() => {
        // eslint-disable-next-line no-unused-expressions
        end ? postTest() : null
    }, [end, postTest])

    useEffect(() => {
        if (test) {
            const body = JSON.parse(test.body)
            const qws = body['root']['test'][0]['section'][0]['qw']
            setQuestions(qws)
        }
    }, [test])

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
            <div className="walkthrough__header">
                <Link to='/' className="close-btn"></Link>
                <div className="walkthrough__score">
                    <p>{questionId + 1}</p>
                    <p>{questions.length}</p>
                </div>
            </div>
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