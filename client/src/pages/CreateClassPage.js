import React, { useContext, useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'


export const CreateClassPage = () => {
    const { token } = useContext(AuthContext)
    const { loading, error, request, clearError } = useHttp()
    const history = useHistory()
    const schoolId = useParams().id

    const [form, setForm] = useState({
        number: '',
        letter: ''
    })

    useEffect(() => {
        if (error) { alert(error) }
        clearError()
    }, [error, clearError])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const numericHandler = event => {
        const goal = (event.target.validity.valid) ? event.target.value : form.number
        setForm({ ...form, [event.target.name]: goal })
    }

    const createHandler = async () => {
        try {
            await request('/api/classes/create', 'POST',
                JSON.stringify({ ...form, schoolId: schoolId }), {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
            history.push(`/schools/${schoolId}`)

        } catch (e) { }
    }

    return (
        <div className="page">
            <header className="page__header">
                <Link to={`/schools/${schoolId}`} className="icon-btn page__icon-btn page__icon-btn_left icon-btn_back"></Link>
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

            <button onClick={createHandler} className="main-btn" disabled={loading}>Добавить класс</button>
        </div>
    )
}