import React, { useEffect, useState, useCallback, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'



export const SchoolPage = () => {
    const [school, setSchool] = useState(null)
    const { request } = useHttp()
    const schoolId = useParams().id
    const { token } = useContext(AuthContext)

    const getSchool = useCallback(async () => {
        try {
            const fetched = await request(`/api/schools/${schoolId}`, 'GET', null, {
                'Authorization': `Bearer ${token}`
            })
            setSchool(fetched)
        } catch (e) {
        }
    }, [request, schoolId, token])

    useEffect(() => {
        getSchool()
    }, [getSchool])

    if (!school) {
        return null
    }

    return (
        <div className="page">
            <header className="page__header">
                <Link to="/schools" className="icon-btn page__icon-btn page__icon-btn_left icon-btn_back"></Link>
                <p className="page__title">{school.name}</p>
                <Link to={`/schools/${school._id}/create`} className="icon-btn page__icon-btn page__icon-btn_right icon-btn_add"></Link>
            </header>

            <div className="school-page__wrapper">

                {school.classes.length ?
                    <div className="list">
                        {school.classes.map((item, index) =>
                            <Link to={`/schools/${schoolId}/${item._id}`} key={index} className="list__item">
                                <p>{item.number} {item.letter}</p>
                                <p className="list__desc">{item.pupils.length} учеников</p>
                                <span className="school-page__qr-icon"/>
                            </Link>)}
                    </div>
                    : <p className="school-page__plug">У вас еще нет классов</p>
                }
            </div>

            <Link to={`/schools/${school._id}/create`} className="main-btn">Добавить класс</Link>
        </div>
    )
}