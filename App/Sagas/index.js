import { takeLatest, all } from 'redux-saga/effects'
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
  getUsersSaga,
  openRoomSaga,
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
    takeLatest(QiscusTypes.GET_ROOMS_REQUEST, getRoomsSaga),
    takeLatest(QiscusTypes.GET_MESSAGES_REQUEST, getMessagesSaga),
    takeLatest(QiscusTypes.SEND_MESSAGE_REQUEST, sendMessageSaga),
    takeLatest(QiscusTypes.GET_USERS_REQUEST, getUsersSaga),
    takeLatest(QiscusTypes.OPEN_ROOM_REQUEST, openRoomSaga),
  ])
}
