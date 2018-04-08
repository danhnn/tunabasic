import React from 'react';
import { createStore } from 'redux'
import { compose, combineReducers, applyMiddleware } from 'redux'
import AdminReducer from '../containers/admin/AdminReducer';
import FisherManReducer from '../containers/fisher/FisherManReducer';
import createSagaMiddleware from 'redux-saga'
import AdminSaga from '../containers/admin/AdminSaga';
import FisherManSaga from '../containers/fisher/FisherManSaga';
import { createFilter, createBlacklistFilter, createWhitelistFilter } from 'redux-persist-transform-filter';
import { all } from 'redux-saga/effects'
import { persistStore, autoRehydrate, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

const sagaMiddleware = createSagaMiddleware()
const rootSaga = function* () {
  yield all([
    AdminSaga(),
    FisherManSaga(),
  ])
}

const reducers = combineReducers({
  AdminReducer,
  FisherManReducer
})

const saveSubsetWhiteListFilter = createWhitelistFilter(
  'AdminReducer',
  ['user', 'ccInfo']
);

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['AdminReducer'],
  transforms: [
    saveSubsetWhiteListFilter
  ]
}

const persistedReducer = persistReducer(persistConfig, reducers)

// Store
const store = createStore(persistedReducer
  , window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  compose(applyMiddleware(sagaMiddleware))
)
sagaMiddleware.run(rootSaga)
let persistor = persistStore(store)

export {store, persistor};