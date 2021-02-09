import React from 'react'
import { Link } from 'react-router-dom'


export const Class = ({ item }) => {
    return (
        <Link to={`/schools/${item.school}/${item._id}`} className="list__item">
            <p>{item.number} {item.letter}</p>
            <p className="list__desc">{item.pupils.length} учеников</p>
            <span className="school-page__qr-icon" />
        </Link>
    )
}