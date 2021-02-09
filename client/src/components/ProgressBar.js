import React from 'react'


export const ProgressBar = ({color, step, total}) => {
    return (
        <div className={`progress-bar ${color ? 'progress-bar_' + color : null}`}>
            <span style={{ 'width': `${step * 100 / total}%` }} />
        </div>
    )
}