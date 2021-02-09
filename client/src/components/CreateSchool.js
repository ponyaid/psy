import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createSchool } from '../redux/actions'
import { FINISH_SCHOOL_CREATING } from '../redux/types'
import { Loader } from './Loader'


export const CreateSchool = () => {
    const dispatch = useDispatch()
    const { loading, alert } = useSelector(state => state.app)

    const [form, setForm] = useState({ city: '', name: '' })

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const createHandler = async () => {
        dispatch(createSchool(form))
    }

    return (
        <div className="page">
            <header className="page__header">
                <button
                    onClick={() => dispatch({ type: FINISH_SCHOOL_CREATING })}
                    className="icon-btn page__icon-btn page__icon-btn_left icon-btn_back">
                </button>
                <p className="page__title">Добавить школу</p>
            </header>
            {
                loading ? <Loader /> :
                    <div className="school-page__wrapper">
                        <h3>Добавить школу</h3>
                        <div className="input-field">
                            <input placeholder="Город" id="city" type="text" name="city"
                                onChange={changeHandler} value={form.city} />
                            <label htmlFor="city">Город</label>
                        </div>
                        <div className="input-field">
                            <input placeholder="Название школы" id="name" type="text" name="name"
                                onChange={changeHandler} value={form.name} />
                            <label htmlFor="name">Название школы</label>
                        </div>
                    </div>
            }

            <button
                onClick={createHandler}
                className="main-btn" disabled={loading || alert}>
                Добавить школу
            </button>
        </div>
    )
}