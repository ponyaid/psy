import {
    GET_STATISTIC_CONDITIONS,
    GET_STATISTIC_CONDITION_ID,
    GET_STATISTIC_SCHOOL_ID,
    GET_STATISTIC_CLASS_ID,
} from './types'


const initialState = {
    condtitions: [],
    conditionID: null,
    schoolId: null,
    classId: null,
}


export const statisticReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_STATISTIC_CONDITIONS:
            return { ...state, condtitions: action.payload }
        case GET_STATISTIC_CONDITION_ID:
            return { ...state, conditionId: action.payload }
        case GET_STATISTIC_SCHOOL_ID:
            return { ...state, schoolId: action.payload }
        case GET_STATISTIC_CLASS_ID:
            return { ...state, classId: action.payload }
        default:
            return state
    }
}