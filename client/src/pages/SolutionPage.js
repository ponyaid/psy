import React, { useCallback, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'


export const SolutionPage = () => {
    const { request } = useHttp()
    const { user } = useSelector(state => state.auth)
    const [test, setTest] = useState(null)
    const [html, setHtml] = useState(null)
    const [isDocPage, setIsDocPage] = useState(false)
    const [rows, setRows] = useState([])

    const testId = useParams().id

    const getTest = useCallback(async () => {
        try {
            const fetched = await request(`/api/tests/${testId}`)
            setTest(fetched)
        } catch (e) {
            console.log(e)
        }
    }, [request, testId])

    useEffect(() => { getTest() }, [getTest])

    useEffect(() => {
        if (test) {
            const html = test.solution
            const parser = new DOMParser()
            const document = parser.parseFromString(html, 'text/html')

            const table = document.querySelectorAll('table')[1]
            const array = Array.from(table.querySelectorAll('tr')).slice(1)

            const rows = []

            for (let item of array) {
                const tds = item.querySelectorAll('td')
                rows.push({
                    name: tds[0].innerText,
                    score: tds[1].innerText,
                    norm: tds[1].querySelector('font').getAttribute('color') === 'black'
                })
            }

            setRows(rows)
            setHtml(document)
        }
    }, [test])

    const yearsOldCounter = useCallback((birthday) => {
        const nowDate = Date.now()
        const birthdayDate = new Date(birthday)
        const days = (nowDate - birthdayDate) / (60 * 60 * 24 * 1000)
        return `${Math.floor(days / 365)}`
    }, [])

    const docBtnHandler = useCallback(() => {
        setIsDocPage(!isDocPage)
    }, [isDocPage])

    if (!html) {
        return null
    }

    if (isDocPage) {
        return <DocPage handler={docBtnHandler} doc={html} />
    }

    return (
        <div className='page solution-page'>
            <header className="page__header">
                <Link to='/' className="icon-btn page__icon-btn page__icon-btn_left icon-btn_close"></Link>
                <p className="page__title solution-page__title">Статистика</p>
            </header>

            <div className="solution-page__main">
                <div className="solution-page__info">
                    <p className="solution-page__name">{user.name} {user.surname}</p>
                    {user.birthday ? <p className="solution-page__birthday">{yearsOldCounter(user.birthday)} лет</p> : null}
                </div>
            </div>

            <div className="solution-results">
                <div className="solution-results__wrapper">
                    <p className="solution-results__title">Результаты теста</p>
                    <p className="solution-results__name">{test.condition.name}</p>
                    <p className="solution-results__desc">{test.condition.desc}</p>

                    <span onClick={docBtnHandler}
                        className="solution-results__doc-btn">Информация о тесте</span>

                    <div className="solution-results__items">
                        {rows.map((row, index) =>
                            <div className="solution-result" key={index}>
                                <p className="solution-result__title">{row.name}</p>
                                <div className="solution-result__row">
                                    <span className="solution-result__row-title">Сумарный бал:</span>
                                    <span>{row.score}</span>
                                </div>
                                <div className="solution-result__row">
                                    <span className="solution-result__row-title">Показатель:</span>
                                    {row.norm ? <span className="solution-result__mark solution-result__mark_green">В норме</span>
                                        : <span className="solution-result__mark solution-result__mark_red">Не в норме</span>}
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </div>


        </div>
    )
}

const DocPage = ({ handler, doc }) => {
    return (
        <div className='page'>
            <header className="page__header">
                <button onClick={handler}
                    className="icon-btn page__icon-btn page__icon-btn_left icon-btn_close"></button>
                <p className="page__title">Подробности теста</p>
            </header>
            <div dangerouslySetInnerHTML={{ __html: doc.body.innerHTML }}></div>
        </div>
    )
}