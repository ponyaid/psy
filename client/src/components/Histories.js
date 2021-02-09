import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getHistory } from '../redux/actions'
import { History } from './History'


export const Histories = () => {
    const dispatch = useDispatch()
    const { loading } = useSelector(state => state.app)
    const { histories } = useSelector(state => state.history)

    useEffect(() => {
        dispatch(getHistory())
    }, [dispatch])

    if (loading) return null

    return (
        <div className="histories">
            <div className="histories__wrapper">
                <p className="histories__title">История действий</p>
                {histories.length === 0 &&
                    <p className="histories__plug">Тут будет сохраняться история ваших действий.</p>}
                {histories.map(history => <History history={history} key={history._id} />)}
            </div>
        </div>
    )
}