const state = {
  roomInfo: {
    teacherId: '',
    teacherName: '',
    classId: [],
    roomId: '',
    roomName: '',
    introduction: '',
    liveUrl: ''
  },
  liveUrl: '',
  socketUrl: ''
}

const mutations = {
  SET_ROOM_INFO: (state, roomInfo) => {
    const { teacherId, teacherName, classId, roomId, roomName, introduction, liveUrl } = roomInfo
    state.roomInfo.teacherId = teacherId
    state.roomInfo.teacherName = teacherName
    state.roomInfo.classId = classId
    state.roomInfo.roomId = roomId
    state.roomInfo.roomName = roomName
    state.roomInfo.introduction = introduction
    state.roomInfo.liveUrl = liveUrl
  },
  SET_LIVE_URL: (state, liveUrl) => {
    state.liveUrl = liveUrl
  },
  SET_SOCKET_URL: (state, socketUrl) => {
    state.socketUrl = socketUrl
  }
}

const actions = {
  setRoomInfo: ({ commit }, roomInfo) => {
    commit('SET_ROOM_INFO', roomInfo)
  },
  setLiveUrl: ({ commit }, liveUrl) => {
    commit('SET_LIVE_URL', liveUrl)
  },
  setSocketUrl: ({ commit }, socketUrl) => {
    commit('SET_SOCKET_URL', socketUrl)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
