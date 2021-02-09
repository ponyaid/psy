import {
    STEP_UP,
    STEP_DOWN,
    STEP_RESET,
    GET_CONDITIONS,
    CHANGE_CONDITION_ID,
    GET_TESTS,
    SET_NOT_PASSED_TESTS
} from './types'


const initialState = {
    step: 1,
    conditionId: null,
    conditions: [],
    tests: [],
    notPassedTests: 0
}

export const testReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CONDITIONS:
            return { ...state, conditions: action.payload }
        case CHANGE_CONDITION_ID:
            return { ...state, conditionId: action.payload }
        case STEP_UP:
            return { ...state, step: state.step + 1 }
        case STEP_DOWN:
            return { ...state, step: state.step - 1 }
        case STEP_RESET:
            return { ...state, step: 1 }
        case GET_TESTS:
            return { ...state, tests: action.payload }
        case SET_NOT_PASSED_TESTS:
            return { ...state, notPassedTests: action.payload }

        default:
            return state
    }
}