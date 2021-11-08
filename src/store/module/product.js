/*
 * @Author: your name
 * @Date: 2021-11-02 15:43:20
 * @LastEditTime: 2021-11-08 10:17:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /daily-report-frontend/src/store/module/project.js
 */

import { list, update, create } from "../../api/product";

const state = () => ({
  all: [],
});

const actions = {
  list({ commit }) {
    return new Promise((resolve, reject) => {
      list()
        .then((data) => {
          commit("SET_PRODUCTS", data.products);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  update({ commit }, products) {
    return new Promise((resolve, reject) => {
      update(products)
        .then(() => {
          commit("SET_PRODUCTS", products);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  create({ commit }, product) {
    return new Promise((resolve, reject) => {
      create(product)
        .then(() => {
          commit("ADD_PRODUCT", product);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

const mutations = {
  SET_PRODUCTS: (state, products) => {
    state.all = products;
  },
  ADD_PRODUCT: (state, product) => {
    state.all = [...state.all, product];
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
