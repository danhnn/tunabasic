import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import registerServiceWorker from './registerServiceWorker';
import App from './App';
import {store,persistor} from './store';
import { PersistGate } from 'redux-persist/integration/react'

// render(
//   <Provider store={store}>
//       <App />
//   </Provider>,
//   document.getElementById('root')
// )
render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker();
