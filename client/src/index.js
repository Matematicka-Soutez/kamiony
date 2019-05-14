import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import 'sanitize.css'

import App from './pages'
import * as serviceWorker from './serviceWorker'

const RELEASE = '0.1.0'
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://0e7218c3411b489fa0dc3a10505eb7db@sentry.io/1431186',
    release: RELEASE,
  })
}

const render = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

if (module.hot) {
  module.hot.accept('./pages', render)
}

render()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app
serviceWorker.unregister()
