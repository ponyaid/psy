import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Schools } from '../components/Schools'
import { START_SCHOOL_CREATING } from '../redux/types'
import { CreateSchool } from '../components/CreateSchool'


export const SchoolsPage = () => {
    const dispatch = useDispatch()
    const { createSchoolInitial } = useSelector(state => state.school)

    if (createSchoolInitial) {
        return <CreateSchool />
    }

    return (
        <div className="page">
            <header className="page__header">
                <Link to="/" className="icon-btn page__icon-btn page__icon-btn_left icon-btn_back"></Link>
                <p className="page__title">Школы</p>
                <button
                    onClick={() => dispatch({ type: START_SCHOOL_CREATING })}
                    className="icon-btn page__icon-btn page__icon-btn_right icon-btn_add"></button>
            </header>
            <div className="school-page__wrapper">
                <div className="list"> <Schools /> </div>
            </div>
            <button
                onClick={() => dispatch({ type: START_SCHOOL_CREATING })}
                className="main-btn">Добавить школу</button>
        </div>
    )
}