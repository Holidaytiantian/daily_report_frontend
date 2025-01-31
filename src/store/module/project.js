/*
 * @Author: your name
 * @Date: 2021-11-02 15:43:20
 * @LastEditTime: 2021-11-12 16:02:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /daily-report-frontend/src/store/module/project.js
 */

import { list, update, create, remove} from "../../api/project";

const state = () => ({
  spinning: false,
  all: [],
});

const actions = {
  list({ commit }) {
    return new Promise((resolve, reject) => {
      commit("SET_SPINNING", true);
      list()
        .then((data) => {
          commit("SET_PROJECTS", data);
          resolve();
        })
        .catch((error) => {
          reject(error);
        })
        .finally(() => {
          commit("SET_SPINNING", false);
        });
    });
  },
  update({ commit }, projects) {
    return new Promise((resolve, reject) => {
      update(projects)
        .then(() => {
          commit("SET_PROJECTS", projects);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  create({ commit }, project) {
    return new Promise((resolve, reject) => {
      create(project)
        .then(() => {
          commit("ADD_PROJECT", project);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  remove({ commit }, project) {
    return new Promise((resolve, reject) => {
      remove(project)
        .then(() => {
          commit("REMOVE_PROJECTS", project);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

const mutations = {
  SET_PROJECTS: (state, projects) => {
    state.all = projects;
  },
  ADD_PROJECT: (state, project) => {
    state.all = [...state.all, project];
  },
  SET_SPINNING(state, spinning) {
    state.spinning = spinning;
  },
  REMOVE_PROJECTS: (state, project) => {
    let projects = [];
    for (let p of state.all)
    { 
      if(p.number !== project.numbers[0])
      {
        projects.push(p);
      }
    }
    state.all = projects;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
