import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getSchoolINedded } from '../redux/actions'
import { Classes } from '../components/Classes'
import { Loader } from '../components/Loader'
import { CreateClass } from '../components/CreateClass'
import { START_CLASS_CREATING } from '../redux/types'


export const SchoolPage = () => {
    const dispatch = useDispatch()
    const schoolId = useParams().id
    const loading = useSelector(state => state.app.loading)
    const { createClassInitial, schoolData } = useSelector(state => state.school)

    useEffect(() => {
        dispatch(getSchoolINedded(schoolId))
    }, [dispatch, schoolId])

    if (createClassInitial && schoolData) {
        return <CreateClass schoolId={schoolData._id} />
    }

    return (
        <div className="page">
            <header className="page__header">
                <Link to="/schools" className="icon-btn page__icon-btn page__icon-btn_left icon-btn_back"></Link>
                {!!schoolData && !loading && <p className="page__title">{schoolData.name}</p>}
                {!!schoolData && !loading && <button onClick={() => dispatch({ type: START_CLASS_CREATING })}
                    className="icon-btn page__icon-btn page__icon-btn_right icon-btn_add"></button>}
            </header>

            <div className="school-page__wrapper">
                <div className="list">
                    {!!schoolData && !loading ? <Classes classes={schoolData.classes} /> : <Loader />}
                </div>
            </div>

            {!!schoolData && !loading &&
                <button
                    onClick={() => dispatch({ type: START_CLASS_CREATING })}
                    className="main-btn">
                    Добавить класс
                </button>
            }
        </div>
    )
}