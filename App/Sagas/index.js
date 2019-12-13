import { takeLatest, all, takeEvery } from 'redux-saga/effects'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
// import { GithubTypes } from '../Redux/GithubRedux'
import { QiscusTypes } from '../Redux/QiscusRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { 
  qiscusInitSaga, 
  setUserSaga, 
  getRoomsSaga, 
  getMessagesSaga,
  sendMessageSaga,
  readMessageSaga,
  getUsersSaga,
  openRoomSaga,
  setActiveRoom,
  exitActiveRoom,
} from './QiscusSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugConfig.useFixtures ? FixtureAPI : API.create()

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),

    takeLatest(QiscusTypes.QISCUS_INIT, qiscusInitSaga),
    takeLatest(QiscusTypes.SET_USER, setUserSaga),
    takeLatest(QiscusTypes.SET_ACTIVE_ROOM_REQUEST, setActiveRoom),
    takeLatest(QiscusTypes.EXIT_ACTIVE_ROOM_REQUEST, exitActiveRoom),
    takeLatest(QiscusTypes.GET_ROOMS_REQUEST, getRoomsSaga),
    takeLatest(QiscusTypes.GET_MESSAGES_REQUEST, getMessagesSaga),
    takeEvery(QiscusTypes.SEND_MESSAGE_REQUEST, sendMessageSaga),
    takeLatest(QiscusTypes.READ_MESSAGE_REQUEST, readMessageSaga),
    takeLatest(QiscusTypes.GET_USERS_REQUEST, getUsersSaga),
    takeLatest(QiscusTypes.OPEN_ROOM_REQUEST, openRoomSaga),
    
  ])
}
