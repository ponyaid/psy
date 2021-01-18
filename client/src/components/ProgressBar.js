import React from 'react'


export const ProgressBar = props => {
    return (
        <div className={`progress-bar ${props.color ? 'progress-bar_' + props.color : null}`}>
            <span style={{ 'width': `${props.step * 100 / props.total}%` }} />
        </div>
    )
}