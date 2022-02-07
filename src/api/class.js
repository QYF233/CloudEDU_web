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

export function setRoomInfo(form) {
  return request({
    url: '/room/create',
    method: 'post',
    params: {
      // roomId: roomId,
      name: form.roomName,
      note: form.introduction,
      classes: form.classId,
      teacherId: form.teacherId
    }
  })
}

export function getRoomInfo(roomId) {
  return request({
    url: '/live/getRoomInfo',
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
