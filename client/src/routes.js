import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { AuthPage } from './pages/AuthPage'
import { TestsPage } from './pages/TestsPage'
import { WalkthroughPage } from './pages/WalkthroughPage'

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/tests" exact>
                    <TestsPage />
                </Route>
                <Route path="/tests/:id">
                    <WalkthroughPage />
                </Route>
                <Redirect to="/tests" />
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/" exact>
                <AuthPage />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}