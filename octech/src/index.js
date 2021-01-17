import React from 'react'
import ReactDOM from 'react-dom'
import { ReduxStore } from './config/config'
import { Provider } from 'react-redux'
import { PhotoEditorPage } from './pages/pages'
import { App, Feed, UserProfile } from './components/components'
import './index.css'

ReactDOM.render(
    <Provider store={ReduxStore}>  {/*Redux wrapper*/}
      <App /> {/*Main app being mounted*/}
    </Provider>,
  document.getElementById('root')
)
