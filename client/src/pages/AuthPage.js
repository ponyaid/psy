import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'


export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const { loading, error, request, clearError } = useHttp()

    const [isReg, setIsReg] = useState(false)

    const [form, setForm] = useState({
        sex: 'm',
        name: '',
        email: '',
        password: '',
        terms: true,
        resolution: false,
    })

    useEffect(() => {
        if (error) { alert(error) }
        clearError()
    }, [error, clearError])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const registerHandler = async () => {
        console.log(form)
        try {
            const data = await request('/api/auth/register', 'POST',
                JSON.stringify({ ...form }), { 'Content-Type': 'application/json' })
            alert(data.message)
        } catch (e) { }
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST',
                JSON.stringify({ ...form }), { 'Content-Type': 'application/json' })
            auth.login(data.token, data.pupilId)
        } catch (e) { }
    }

    return (
        <div className="page auth-page">

            {!isReg
                ? <div className="auth-page__wrapper">
                    <p className="page__title">Вход в аккаунт</p>
                    <div className="auth-page__header">
                        <h3 className="auth-page__title">Войти</h3>
                        <button className="auth-page__header-btn"
                            onClick={() => { setIsReg(!isReg) }}>Нет аккаунта?</button>
                    </div>
                    <div className="auth-page__input-group">
                        <div className="input-field">
                            <input placeholder="Эл. почта" id="email" type="text" name="email"
                                onChange={changeHandler} value={form.email} />
                            <label htmlFor="email">Эл. почта</label>
                        </div>
                        <div className="input-field">
                            <input placeholder="Введите пароль" id="password" type="password" name="password"
                                onChange={changeHandler} value={form.password} />
                            <label htmlFor="password">Введите пароль</label>
                        </div>
                        <Link to="/">Забыли пароль?</Link>
                    </div>
                    <button className="auth-page__btn" onClick={loginHandler} disabled={loading}>Войти</button>
                </div>
                : <div className="auth-page__wrapper">
                    <p className="page__title">Регистрация</p>
                    <div className="auth-page__header">
                        <h3 className="auth-page__title">Регистрация</h3>
                        <button className="auth-page__header-btn"
                            onClick={() => { setIsReg(!isReg) }}>Есть аккаунт?</button>
                    </div>

                    <div className="auth-page__input-group">
                        <div className="input-field">
                            <input placeholder="Фамилия Имя Отчество" id="name" type="text" name="name"
                                onChange={changeHandler} value={form.name} />
                            <label htmlFor="name">Фамилия Имя Отчество</label>
                        </div>
                        <div className="input-field">
                            <input placeholder="Эл. почта" id="email" type="text" name="email"
                                onChange={changeHandler} value={form.email} />
                            <label htmlFor="email">Эл. почта</label>
                        </div>
                        <div className="input-field">
                            <input placeholder="Придумайте пароль" id="password" type="password" name="password"
                                onChange={changeHandler} value={form.password} />
                            <label htmlFor="password">Придумайте пароль</label>
                        </div>
                    </div>
                    <div className="auth-page__input-group auth-page__input-group_row">
                        <div className="input-field">
                            <input id="m" type="radio" checked={form.sex === 'm'}
                                onChange={() => { setForm({ ...form, 'sex': 'm' }) }} />
                            <label htmlFor="m">Мужский</label>
                        </div>
                        <div className="input-field">
                            <input id="f" type="radio" checked={form.sex === 'f'}
                                onChange={() => { setForm({ ...form, 'sex': 'f' }) }} />
                            <label htmlFor="f">Женский</label>
                        </div>
                    </div>
                    <div className="auth-page__input-group" style={{ padding: "20px 0 2px" }}>
                        <div className="input-field">
                            <input id="terms" type="checkbox" checked={form.terms}
                                onChange={() => { setForm({ ...form, 'terms': !form.terms }) }} />
                            <label htmlFor="terms">Пользовательское соглашение</label>
                        </div>
                        <div className="input-field">
                            <input id="resolution" type="checkbox" checked={form.resolution}
                                onChange={() => { setForm({ ...form, 'resolution': !form.resolution }) }} />
                            <label htmlFor="resolution">Разрешение родителей</label>
                        </div>
                    </div>
                    <p style={{ paddingBottom: "1.5rem" }}>
                        Нажимая «Зарегистрироваться», вы подтверждаете, что прочитали
                        <Link to="#"> Политику конфиденциальности</Link> и спогласны с
                        <Link to="#"> Условиями оказания услуг.</Link></p>
                    <button
                        className="auth-page__btn"
                        onClick={registerHandler}
                        disabled={loading}
                    >Зарегистрироваться</button>
                </div>
            }

        </div>
    )
}

