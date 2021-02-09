import {
    GET_SCHOOLS,
    GET_SCHOOL,
    GET_CLASS,
    CREATE_SCHOOL,
    CREATE_CLASS,
    START_SCHOOL_CREATING,
    FINISH_SCHOOL_CREATING,
    START_CLASS_CREATING,
    FINISH_CLASS_CREATING
} from './types'


const initialState = {
    schools: [],
    schoolData: null,
    classData: null,
    createSchoolInitial: false,
    createClassInitial: false
}

export const schoolReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SCHOOLS:
            return { ...state, schools: action.payload }
        case GET_SCHOOL:
            return { ...state, schoolData: action.payload }
        case GET_CLASS:
            return { ...state, classData: action.payload }
        case START_SCHOOL_CREATING:
            return { ...state, createSchoolInitial: true }
        case FINISH_SCHOOL_CREATING:
            return { ...state, createSchoolInitial: false }
        case START_CLASS_CREATING:
            return { ...state, createClassInitial: true }
        case FINISH_CLASS_CREATING:
            return { ...state, createClassInitial: false }
        case CREATE_SCHOOL:
            return { ...state, schools: state.schools.concat([action.payload]) }
        case CREATE_CLASS:
            return {
                ...state,
                schoolData: {
                    ...state.schoolData,
                    classes: state.schoolData.classes.concat([action.payload])
                }
            }
        default:
            return state
    }
}