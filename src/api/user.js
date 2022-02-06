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

