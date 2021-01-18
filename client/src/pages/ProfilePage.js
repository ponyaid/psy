import React, { useContext, useCallback, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { Tools } from '../components/Tools'
import { useHttp } from '../hooks/http.hook'


export const ProfilePage = () => {
    const { request } = useHttp()
    const [tests, setTests] = useState(null)
    const { user, role, token } = useContext(AuthContext)

    const getTests = useCallback(async () => {
        try {
            const fetched = await request(`/api/tests/not-passed`, 'GET', null, {
                'Authorization': `Bearer ${token}`
            })
            setTests(fetched)
        } catch (e) {
        }
    }, [request, token])

    useEffect(() => {
        if (role === 'pupil') {
            getTests()
        }

    }, [getTests, role])

    const yearsOldCounter = useCallback((birthday) => {
        const nowDate = Date.now()
        const birthdayDate = new Date(birthday)
        const days = (nowDate - birthdayDate) / (60 * 60 * 24 * 1000)
        return `${Math.floor(days / 365)}`
    }, [])

    if (!user) {
        return null
    }

    if (role === 'pupil' && !tests) {
        return null
    }

    return (
        <div className={`page profile-page ${role === 'pupil' ? 'profile-page_pupil' : 'profile-page_psych'}`}>
            <Tools />
            <header className="page__header">
                <Link to='#' className="icon-btn page__icon-btn page__icon-btn_right icon-btn_settings"></Link>
                <p className="page__title profile-page__title">{role === 'pupil' ? 'Ученик' : 'Психолог'}</p>
            </header>

            <div className="profile-page__main">
                <div className="profile-page__info">
                    <p className="profile-page__name">{user.name} {user.surname}</p>
                    {user.birthday ? <p className="profile-page__birthday">{yearsOldCounter(user.birthday)} лет</p> : null}
                </div>
                <div className="profile-page__contacts">
                    <button className="profile-page__btn">Привязать мессенджер</button>
                </div>
            </div>
            {role === 'pupil' ?
                <div className="profile-page__entities">
                    <Link to="/tests"
                        className={`entity ${tests.length ? 'entity_test' : null}`}>
                        <p className={`entity__title ${tests.length ? 'entity__title_white' : null}`}>Тесты</p>
                        {!tests.length ? <p className="entity__description">У вас пока нет тестов</p> : null}
                        <span className={`entity__extra ${!tests.length ? 'entity__extra_pupil-null' : null}`}>
                            {tests.length}</span>
                    </Link>
                    <div className="entity">
                        <p className="entity__title">Встречи</p>
                        <p className="entity__description">У вас пока нет встреч</p>
                        <span className="entity__extra entity__extra_pupil-null">0</span>
                    </div>
                </div>
                :
                <div className="profile-page__entities">
                    <Link to="/schools" className={`entity ${user.schools.length ? 'entity_school' : null}`}>
                        <p className={`entity__title ${user.schools.length ? 'entity__title_white' : null}`}>Школы</p>
                        {!user.schools.length ? <p className="entity__description">Добавьте школу</p> : null}
                        <span className={`entity__extra ${!user.schools.length ? 'entity__extra_psych-null' : null}`}>
                            {user.schools.length ? user.schools.length : null}</span>
                    </Link>
                    <div className={`entity ${user.meets.length ? 'entity_meet' : null}`}>
                        <p className={`entity__title ${user.meets.length ? 'entity__title_white' : null}`}>Встречи</p>
                        {!user.meets.length ? <p className="entity__description">Добавьте встречу</p> : null}
                        <span className={`entity__extra ${!user.meets.length ? 'entity__extra_psych-null' : null}`}>
                            {user.meets.length ? user.meets.length : null}</span>
                    </div>
                    <div className="entity">
                        <p className="entity__title">Статистика</p>
                        <p className="entity__description">Нет данных для анализа</p>
                        <span className="entity__extra entity__extra_psych"></span>
                    </div>
                </div>
            }

        </div>
    )
}