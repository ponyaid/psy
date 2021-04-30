import { combineReducers } from 'redux'
import { authReducer } from './authReducer'
import { appReducer } from './appReducer'
import { schoolReducer } from './schoolReducer'
import { testReducer } from './testReducer'
import { historyReducer } from './historyReducer'
import { statisticReducer } from './statisticReducer'


export const rootReducer = combineReducers({
    auth: authReducer,
    app: appReducer,
    school: schoolReducer,
    test: testReducer,
    history: historyReducer,
    statistic: statisticReducer,
})