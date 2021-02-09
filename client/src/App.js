import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { isExpired } from 'react-jwt'
import { useRoutes } from './routes'
import { login, logout } from './redux/actions'
import { Alert } from './components/Alert'


function App() {
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const alert = useSelector(state => state.app.alert)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('userData'))
    if (data && data.token) {
      const isMyTokenExpired = isExpired(data.token)
      if (isMyTokenExpired) {
        dispatch(logout())
      } else {
        dispatch(login(data.role, data.user, data.token))
      }
    }
  }, [dispatch])

  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)

  return (
    <Router>
      <div className="main">
        {!!alert && <Alert text={alert.text} type={alert.type} />}
        {routes}
      </div>
    </Router>
  )
}

export default App