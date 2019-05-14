import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import ErrorBoundary from '../utils/ErrorBoundary'
import DisplayPage from './DisplayPage'
import DistancesPage from './DistancesPage'
import ProductionsPage from './ProductionsPage'
import GameScreen from './GameScreen'
import GameInput from './GameInput'
import TeamHistory from './TeamHistoryPage'
import GameResults from './GameResults'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Switch>
          <Route exact path="/" component={DisplayPage} />
          <Route path="/hra/:gameCode/vzdalenosti" component={DistancesPage} />
          <Route path="/hra/:gameCode/vysledky" component={GameResults} />
          <Route path="/hra/:gameCode/produkce" component={ProductionsPage} />
          <Route
            path="/hra/:gameCode/admin/:accessToken"
            component={GameInput}
          />
          <Route
            path="/hra/:gameCode/teams/:teamId/history"
            component={TeamHistory}
          />
          <Route path="/hra/:gameCode" component={GameScreen} />
        </Switch>
      </Router>
    </ErrorBoundary>
  )
}

export default App
