import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSchoolsINedded } from '../redux/actions'
import { Loader } from './Loader'
import { School } from './School'


export const Schools = () => {
    const dispatch = useDispatch()
    const schools = useSelector(state => state.school.schools)
    const loading = useSelector(state => state.app.loading)

    useEffect(() => {
        dispatch(getSchoolsINedded())
    }, [dispatch])

    if (loading) {
        return <Loader />
    }

    if (!schools.length) {
        return <p className="school-page__plug">У вас еще нет школ под управлением</p>
    }

    return schools.map(school => <School school={school} key={school._id} />)
}