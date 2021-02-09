import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createClass } from '../redux/actions'
import { FINISH_CLASS_CREATING } from '../redux/types'


export const CreateClass = ({ schoolId }) => {
    const dispatch = useDispatch()
    const { loading, alert } = useSelector(state => state.app)

    const [form, setForm] = useState({
        number: '',
        letter: ''
    })

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const numericHandler = event => {
        const goal = (event.target.validity.valid) ? event.target.value : form.number
        setForm({ ...form, [event.target.name]: goal })
    }

    const createHandler = async () => {
        dispatch(createClass({ ...form, schoolId }))
    }

    return (
        <div className="page">
            <header className="page__header">
                <button
                    onClick={() => dispatch({ type: FINISH_CLASS_CREATING })}
                    className="icon-btn page__icon-btn page__icon-btn_left icon-btn_back">
                </button>
                <p className="page__title">Добавить класс</p>
            </header>

            <div className="school-page__wrapper">
                <h3>Добавить класс</h3>
                <div className="input-field">
                    <input placeholder="Номер" id="number" type="text" name="number" pattern="[0-9]*"
                        onInput={numericHandler} value={form.number} />
                    <label htmlFor="number">Номер</label>
                </div>
                <div className="input-field">
                    <input placeholder="Буква" id="letter" type="text" name="letter"
                        onChange={changeHandler} value={form.letter} />
                    <label htmlFor="letter">Буква</label>
                </div>
            </div>

            <button onClick={createHandler} className="main-btn" disabled={loading || alert}>Добавить класс</button>
        </div>
    )
}