import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useRoutes } from './routes'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'


function App() {
  const { token, login, logout, userId, user, ready, role, updateUser } = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)

  if (!ready) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <AuthContext.Provider value={{ login, logout, token, userId, isAuthenticated, user, role, updateUser }}>
      <Router>
        <div className="main">
          {routes}
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App