import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { isExpired } from 'react-jwt'
import { useRoutes as Routes } from './routes'
import { login, logout } from './redux/actions'
import { Alert } from './components/Alert'
import { Loader } from './components/Loader'


function App() {
  const dispatch = useDispatch()
  const [ready, setReady] = useState(false)
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
    setReady(true)
  }, [dispatch])

  const isAuthenticated = !!token
  const routes = Routes(isAuthenticated)

  if (!ready) return <Loader />

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