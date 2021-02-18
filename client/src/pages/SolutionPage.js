import React, { useCallback, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'


export const SolutionPage = () => {
    const { request } = useHttp()

    const [test, setTest] = useState(null)
    const [html, setHtml] = useState(null)

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
            const htmlDoc = parser.parseFromString(html, 'text/html')
            setHtml(htmlDoc)
        }
    }, [test])

    if (!html) {
        return null
    }
    console.log(html)

    return (
        <div>
            <div dangerouslySetInnerHTML={{__html:html.body.innerHTML}}></div>
        </div>
    )
}