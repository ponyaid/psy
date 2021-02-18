import React, { useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Tools } from '../components/Tools'
import { Histories } from '../components/Histories'
import { Loader } from '../components/Loader'
import { getSchools, getTests } from '../redux/actions'


export const ProfilePage = () => {
    const dispatch = useDispatch()
    const { notPassedTests } = useSelector(state => state.test)
    const { role, user } = useSelector(state => state.auth)
    const { schools } = useSelector(state => state.school)
    const { loading } = useSelector(state => state.app)

    useEffect(() => {
        if (role === 'pupil') dispatch(getTests())
        dispatch(getSchools())
    }, [dispatch, role])

    const yearsOldCounter = useCallback((birthday) => {
        const nowDate = Date.now()
        const birthdayDate = new Date(birthday)
        const days = (nowDate - birthdayDate) / (60 * 60 * 24 * 1000)
        return `${Math.floor(days / 365)}`
    }, [])

    return (
        <div className={`page profile-page ${role === 'pupil' ? 'profile-page_pupil' : 'profile-page_psych'}`}>
            <Tools />
            <header className="page__header">
                <Link to='/settings' className="icon-btn page__icon-btn page__icon-btn_right icon-btn_settings"></Link>
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
                    {loading ? <Loader style={`margin-top: calc(100%/2 - 5rem);`} /> :
                        <div className="profile-page__entities-wrapper">
                            <Link to="/tests"
                                className={`entity ${!!notPassedTests && 'entity_test'}`}>
                                <p className={`entity__title ${!!notPassedTests && 'entity__title_white'}`}>Тесты</p>
                                {!notPassedTests && <p className="entity__description">У вас пока нет тестов</p>}
                                <span className={`entity__extra ${!notPassedTests && 'entity__extra_pupil-null'}`}>
                                    {notPassedTests}</span>
                            </Link>
                            <div className="entity">
                                <p className="entity__title">Встречи</p>
                                <p className="entity__description">У вас пока нет встреч</p>
                                <span className="entity__extra entity__extra_pupil-null">0</span>
                            </div>
                        </div>}
                </div>
                :
                <div className="profile-page__entities">
                    {loading ? <Loader /> :
                        <div className="profile-page__entities-wrapper">
                            <Link to="/schools" className={`entity ${!!schools.length && 'entity_school'}`}>
                                <p className={`entity__title ${!!schools.length && 'entity__title_white'}`}>Школы</p>
                                {!schools.length && <p className="entity__description">Добавьте школу</p>}
                                <span className={`entity__extra ${!schools.length && 'entity__extra_psych-null'}`}>
                                    {!!schools.length && schools.length}</span>
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
            }
            {role === 'psych' && <Histories />}
        </div>
    )
}