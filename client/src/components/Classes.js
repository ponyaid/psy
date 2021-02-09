import React from 'react'
import { Class } from './Class'


export const Classes = ({ classes }) => {

    if (!classes || !classes.length) {
        return <p className="school-page__plug">У вас еще нет классов</p>
    }
    return classes.map(item => <Class item={item} key={item._id} />)
}