import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import AxioClient from '../../components/AxiosClient';
import {store} from "../../store";

function* invokeRequest(payload) {
  let { channel, chaincodeName, chaincodeType, chaincodePath, chaincodeVersion }
    = store.getState().AdminReducer.ccInfo;
  const token = store.getState().AdminReducer.user.token;
  let { funcName, funcArgs } = payload;

  if (!funcArgs) {
    funcArgs = [];
  }

  
  return yield AxioClient.post('/channels/' + channel + '/chaincodes/' + chaincodeName, {
    peers: ["peer0.org1.example.com", "peer1.org1.example.com"],
    fcn: funcName,
    args: funcArgs
  }, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
}

function* initLedger(action) {
  try {
    const result = yield invokeRequest({ funcName: "initLedger" });
    yield put({ type: "FISHERMAN_INIT_LEDGER_SUCCESS", payload: result.data });
  } catch (e) {
    yield put({ type: "FISHERMAN_INIT_LEDGER_ERROR", payload: e.message });
  }
}

function* queryAllTuna(action) {
  try {
    const result = yield invokeRequest({ funcName: "queryAllSalmon" });
    yield put({ type: "FISHERMAN_QUERY_ALL_TUNA_SUCCESS", payload: result.data });
  } catch (e) {
    yield put({ type: "FISHERMAN_QUERY_ALL_TUNA_ERROR", payload: e.message });
  }
}

function* FisherManSaga() {
  yield takeEvery("INIT_LEDGER", initLedger);
  yield takeEvery("QUERY_ALL_TUNA", queryAllTuna);
}

export default FisherManSaga;