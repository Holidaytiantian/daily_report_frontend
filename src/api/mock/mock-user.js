/*
 * @Author: your name
 * @Date: 2021-10-11 10:45:45
 * @LastEditTime: 2021-11-12 15:53:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /daily-report-frontend/src/api/mock/mock-user.js
 */
export const mockUser = {
  login: {
    api: /\/user\/login/,
    method: "post",
    enabled: true,
    template: {
      "message|1": "@csentence",
      "code|1": [0],
      "data|1": [
        {
          "token|1": "@string",
          "account|1": "@string",
          "role_name|1": "@string",
          "name|1": "@cname",
          "department|1": ["研发一部", "研发二部", "研发X部"],
        },
      ],
    },
  },
  logout: {
    api: /\/user\/logout/,
    method: "post",
    enabled: true,
    template: {},
  },
};
