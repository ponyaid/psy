import React, { useCallback, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'


export const SolutionPage = () => {
    const { request } = useHttp()

    const [solution, setSolution] = useState(null)
    const [html, setHtml] = useState(null)

    const solutionId = useParams().id

    const getSolution = useCallback(async () => {
        try {
            const fetched = await request(`/api/solutions/${solutionId}`)
            setSolution(fetched)
        } catch (e) {
            console.log(e)
        }
    }, [request, solutionId])

    useEffect(() => { getSolution() }, [getSolution])

    useEffect(() => {
        if (solution) {
            const html = solution.html
            const parser = new DOMParser()
            const htmlDoc = parser.parseFromString(html, 'text/html')
            setHtml(htmlDoc)
        }
    }, [solution])

    if (!html) {
        return null
    }

    return (
        <div>
            <div dangerouslySetInnerHTML={{__html:html.body.innerHTML}}></div>
        </div>
    )
}