import React, { useState, useEffect, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import QRCode from "qrcode.react"


export const CodePage = () => {
    const { request } = useHttp()
    const [group, setGroup] = useState(null)
    const schoolId = useParams().id
    const classId = useParams().classId

    const shortUrl = useCallback(string => {
        const size = 24
        if (string.length > size) {
            return string.slice(0, size) + '...'
        }
        return string
    }, [])

    const getGroup = useCallback(async () => {
        try {
            const fetched = await request(`/api/classes/${classId}`, 'GET', null)
            setGroup(fetched)
        } catch (e) {
        }
    }, [classId, request])

    useEffect(() => {
        getGroup()
    }, [getGroup])

    const copyHandler = () => {
        var field = document.createElement('textarea')
        field.innerText = `${window.location.host}/pupil/${classId}`
        document.body.appendChild(field)
        field.select()
        document.execCommand('copy')
        field.remove()
        alert('Ссылка скопирована')
    }

    if (!group) {
        return null
    }


    return (
        <div className="page code-page">
            <header className="page__header">
                <Link to={`/schools/${schoolId}`} className="icon-btn page__icon-btn page__icon-btn_left icon-btn_back"></Link>
                <p className="page__title code-page__title">{group.school.name}, {group.number}{group.letter}</p>
            </header>

            <div className="page__content code-page__content">
                <div className="code">
                    <QRCode value={`http://${window.location.host}/pupil/${classId}`}
                        id="canvas" size={234} renderAs={"svg"} includeMargin={true} />
                </div>
                <p>Отсканируйте QR-Code</p>
            </div>

            <div className="code-page__footer">
                <p className="code-page__footer-title">{shortUrl(`${window.location.host}/pupil/${classId}`)}</p>
                <p className="code-page__footer-desc">Ссылка регистрации ученика</p>
                <button onClick={copyHandler} className="code-page__copy-btn" />
            </div>
        </div>
    )
}