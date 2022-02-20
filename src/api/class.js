import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/colleges/getAllClassesOption',
    method: 'get'
  })
}

export function getAllClassesOption() {
  return request({
    url: '/colleges/getAllClassesOption',
    method: 'get'
  })
}

export function getSocketUrl(roomId) {
  return request({
    url: '/websocket/getWebSocketUrl',
    method: 'post',
    params: {
      roomId: roomId
    }
  })
}

export function setRoomInfo(roomInfo) {
  return request({
    url: '/room/create',
    method: 'post',
    params: {
      // roomId: roomId,
      name: roomInfo.roomName,
      note: roomInfo.introduction,
      classes: roomInfo.classId,
      uid: roomInfo.uid
    }
  })
}

export function getRoomInfo(roomId) {
  return request({
    url: '/room/findRoomById',
    params: {
      roomId: roomId
    },
    method: 'post'
  })
}

export function sendMsg(roomId, msg) {
  return request({
    url: '/websocket/sendAll',
    method: 'post',
    params: {
      roomId: roomId,
      message: msg
    }
  })
}

export function closeRoom(roomId) {
  return request({
    url: '/room/close',
    method: 'post',
    params: {
      roomId: roomId
    }
  })
}

export function findRoom(roomId) {
  return request({
    url: '/room/findRoomById',
    method: 'post',
    params: {
      roomId: roomId
    }
  })
}

export function checkUserToRoom(roomId, uid) {
  return request({
    url: '/room/checkUserToRoom',
    method: 'post',
    params: {
      roomId: roomId,
      uid: uid
    }
  })
}
