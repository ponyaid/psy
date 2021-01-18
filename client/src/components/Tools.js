import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export const Tools = () => {
    const [isActive, setIsActive] = useState(false)

    if (isActive) {
        return (
            <div className="page tools">
                <div className="tools__items">
                    <Link to="/" className="tools__item">Назначить встречу</Link>
                    <Link to="/tests/create" className="tools__item">Отправить тест</Link>
                </div>
                <button onClick={() => { setIsActive(!isActive) }} className="tools__close-btn" />
            </div>
        )
    }

    return <button onClick={() => { setIsActive(!isActive) }} className="tools__open-btn" />
}