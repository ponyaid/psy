import fetch from './fetch'
import {
    GET_SCHOOLS,
    LOGIN, LOGOUT,
    UPDATE_USER,
    START_LOADING,
    FINISH_LOADING,
    GET_SCHOOL,
    CREATE_SCHOOL,
    SHOW_ALERT,
    HIDE_ALERT,
    CREATE_CLASS,
    GET_CONDITION,
    GET_CONDITIONS,
    CHANGE_CONDITION_ID,
    STEP_UP, STEP_DOWN,
    GET_CLASS,
    FINISH_SCHOOL_CREATING,
    FINISH_CLASS_CREATING,
    GET_HISTORY,
    GET_TESTS,
    SET_NOT_PASSED_TESTS,
} from './types'


const storageName = 'userData'


export function login(role, user, token) {
    return dispatch => {
        dispatch({ type: LOGIN, payload: { role, user, token } })
        localStorage.setItem(storageName, JSON.stringify({ role, user, token }))
    }
}

export function logout() {
    return dispatch => {
        dispatch({ type: LOGOUT })
        localStorage.removeItem(storageName)
    }
}

export function updateUser(data) {
    return async (dispatch, getState) => {
        const { role, user } = getState().auth

        try {
            dispatch(startLoading())

            const json = await fetch(`/api/${role}/update`, {
                method: 'POST',
                body: JSON.stringify({ ...data, id: user._id }),
                headers: { 'Content-Type': 'application/json' }
            }, getState, dispatch)

            const storage = JSON.parse(localStorage.getItem(storageName))
            localStorage.setItem(storageName, JSON.stringify({ ...storage, user: json[role] }))
            dispatch({ type: UPDATE_USER, payload: json[role] })
            dispatch(finishLoading())
            dispatch(showAlert({ type: 'success', text: 'Изменения внесены успешно' }))

        } catch (e) {
            dispatch(finishLoading())
            dispatch(showAlert({ type: 'error', text: e.message }))
        }
    }
}

export function startLoading() {
    return {
        type: START_LOADING
    }
}

export function finishLoading() {
    return {
        type: FINISH_LOADING
    }
}

export function showAlert(alert) {
    return dispatch => {
        dispatch({
            type: SHOW_ALERT,
            payload: alert
        })

        setTimeout(() => {
            dispatch(hideAlert())
        }, 3000)
    }
}

export function hideAlert() {
    return {
        type: HIDE_ALERT
    }
}

export function getSchoolsINedded() {
    return (dispatch, getState) => {
        const schools = getState().school.schools

        if (!schools.length) {
            return dispatch(getSchools())
        }
    }
}

export function getSchools() {
    return async (dispatch, getState) => {
        try {
            dispatch(startLoading())
            const json = await fetch(`/api/schools/`, { method: 'GET' }, getState, dispatch)

            dispatch({ type: GET_SCHOOLS, payload: json })
            dispatch(finishLoading())

        } catch (e) {
            dispatch(finishLoading())
            dispatch(showAlert({ type: 'error', text: e.message }))
        }
    }
}

export function getSchoolINedded(id) {
    return (dispatch, getState) => {
        const state = getState().school

        if (!state.schoolData || state.schoolData['_id'] !== id) {
            return dispatch(getSchool(id))
        }
    }
}

export function getSchool(id) {
    return async (dispatch, getState) => {
        try {
            dispatch(startLoading())
            const json = await fetch(`/api/schools/${id}`, { method: 'GET' }, getState, dispatch)

            dispatch({ type: GET_SCHOOL, payload: json })
            dispatch(finishLoading())

        } catch (e) {
            dispatch(finishLoading())
            dispatch(showAlert({ type: 'error', text: e.message }))
        }
    }
}

export function getClassINedded(id) {
    return (dispatch, getState) => {
        const state = getState().school

        if (!state.classData || state.classData['_id'] !== id) {
            return dispatch(getClass(id))
        }
    }
}

