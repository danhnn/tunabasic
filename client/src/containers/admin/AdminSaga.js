import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import AxioClient from '../../components/AxiosClient';
import {store} from "../../store";

function* login(action) {
  try {
    const result = yield AxioClient.post('/users', {
      username: 'Jim',
      orgName: 'Org1'
    })
    yield put({ type: "ADMIN_LOGIN_SUCCESS", payload: result.data });
  } catch (e) {
    yield put({ type: "ADMIN_LOGIN_ERROR", payload: e.message });
  } 
}

function* createaChannel(action) {
  try {
    const token = store.getState().AdminReducer.user.token;
    const result = yield AxioClient.post('/channels', {
      channelName: action.payload,
      channelConfigPath: '../artifacts/channel/mychannel.tx'
    },{
      headers: { 'Authorization': 'Bearer ' + token }
    })
    yield put({ type: "ADMIN_CREATE_CHANNEL_SUCCESS", payload: result.data });
  } catch (e) {
    yield put({ type: "ADMIN_CREATE_CHANNEL_ERROR", payload: e.message });
  } 
}

function* joinChannel(action) {
  try {
    const token = store.getState().AdminReducer.user.token;
    const result = yield AxioClient.post('/channels/'+ action.payload +'/peers', {
      peers: ["peer0.org1.example.com","peer1.org1.example.com"],
    },{
      headers: { 'Authorization': 'Bearer ' + token }
    })
    yield put({ type: "ADMIN_JOIN_CHANNEL_SUCCESS", payload: result.data });
  } catch (e) {
    yield put({ type: "ADMIN_JOIN_CHANNEL_ERROR", payload: e.message });
  } 
}

function* installChaincode(action) {
  try {
    const {chaincodeName, chaincodeType, chaincodePath, chaincodeVersion} = action.payload;
    const token = store.getState().AdminReducer.user.token;
    const result = yield AxioClient.post('/chaincodes', {
      peers: ["peer0.org1.example.com","peer1.org1.example.com"],
      chaincodeName,
      chaincodePath,
      chaincodeType,
      chaincodeVersion: chaincodeVersion.toString(),
    },{
      headers: { 'Authorization': 'Bearer ' + token }
    })
    yield put({ type: "ADMIN_INSTALL_CC_SUCCESS", payload: result.data });
  } catch (e) {
    yield put({ type: "ADMIN_INSTALL_CC_ERROR", payload: e.message });
  } 
}

function* instantiatedChaincode(action) {
  try {
    const {channel, chaincodeName, chaincodeType, chaincodePath, chaincodeVersion} = action.payload;
    const token = store.getState().AdminReducer.user.token;
    const result = yield AxioClient.post('/channels/'+channel+'/chaincodes', {
      peers: ["peer0.org1.example.com","peer1.org1.example.com"],
      chaincodeName,
      chaincodeType,
      chaincodeVersion: chaincodeVersion.toString(),
      args:[]
    },{
      headers: { 'Authorization': 'Bearer ' + token }
    })
    yield put({ type: "ADMIN_INSTANTIATED_CC_SUCCESS", payload: result.data });
    yield put({ type: "UPDATE_ADMIN_CC_INFO", payload:{channel, chaincodeName, chaincodeType, chaincodePath, chaincodeVersion} })
  } catch (e) {
    yield put({ type: "ADMIN_INSTANTIATED_CC_ERROR", payload: e.message });
  } 
}

function* AdminSaga() {
  yield takeEvery("LOGIN_REQUEST", login);
  yield takeEvery("CREATE_CHANNEL", createaChannel);
  yield takeEvery("JOIN_CHANNEL", joinChannel);
  yield takeEvery("INSTALL_CHAINCODE", installChaincode);
  yield takeEvery("INSTANTIATED_CHAINCODE", instantiatedChaincode);
}

export default AdminSaga;