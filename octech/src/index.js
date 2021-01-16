import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ReduxStore } from './config';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { PhotoEditorPage } from './pages'
import { Feed } from './components'

ReactDOM.render(
    <Provider store={ReduxStore}>  {/*Redux wrapper*/}
      <App /> {/*Main app being mounted*/}
    </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
