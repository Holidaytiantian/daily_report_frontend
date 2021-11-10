/*
 * @Author: your name
 * @Date: 2021-10-11 11:05:41
 * @LastEditTime: 2021-11-10 15:35:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /daily-report-frontend/src/api/report.js
 */
import request from './request'
import { downloader } from './request/downloader'

export function update(report) {
    return request({
      url: '/report',
      method: 'post',
      data: report
    })
  }

  export function selfQuery(report) {
    return request({
      url: '/report',
      method: 'get',
      data: report
    })
  }

  export function dmQuery(report) {
    return request({
      url: '/report/dm',
      method: 'get',
      data: report
    })
  }

  export function pmQuery(report) {
    return request({
      url: '/report/pm',
      method: 'get',
      data: report
    })
  }

  export function pmoQuery(report) {
    return request({
      url: '/report/pmo',
      method: 'get',
      data: report
    })
  }

  export function download(report) {
    return downloader({
      url: '/report/download',
      params: report
    })
  }