import React from 'react'

export const Range = ({ total, norm, notNorm }) => {
    return (
        <div className="range">
            <div style={{ width: (norm * 100 / total) + '%' }} className="range__norm" />
            <div style={{ width: (notNorm * 100 / total) + '%' }} className="range__not-norm" />
        </div>
    )
}