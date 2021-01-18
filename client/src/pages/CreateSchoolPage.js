import React, { useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'


export const CreateSchoolPage = () => {
    const { user, token, updateUser } = useContext(AuthContext)
    const { loading, error, request, clearError } = useHttp()
    const history = useHistory()

    const [form, setForm] = useState({
        city: '',
        name: ''
    })

    useEffect(() => {
        if (error) { alert(error) }
        clearError()
    }, [error, clearError])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const createHandler = async () => {
        try {
            const data = await request('/api/schools/create', 'POST',
                JSON.stringify({ ...form }), {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
            updateUser({...user, schools: [...user.schools, data.school]})
            history.push('/schools')
            
        } catch (e) { }
    }

    return (
        <div className="page">
            <header className="page__header">
                <Link to="/schools" className="icon-btn page__icon-btn page__icon-btn_left icon-btn_back"></Link>
                <p className="page__title">Добавить школу</p>
            </header>

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

            <button onClick={createHandler} className="main-btn" disabled={loading}>Добавить школу</button>
        </div>
    )
}