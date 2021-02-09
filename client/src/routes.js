import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { AuthPage } from './pages/AuthPage'
import { TestsPage } from './pages/TestsPage'
import { SchoolsPage } from './pages/SchoolsPage'
import { SolutionPage } from './pages/SolutionPage'
import { WalkthroughPage } from './pages/WalkthroughPage'
import { ProfilePage } from './pages/ProfilePage'
import { SchoolPage } from './pages/SchoolPage'
import { CodePage } from './pages/CodePage'
import { CreateTestPage } from './pages/CreateTestPage'
import { SettingsPage } from './pages/SettingsPage'


export const useRoutes = isAuthenticated => {

    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/" exact><ProfilePage /></Route>
                <Route path="/schools" exact><SchoolsPage /></Route>
                <Route path="/schools/:id" exact><SchoolPage /></Route>
                <Route path="/schools/:id/:classId" ><CodePage /></Route>

                <Route path="/tests/create" exact><CreateTestPage /></Route>

                <Route path="/tests" exact><TestsPage /></Route>
                <Route path="/tests/:testId/:conditionId/"><WalkthroughPage /></Route>
                <Route path="/solutions/:id"><SolutionPage /></Route>

                <Route path="/settings/"><SettingsPage /></Route>

                <Redirect to="/" />
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/psych/" exact>
                <AuthPage role='psych' />
            </Route>
            <Route path="/pupil/" exact>
                <AuthPage role='pupil' />
            </Route>
            <Route path="/pupil/:classId">
                <AuthPage role='pupil' reg />
            </Route>
            <Redirect to="/psych" />
        </Switch>
    )
}