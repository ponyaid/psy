import React from 'react'


export const Alert = ({ type, text }) => {

    return (
        <div className="alert-wrapper">
            <div className={`alert ${!!type && 'alert_' + type}`}>
                {!!type && <span />}
                <p>{text}</p>
            </div>
        </div>
    )
}