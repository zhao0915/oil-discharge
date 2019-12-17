import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/pc/getToken',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/pc/me',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
