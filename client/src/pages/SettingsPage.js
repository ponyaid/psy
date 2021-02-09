import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, updateUser } from '../redux/actions'
import { ReactComponent as PersonSVG } from '../static/img/ic-person.svg'
import { ReactComponent as LockSVG } from '../static/img/ic-lock.svg'
import { ReactComponent as DialogSVG } from '../static/img/ic-dialog.svg'
import { Loader } from '../components/Loader'


export const SettingsPage = () => {
    const dispatch = useDispatch()
    const [section, setSection] = useState('')

    const callback = useCallback(() => {
        setSection('')
    }, [])

    if (section === 'personalData') {
        return <PersonalData callback={callback} />
    }

    return (
        <div className="page settings-page">

            <header className="page__header">
                <Link to='/' className="icon-btn page__icon-btn page__icon-btn_left icon-btn_back"></Link>
                <p className="page__title settings-page__title">Настройки профиля</p>
            </header>
            <div className="settings-page__main">
                <button className="settings-page__btn">Изменить фото профиля</button>
            </div>
            <div className="settings-page__sections">
                <div className="settings-page__sections-wrapper">
                    <p className="settings-page__sections-title">Профиль</p>
                    <ul className="settings-sections">
                        <li onClick={() => setSection('personalData')}
                            className="settings-sections__item"><PersonSVG />Персональные данные</li>
                        <li className="settings-sections__item"><LockSVG />Безопасность и вход</li>
                        <li className="settings-sections__item"><DialogSVG />Привязка мессенджеров</li>
                    </ul>
                </div>
                <div className="settings-page__footer">
                    <button
                        onClick={() => { dispatch(logout()) }}
                        className="logout-btn">Выйти из учетной записи</button>
                </div>
            </div>
        </div>
    )
}


const PersonalData = ({ callback }) => {
    const dispatch = useDispatch()
    const [key, setKey] = useState('')
    const { user } = useSelector(state => state.auth)
    const { loading } = useSelector(state => state.app)

    const [form, setForm] = useState({})

    useEffect(() => {
        setForm({
            sex: user.sex,
            name: user.name,
            surname: user.surname,
            birthday: user.birthday,
            email: user.email
        })
    }, [user])

    const formatBirthday = useCallback((date) => {
        const newDate = new Date(date)
        return newDate.toLocaleDateString()
    }, [])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    if (loading) {
        return <Loader />
    }

    return (
        <div className="page">
            <header className="page__header">
                <button
                    onClick={!key ? () => callback() : () => setKey('')}
                    className="icon-btn page__icon-btn page__icon-btn_left icon-btn_back">
                </button>
            </header>
            <div className="page__content">
                {!key && <h3>Персональные данные</h3>}
                {key === 'sex' && <h3>Пол</h3>}
                {key === 'name' && <h3>ФИО</h3>}
                {key === 'birthday' && <h3>Дата рождения</h3>}

                {key === 'sex' &&
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
                }

                {key === 'name' &&
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
                    </div>
                }

                {key === 'birthday' &&
                    <div className="auth-page__input-group">
                        <div className="input-field">
                            <input id="birthday" type="date" name="birthday"
                                onChange={changeHandler} value={form.birthday} />
                            <label htmlFor="birthday">Дата рождения</label>
                        </div>
                    </div>
                }

                {!key &&
                    <ul className="settings-details">
                        <li onClick={() => setKey('sex')}
                            className="settings-details__item">
                            <p>Пол</p>
                            {!user.sex && <p>Пол не указан</p>}
                            {!!user.sex && user.sex === '1' && <p>Мужской</p>}
                            {!!user.sex && user.sex === '2' && <p>Женский</p>}
                        </li>
                        <li onClick={() => setKey('name')}
                            className="settings-details__item">
                            <p>ФИО</p>
                            <p>{user.surname} {user.name}</p>
                        </li>
                        <li onClick={() => setKey('birthday')}
                            className="settings-details__item">
                            <p>Дата рождения</p>
                            <p>{formatBirthday(user.birthday)}</p>
                        </li>
                    </ul>
                }
            </div>
            {!!key && <button
                onClick={() => dispatch(updateUser(form))}
                className='main-btn'>Сохранить</button>}
        </div>
    )
}