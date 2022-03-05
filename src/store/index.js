import { createStore, createLogger } from "vuex";
import authState from "./auth.store";
import loaderState from "./loader.store";
import fileState from "./file.store";

const debug = process.env.NODE_ENV !== "production";

const state = {
  redirectTo: {},
  totalStorage: 0,
  storageUsed: 0,
  totalBandwidth: 0,
  bandwidthUsed: 0,
};

const getters = {
  redirectTo: (state) => {
    return state.redirectTo;
  },
  storage: (state) => {
    return {
      totalStorage: state.totalStorage,
      storageUsed: state.storageUsed,
    };
  },
  bandwidth: (state) => {
    return {
      totalBandwidth: state.totalBandwidth,
      bandwidthUsed: state.bandwidthUsed,
    };
  },
};

const mutations = {
  updateRedirect(state, toRoute) {
    state.redirectTo = toRoute;
  },
  removeRedirect(state) {
    state.redirectTo = {};
  },
  updateTotalStorage(state, totalStorage) {
    state.totalStorage = totalStorage;
  },
  updateStorageUsed(state, storageUsed) {
    state.storageUsed = storageUsed;
  },
  updateTotalBandwidth(state, totalBandwidth) {
    state.totalBandwidth = totalBandwidth;
  },
  updateBandwidthUsed(state, bandwidthUsed) {
    state.bandwidthUsed = bandwidthUsed;
  },
};

const actions = {
  updateRedirect({ commit }, payload) {
    commit("updateRedirect", payload);
  },
  removeRedirect({ commit }) {
    commit("removeRedirect");
  },
  updateStorage({ commit }, payload) {
    commit("updateTotalStorage", payload.totalStorage);
    commit("updateStorageUsed", payload.storageUsed);
  },
  updateBandwidth({ commit }, payload) {
    commit("updateTotalBandwidth", payload.totalBandwidth);
    commit("updateBandwidthUsed", payload.bandwidthUsed);
  },
};

const store = createStore({
  modules: {
    authState,
    loaderState,
    fileState,
  },
  state,
  mutations,
  actions,
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});

export default store;