export function getClass(id) {
    return async (dispatch, getState) => {
        try {
            dispatch(startLoading())
            const json = await fetch(`/api/classes/${id}`, { method: 'GET' }, getState, dispatch)

            dispatch({ type: GET_CLASS, payload: json })
            dispatch(finishLoading())

        } catch (e) {
            dispatch(finishLoading())
            dispatch(showAlert({ type: 'error', text: e.message }))
        }
    }
}

export function createSchool(form) {
    return async (dispatch, getState) => {
        try {
            dispatch(startLoading())

            const json = await fetch('/api/schools/create', {
                method: 'POST',
                body: JSON.stringify({ ...form }),
                headers: { 'Content-Type': 'application/json', }
            }, getState, dispatch)

            dispatch({ type: CREATE_SCHOOL, payload: json.school })
            dispatch({ type: FINISH_SCHOOL_CREATING })
            dispatch(finishLoading())
            dispatch(showAlert({ type: 'success', text: 'Школа успешно создана' }))

        } catch (e) {
            dispatch(finishLoading())
            dispatch(showAlert({ type: 'error', text: e.message }))
        }
    }
}


export function createClass(data) {
    return async (dispatch, getState) => {
        try {
            dispatch(startLoading())

            const json = await fetch('/api/classes/create', {
                method: 'POST',
                body: JSON.stringify({ ...data }),
                headers: { 'Content-Type': 'application/json', }
            }, getState, dispatch)

            dispatch({ type: CREATE_CLASS, payload: json.newClass })
            dispatch({ type: FINISH_CLASS_CREATING })
            dispatch(finishLoading())
            dispatch(showAlert({ type: 'success', text: 'Класс успешно создан' }))

        } catch (e) {
            dispatch(finishLoading())
            dispatch(showAlert({ type: 'error', text: e.message }))
        }
    }
}

export function getConditionsINedded() {
    return (dispatch, getState) => {
        const state = getState().test

        if (!state.conditions.length) {
            return dispatch(getConditions())
        }
    }
}

export function getConditions() {
    return async (dispatch, getState) => {
        try {
            dispatch(startLoading())
            const json = await fetch('/api/conditions', { method: 'GET' }, getState, dispatch)

            dispatch({ type: GET_CONDITIONS, payload: json })
            dispatch(finishLoading())

        } catch (e) {
            dispatch(finishLoading())
            dispatch(showAlert({ type: 'error', text: e.message }))
        }
    }
}

export function changeConditionId(id) {
    return {
        type: CHANGE_CONDITION_ID,
        payload: id
    }
}

export function stepUp() {
    return {
        type: STEP_UP
    }
}

export function stepDown() {
    return {
        type: STEP_DOWN
    }
}

export function getHistory() {
    return async (dispatch, getState) => {

        try {
            dispatch(startLoading())
            const json = await fetch('/api/history', { method: 'GET' }, getState, dispatch)

            dispatch({ type: GET_HISTORY, payload: json })
            dispatch(finishLoading())

        } catch (e) {
            dispatch(finishLoading())
            dispatch(showAlert({ type: 'error', text: e.message }))
        }
    }
}

export function getTests() {
    return async (dispatch, getState) => {
        try {
            dispatch(startLoading())
            const json = await fetch(`/api/tests/`, { method: 'GET' }, getState, dispatch)

            let quantity = 0
            json.forEach((test => { !test.solution && quantity++ }))

            dispatch({ type: SET_NOT_PASSED_TESTS, payload: quantity })
            dispatch({ type: GET_TESTS, payload: json })
            dispatch(finishLoading())

        } catch (e) {
            dispatch(finishLoading())
            dispatch(showAlert({ type: 'error', text: e.message }))
        }
    }
}

export function getCondition(id) {
    return async (dispatch, getState) => {
        try {
            dispatch(startLoading())
            const json = await fetch(`/api/conditions/${id}`, { method: 'GET' }, getState, dispatch)

            dispatch({ type: GET_CONDITION, payload: json })
            dispatch(finishLoading())

        } catch (e) {
            dispatch(finishLoading())
            dispatch(showAlert({ type: 'error', text: e.message }))
        }
    }
}