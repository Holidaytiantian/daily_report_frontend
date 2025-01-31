/*
 * @Author: your name
 * @Date: 2021-05-27 16:43:11
 * @LastEditTime: 2021-11-15 15:54:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /soft-otp-admin/src/api/login.js
 */
import request from './request'

export function login(account, password) {
  const data = {
    account,
    password
  }
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}


export function modify(password, new_password) {
  return request({
    url: '/user/password',
    method: 'put',
    data: {
      password,
      new_password
    }
  })
}

export function info() {
  return request({
    url: '/user/info',
    method: 'get',
  })
}

export function employerlist() {
  return request({
    url: '/user',
    method: 'get',
})
}