import React, { useCallback } from 'react'


export const History = ({ history }) => {

    const formatDate = useCallback(date => {
        const newDate = new Date(date).toLocaleString('ru', {
            hour: 'numeric',
            minute: 'numeric',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
        return newDate
    }, [])

    return (
        <div className="history">
            <p className="history__date">{formatDate(history.date)}</p>
            <div className="history__wrapper">
                <span className="history__tag">{history.type}</span>
                <p className="history__title">{history.title}</p>
                <p className="history__desc" dangerouslySetInnerHTML={{ __html: history.desc.slice(0, 64) + ' ...' }} />
                <p className="history__pupils">{history.pupils.length} учеников</p>
            </div>
        </div>
    )
}