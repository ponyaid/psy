import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'

import { useSheet } from '../hooks/sheet.hook'
import logo from '../static/img/logo.svg'
import bnr from '../static/img/bnr.jpg'
import clock from '../static/img/ic-clock.svg'
import radar from '../static/img/ic-radar.svg'
import pie from '../static/img/ic-pie.svg'
import serviceOne from '../static/img/service-1.png'
import serviceTwo from '../static/img/service-2.png'
import serviceThree from '../static/img/service-3.png'


export const LandingPage = () => {
    const { appendSpreadsheet } = useSheet()

    const [step, setStep] = useState(1)
    const [service, setService] = useState(1)
    const [form, setForm] = useState({
        name: '',
        surname: '',
        tel: '',
        email: '',
        institutionType: '',
        institution: '',
        education: '',
    })

    useEffect(() => {
        if (window.innerWidth > 640) {
            setTimeout(() => {
                service === 3 ? setService(1) : setService(service + 1)
            }, 4000)
        }
    }, [service])

    const clickHandler = () => {
        if (window.innerWidth <= 640) {
            service === 3 ? setService(1) : setService(service + 1)
        }
    }

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const forwardHandler = () => {
        if (step === 1 && form.name && form.surname) {
            setStep(step + 1)
        } else if (step === 2 && form.tel && form.email) {
            setStep(step + 1)
        } else if (step === 3 && form.institutionType && form.institution) {
            setStep(step + 1)
        } else if (step === 4 && form.education) {

            appendSpreadsheet(form)
            setStep(1)
            setForm({
                name: '',
                surname: '',
                tel: '',
                email: '',
                institutionType: '',
                institution: '',
                education: '',
            })
            alert('Заявка успешно отправлена')
        } else {
            alert('Заполните все поля')
        }
    }

    return (
        <div className="landing">
            <header className="landing-header">
                <div className="landing-header__logo-wrapper">
                    <Link className="landing-header__logo" to="/">
                        <img src={logo} alt="logo" />
                    </Link>
                </div>
                <nav className="landing-header__nav">
                    <HashLink className="landing-header__link" to="#landing-main">Главная</HashLink>
                    <HashLink className="landing-header__link" to="#landing-about">О нас</HashLink>
                    <HashLink className="landing-header__link" to="#landing-services">Решение</HashLink>
                    <HashLink className="landing-header__link" to="#landing-goal">Цель</HashLink>
                </nav>
                <div className="landing-header__auth">
                    <Link className="landing-header__link" to="/psych">Войти</Link>
                    <Link className="landing-header__link" to="/psych/register">Начать</Link>
                </div>
            </header>

            <section className="landing-main" id="landing-main">
                <h1 className="landing-main__title">Мы развиваем системы автоматизации школьной психодиагностики</h1>
                <div className="landing-main__btns">
                    <Link to="/psych" className="landing-main__btn">Для психолога</Link>
                    <Link to="/pupil" className="landing-main__btn landing-main__btn_blue">Для ученика</Link>
                </div>
                <div className="landing-main__bnr">
                    <img src={bnr} alt="bnr" />
                </div>
            </section>

            <section className="landing-bullets">
                <div className="landing-bullet">
                    <span className="landing-bullet__icon"><img src={clock} alt="icon" /></span>
                    <p>Экономия времени на тестирование школьников и проверку результатов по тестам – 80%</p>
                </div>
                <div className="landing-bullet">
                    <span className="landing-bullet__icon"><img src={radar} alt="icon" /></span>
                    <p>Для проведения тестирования необходим только мобильный телефон и интернет соединение LTE или 3G</p>
                </div>
                <div className="landing-bullet">
                    <span className="landing-bullet__icon"><img src={pie} alt="icon" /></span>
                    <p>Удобные информативные отчеты по результатам каждого школьника или целых классов</p>
                </div>
            </section>

            <section className="landing-about" id="landing-about">
                <h2 className="landing-about__title">О нас</h2>
                <p>Мы Компания с фокусом на создание автоматизированных систем, которые упрощают работу психологов,
                добавляют интерактив в их рабочее взаимодействие с людьми,
                позволяют качественно отслеживать динамику состояния здоровья человека.<br /><br />
                Наше решение предназначено для школьных психологов.
                Функционал нашей платформы позволяет работать сразу с несколькими группами людей,
                назначать им различные тесты (созданные по валидированным методикам),
                автоматически выводить результаты тестирования, а также проводить анализ результатов.
                Вы, как специалист, можете обмениваться советами с школьником прямо на платформе,
                назначать ему встречи, вести персональную карточку результатов тестирования по каждому учащемуся.</p>
            </section>

            <section className="landing-services" id="landing-services">
                <div className="landing-services__cover">
                    {service === 1 && <img src={serviceOne} alt="cover" />}
                    {service === 2 && <img src={serviceTwo} alt="cover" />}
                    {service === 3 && <img src={serviceThree} alt="cover" />}
                </div>
                <div className="landing-services__content">
                    <div className="landing-services__steps">
                        <span onClick={clickHandler}
                            className={`landing-services__step ${service === 1 && "landing-services__step_blue"}`}>01</span>
                        <span onClick={clickHandler}
                            className={`landing-services__step ${service === 2 && "landing-services__step_yellow"}`}>02</span>
                        <span onClick={clickHandler}
                            className={`landing-services__step ${service === 3 && "landing-services__step_orange"}`}>03</span>
                    </div>
                    {service === 1 && <p>Мы создаем комфортную цифровую среду для взаимодействия школьника и психолога.</p>}
                    {service === 2 && <p>Обеспечиваем конфиденциальность личных данных и безопасность на высоком уровне.</p>}
                    {service === 3 && <p>Позволяем удобным образом отслеживать динамику психического здоровья школьника,
                        класса и целой школы, предоставляя результаты в виде удобных диаграмм.</p>}
                </div>
            </section>

            <section className="landing-goal" id="landing-goal">
                <h2 className="landing-goal__title">Наша  цель</h2>
                <p>Мы хотим создать полноценную цифровую среду, в которой каждому из участников будет комфортно.
                Психолог сможет воспользоваться удобным понятным функционалом, который позволит сэкономить время,
                а для школьника такое решение будет интересным и познавательным, поможет в современном формате проходить тестирования,
                а также использовать дополнительный функционал для своих нужд.<br /><br />
                Таким образом мы облегчаем работу психолога и делаем ее более системной через собственный функционал,
                с другой стороны даём школьникам удобный современный инструмент прохождения психологических тестов.</p>
            </section>

            <section className="landing-contacts" id="landing-contacts">
                <h2 className="landing-contacts__title">Сделайте несколько шагов, чтобы познакомиться с нашим решением.</h2>
                <div className="landing-contacts__content">
                    <div className="landing-contacts__contacts">
                        <Link className="landing-contacts__contact landing-contacts__contact_email"
                            to="mailto:support@psy.ru">support@psy.ru</Link>
                        <Link className="landing-contacts__contact landing-contacts__contact_tel"
                            to="tel:+79663006996">+7 966 300 69 96</Link>
                    </div>

                    <div className="landing-contacts__form-wrapper">
                        <div className="landing-contacts__form">
                            <div className="landing-contacts__form-steps">
                                <span>Шаг {step}</span>
                                <span>из 4</span>
                            </div>
                            {step === 1 && <div className="landing-contacts__input-group">
                                <div className="landing-contacts__input-field">
                                    <label htmlFor="name">Имя</label>
                                    <input placeholder="Имя" id="name" type="text" name="name"
                                        onChange={changeHandler} value={form.name} />
                                </div>
                                <div className="landing-contacts__input-field">
                                    <label htmlFor="surname">Фамилия</label>
                                    <input placeholder="Фамилия" id="surname" type="text" name="surname"
                                        onChange={changeHandler} value={form.surname} />
                                </div>
                            </div>}

                            {step === 2 && <div className="landing-contacts__input-group">
                                <div className="landing-contacts__input-field">
                                    <label htmlFor="tel">Номер телефона</label>
                                    <input placeholder="Номер телефона" id="tel" type="text" name="tel"
                                        onChange={changeHandler} value={form.tel} />
                                </div>
                                <div className="landing-contacts__input-field">
                                    <label htmlFor="email">Эл. почта</label>
                                    <input placeholder="Эл. почта" id="email" type="text" name="email"
                                        onChange={changeHandler} value={form.email} />
                                </div>
                            </div>}

                            {step === 3 && <div className="landing-contacts__input-group">
                                <div className="landing-contacts__input-field">
                                    <label htmlFor="institutionType">Тип образовательное учереждения</label>
                                    <input placeholder="Введите тип учереждения"
                                        id="institutionType" type="text" name="institutionType"
                                        onChange={changeHandler} value={form.institutionType} />
                                </div>
                                <div className="landing-contacts__input-field">
                                    <label htmlFor="institution">Образовательное учереждение</label>
                                    <input placeholder="Выберете учереждение" id="institution" type="text" name="institution"
                                        onChange={changeHandler} value={form.institution} />
                                </div>
                            </div>}

                            {step === 4 && <div className="landing-contacts__input-group">
                                <div className="landing-contacts__input-field">
                                    <label htmlFor="education">Образование</label>
                                    <input placeholder="Напишите, какое у вас образование"
                                        id="education" type="text" name="education"
                                        onChange={changeHandler} value={form.education} />
                                </div>
                            </div>}

                            <div className="landing-contacts__form-note">
                                Ваши данные находятся в полной сохранности. Сайт использует сертификат безопасности.</div>
                            <div className="landing-contacts__form-btns">
                                {step !== 1 && <button
                                    onClick={() => setStep(step - 1)}
                                    className="landing-contacts__form-btn landing-contacts__form-btn_back">
                                    Назад</button>}
                                <button
                                    onClick={forwardHandler}
                                    className="landing-contacts__form-btn landing-contacts__form-btn_forward">
                                    {step === 4 ? 'Отправить' : 'Далее'}</button>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="landing-contacts__footer">
                    <p>© PSY. Все права защищены</p>
                    <Link to="/">Условия пользования</Link>
                    <Link to="/">Политика конфиденциальности</Link>
                </footer>
            </section>
        </div>
    )
}