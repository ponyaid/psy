import React from 'react'
import { Link } from 'react-router-dom'


export const School = ({ school }) => {
    return (
        <Link to={`/schools/${school._id}`} className="list__item">
            <p>{school.name}</p>
            <p className="list__desc">{school.city}</p>
        </Link>
    )
}