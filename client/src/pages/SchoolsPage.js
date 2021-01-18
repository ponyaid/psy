import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'


export const SchoolsPage = () => {
    const { user } = useContext(AuthContext)

    if (!user) {
        return null
    }

    return (
        <div className="page">
            <header className="page__header">
                <Link to="/" className="icon-btn page__icon-btn page__icon-btn_left icon-btn_back"></Link>
                <p className="page__title">Школы</p>
                <Link to="/schools/create" className="icon-btn page__icon-btn page__icon-btn_right icon-btn_add"></Link>
            </header>

            <div className="school-page__wrapper">

                {user.schools.length ?
                    <div className="list">
                        {user.schools.map((school, index) =>
                            <Link to={`/schools/${school._id}`} key={index} className="list__item">
                                <p>{school.name}</p>
                                <p className="list__desc">{school.city}</p>
                            </Link>)}
                    </div>
                    : <p className="school-page__plug">У вас еще нет школ под управлением</p>
                }
            </div>
            <Link to="/schools/create" className="main-btn">Добавить школу</Link>
        </div>
    )
}