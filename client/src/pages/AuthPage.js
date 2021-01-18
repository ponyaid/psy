import React, { useContext, useEffect, useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'


export const AuthPage = props => {
    const role = props.role
    const classId = useParams().classId
    const auth = useContext(AuthContext)
    const { loading, error, request, clearError } = useHttp()

    const [group, setGroup] = useState(null)
    const [isReg, setIsReg] = useState(!!props.isReg)

    const [form, setForm] = useState({
        sex: '1',
        surname: '',
        name: '',
        birthday: '',
        email: '',
        password: '',

        terms: true,
        resolution: false,
    })

    const getGroup = useCallback(async () => {
        if (role === 'pupil' && isReg) {
            try {
                const fetched = await request(`/api/classes/${classId}`, 'GET', null)
                setGroup(fetched)
            } catch (e) {
            }
        }
    }, [classId, isReg, request, role])

    useEffect(() => {
        getGroup()
    }, [getGroup])

    useEffect(() => {
        if (error) { alert(error) }
        clearError()
    }, [error, clearError])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const registerHandler = async () => {
        try {
            const data = await request(`/api/${role}/register`, 'POST',
                JSON.stringify({ ...form, classId: classId }), { 'Content-Type': 'application/json' })
            alert(data.message)
            setIsReg(false)
        } catch (e) { }
    }

    const loginHandler = async () => {
        try {
            const data = await request(`/api/${role}/login`, 'POST',
                JSON.stringify({ ...form }), { 'Content-Type': 'application/json' })
            auth.login(data.token, data[`${role}Id`], data[role], data['role'])
        } catch (e) { }
    }

    if (role === 'pupil' && isReg && !group) {
        return null
    }

    return (
        <div className="page auth-page">
            <header className="page__header">
                <p className="page__title">
                    {isReg ? 'Регистрация' : 'Вход в аккаунт'} {role === 'pupil' ? 'ученика' : 'психолога'}</p>
            </header>

            {!isReg
                ? <div className="auth-page__wrapper">
                    <div className="auth-page__header">
                        <h3>Вход</h3>
                        {role === 'psych' ? <button className="auth-page__header-btn"
                            onClick={() => { setIsReg(!isReg) }}>Нет аккаунта?</button> : null}
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
                    <button className="main-btn auth-page__btn" onClick={loginHandler} disabled={loading}>Войти</button>
                </div>
                : <div className="auth-page__wrapper">
                    <div className="auth-page__header">
                        <h3>Регистрация</h3>
                        {role === 'psych' ? <button className="auth-page__header-btn"
                            onClick={() => { setIsReg(!isReg) }}>Нет аккаунта?</button> : null}
                    </div>
                    {
                        role === 'psych' ? null :
                            <div className="auth-page__info">
                                <div className="auth-page__info-item">
                                    <div>
                                        <p>{group.psych.name} {group.psych.surname}</p>
                                        <p className="auth-page__info-desc">Ваш психолог</p>
                                    </div>
                                </div>
                                <div className="auth-page__info-item">
                                    <p className="auth-page__info-title">Школа</p>
                                    <p>{group.school.name}</p>
                                </div>
                                <div className="auth-page__info-item">
                                    <p className="auth-page__info-title">Класс</p>
                                    <p>{group.number}{group.letter}</p>
                                </div>
                            </div>
                    }
                    <div className="auth-page__input-group auth-page__input-group_row">
                        <div className="input-field">
                            <input id="m" type="radio" checked={form.sex === '1'}
                                name="sex" value='1' onChange={changeHandler} />
                            <label htmlFor="m">Мужский</label>
                        </div>
                        <div className="input-field">
                            <input id="f" type="radio" checked={form.sex === '2'}
                                name="sex" value='2' onChange={changeHandler} />
                            <label htmlFor="f">Женский</label>
                        </div>
                    </div>

                    <div className="auth-page__input-group">
                        <div className="input-field">
                            <input placeholder="Фамилия" id="surname" type="text" name="surname"
                                onChange={changeHandler} value={form.surname} />
                            <label htmlFor="surname">Фамилия</label>
                        </div>
                        <div className="input-field">
                            <input placeholder="Имя" id="name" type="text" name="name"
                                onChange={changeHandler} value={form.name} />
                            <label htmlFor="name">Имя</label>
                        </div>
                        <div className="input-field">
                            <input id="birthday" type="date" name="birthday"
                                onChange={changeHandler} value={form.birthday} />
                            <label htmlFor="birthday">Дата рождения</label>
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
                    <div className="auth-page__input-group">
                        <div className="input-field">
                            <input id="terms" type="checkbox" checked={form.terms}
                                onChange={() => { setForm({ ...form, 'terms': !form.terms }) }} />
                            <label htmlFor="terms">Пользовательское соглашение</label>
                        </div>
                        {
                            role === 'pupil' ?
                                <div className="input-field">
                                    <input id="resolution" type="checkbox" checked={form.resolution}
                                        onChange={() => { setForm({ ...form, 'resolution': !form.resolution }) }} />
                                    <label htmlFor="resolution">Разрешение родителей</label>
                                </div> : null
                        }
                    </div>
                    <p style={{ paddingBottom: "2rem" }}>
                        Нажимая «Зарегистрироваться», вы подтверждаете, что прочитали
                        <Link to="#"> Политику конфиденциальности</Link> и спогласны с
                        <Link to="#"> Условиями оказания услуг.</Link></p>
                    <button
                        className="main-btn auth-page__btn"
                        onClick={registerHandler}
                        disabled={loading}
                    >Зарегистрироваться</button>
                </div>
            }

        </div>
    )
}

