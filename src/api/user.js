import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    params: {
      id: data.id,
      password: data.password,
      code: data.code
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/info',
    method: 'get',
    params: { token }
  })
}

export function getValidateCode() {
  return request({
    url: '/getValidateCode',
    method: 'get',
    responseType: 'arraybuffer'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function searchRoom(listQuery) {
  return request({
    url: '/room/list',
    method: 'post',
    params: {
      keyword: listQuery.searchVal,
      pageSize: listQuery.limit,
      pageNum: listQuery.page,
      state: 1
    }
  })
}

export function findJoinRoom(uid) {
  return request({
    url: '/user/findJoinRoom',
    method: 'post',
    params: {
      uid: uid
    }
  })
}

export function fndCreateRoom(uid) {
  return request({
    url: '/user/findCreateRoom',
    method: 'post',
    params: {
      uid: uid
    }
  })
}

export function fndPublicRoom(listQuery) {
  return request({
    url: '/room/publicRoom',
    method: 'post',
    params: {
      keyword: listQuery.searchVal,
      pageSize: listQuery.limit,
      pageNum: listQuery.page
    }
  })
}
