import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import { Radar } from 'react-chartjs-2'
import { Chart } from 'chart.js'

import { useParams } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'


export const SolutionPage = () => {
    const { request } = useHttp()
    const [test, setTest] = useState(null)
    const [html, setHtml] = useState(null)
    const [diagram, setDiagram] = useState(false)
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

                const row = {
                    name: tds[0].innerText,
                    score: tds[1].innerText,
                    norm:
                        test.condition.id === 216
                        || !tds[1].querySelector('font')
                        || tds[1].querySelector('font').getAttribute('color') === 'black'
                }

                if ([213, 4, 202].includes(test.condition.id)) {
                    row.norm = tds[1].querySelector('font')
                        && tds[1].querySelector('font').getAttribute('color') === 'red'
                        ? false : true
                }

                if (test.condition.id === 216 && tds[0].querySelector('font')) {
                    rows.unshift(row)
                } else {
                    rows.push(row)
                }


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

    const diagramBtnHandler = useCallback(() => {
        setDiagram(!diagram)
    }, [diagram])

    if (!html) {
        return null
    }

    if (isDocPage) {
        return <DocPage handler={docBtnHandler} doc={html} />
    }

    if (diagram) {
        return <Diagram handler={diagramBtnHandler} rows={rows} conditionName={test.condition.name} />
    }

    return (
        <div className='page solution-page'>
            <header className="page__header">
                <Link to='/' className="icon-btn page__icon-btn page__icon-btn_left icon-btn_close"></Link>
                <p className="page__title solution-page__title">Статистика</p>
            </header>

            <div className="solution-page__main">
                <div className="solution-page__info">
                    <p className="solution-page__name">{test.pupil.name} {test.pupil.surname}</p>
                    {test.pupil.birthday ? <p className="solution-page__birthday">{yearsOldCounter(test.pupil.birthday)} лет</p> : null}
                </div>
            </div>

            <div className="solution-results">
                <div className="solution-results__wrapper">
                    <p className="solution-results__title">Результаты теста</p>
                    <p className="solution-results__name">{test.condition.name}</p>
                    <p className="solution-results__desc" dangerouslySetInnerHTML={{ __html: test.condition.desc }} />

                    <span onClick={docBtnHandler}
                        className="solution-results__doc-btn">Информация о тесте</span>

                    {test.condition.id !== 216 && <p className='diagram-handler' onClick={diagramBtnHandler}>Диаграмма</p>}
                    {/* <p className='diagram-handler' onClick={diagramBtnHandler}>Диаграмма</p> */}

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
                                    {row.norm ? <span className="solution-result__mark solution-result__mark_green">
                                        {[213, 4, 202].includes(test.condition.id) ? 'Значимость не высокая' : 'В норме'}</span>
                                        : <span className="solution-result__mark solution-result__mark_red">
                                            {[213, 4, 202].includes(test.condition.id) ? 'Значимость высокая' : 'Не в норме'}</span>}
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
    const [document, setDocument] = useState(null)

    useEffect(() => {
        const parser = new DOMParser()
        const html = doc.body.innerHTML
        const document = parser.parseFromString(html, 'text/html')
        document.querySelector('body p:last-child').remove()
        var ns = new XMLSerializer()
        var ss = ns.serializeToString(document)
        setDocument(ss)
    }, [doc])


    return (
        <div className='page'>
            <header className="page__header">
                <button onClick={handler}
                    className="icon-btn page__icon-btn page__icon-btn_left icon-btn_close"></button>
                <p className="page__title">Подробности теста</p>
            </header>

            <div dangerouslySetInnerHTML={{ __html: document }}></div>
        </div>
    )
}



export const Diagram = ({ handler, conditionName, rows }) => {
    const canvasRef = useRef(null)
    const [row, setRow] = useState(null)
    const [data, setData] = useState(null)
    const [colors, setColors] = useState(null)
    const [radar, setRadar] = useState(null)


    useEffect(() => {
        setRow(rows[0])
    }, [rows])

    useEffect(() => {
        const newLabels = []
        const newData = []
        const colors = []

        for (let item of rows) {
            newLabels.push('•')
            newData.push(Number(item.score.replace(',', '.')))

            if (item.norm) {
                colors.push(row === item ? 'rgba(82,194,43, 1)' : 'rgba(82,194,43, 0.5)')
            } else {
                colors.push(row === item ? 'rgba(255,90,82, 1)' : 'rgba(255,90,82, 0.5)')
            }
        }

        const data = {
            labels: newLabels,
            datasets: [
                {
                    fill: false,
                    data: newData,
                    borderWidth: 2,
                    borderColor: '#52C22B'
                },
            ],
        }
        setData(data)
        setColors(colors)


    }, [rows, row])

    useEffect(() => {
        const canvas = canvasRef.current

        const options = {
            maintainAspectRatio: false,
            scale: {
                pointLabels: {
                    fontSize: 45,
                    fontColor: colors,
                },
                ticks: {
                    min: 0,
                    stepSize: 1,
                    display: false
                },
            },

            layout: {
                padding: {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }
            },
            legend: { display: false },
            tooltips: { enabled: false },
            // onClick: function (evt, element) {
            //     if (!element.length) return
            //     setRow(rows[element[0]._index])
            // },
        }

        if (canvas) {
            const context = canvas.getContext('2d')
            const myRadar = new Chart(context, {
                type: 'radar',
                data: data,
                options: options,
            })
            myRadar.ctx.minHeight = 275
            // myRadar.ctx.width = '100%'

            setRadar(myRadar)
        }

    }, [data, rows, colors])

    const canvasHandler = (e) => {
        var helpers = Chart.helpers
        var scale = radar.scale
        var opts = scale.options
        var tickOpts = opts.ticks

        // Position of click relative to canvas.
        var mouseX = e.nativeEvent.offsetX
        var mouseY = e.nativeEvent.offsetY

        var labelPadding = 5 // number pixels to expand label bounding box by

        var tickBackdropHeight = (tickOpts.display && opts.display) ?
            helpers.valueOrDefault(tickOpts.fontSize, Chart.defaults.global.defaultFontSize)
            + 5 : 0
        var outerDistance = scale.getDistanceFromCenterForValue(opts.ticks.reverse ? scale.min : scale.max)
        for (var i = 0; i < scale.pointLabels.length; i++) {
            // Extra spacing for top value due to axis labels
            var extra = (i === 0 ? tickBackdropHeight / 2 : 0)
            var pointLabelPosition = scale.getPointPosition(i, outerDistance + extra + 5)

            var plSize = scale._pointLabelSizes[i]

            // get label textAlign info
            var angleRadians = scale.getIndexAngle(i)
            var angle = helpers.toDegrees(angleRadians)
            var textAlign = 'right'
            if (angle === 0 || angle === 180) {
                textAlign = 'center'
            } else if (angle < 180) {
                textAlign = 'left'
            }

            var verticalTextOffset = 0
            if (angle === 90 || angle === 270) {
                verticalTextOffset = plSize.h / 2
            } else if (angle > 270 || angle < 90) {
                verticalTextOffset = plSize.h
            }

            var labelTop = pointLabelPosition.y - verticalTextOffset - labelPadding;
            var labelHeight = 2 * labelPadding + plSize.h
            var labelBottom = labelTop + labelHeight

            var labelWidth = plSize.w + 2 * labelPadding
            var labelLeft
            switch (textAlign) {
                case 'center':
                    labelLeft = pointLabelPosition.x - labelWidth / 2
                    break
                case 'left':
                    labelLeft = pointLabelPosition.x - labelPadding
                    break;
                case 'right':
                    labelLeft = pointLabelPosition.x - labelWidth + labelPadding
                    break
                default:
                    console.log('ERROR: unknown textAlign ' + textAlign)
            }
            var labelRight = labelLeft + labelWidth

            if (mouseX >= labelLeft && mouseX <= labelRight && mouseY <= labelBottom && mouseY >= labelTop) {
                setRow(rows[i])
                break
            }


        }
    }

    if (!row) return null

    return (
        <div className='page'>
            <header className="page__header">
                <button onClick={handler} className="icon-btn page__icon-btn page__icon-btn_left icon-btn_close"></button>
                <p className="page__title">Статистика</p>
            </header>

            <div className="diagram">
                <p className='diagram__title'>{conditionName}</p>


                {/* <Radar data={data} options={options}
                    getElementAtEvent={getElementAtEvent}
                /> */}

                <div className="chart-container" style={{ 'minHeight': `278px`, 'width': '100%', 'position': 'relative' }}>
                    <canvas ref={canvasRef} onClick={canvasHandler} />
                </div>

                <p className="diagram__condition-name">{row.name}</p>

                <div className="diagram__details">
                    <p className="diagram__details-key">Сумарный бал:</p>
                    <p className="diagram__details-value">{row.score}</p>
                </div>

                <div className="diagram__details">
                    <p className="diagram__details-key">Показатель:</p>

                    {row.norm ? <span className="solution-result__mark solution-result__mark_green">В норме</span>
                        : <span className="solution-result__mark solution-result__mark_red">Не в норме</span>}
                </div>

            </div>
        </div>
    )
}
