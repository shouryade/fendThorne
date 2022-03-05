const state = {
  loader: false,
  loadingMessage: "",
};

const getters = {
  loader: (state) => {
    return state.loader;
  },
  loadingMessage: (state) => {
    return state.loadingMessage;
  },
};

const mutations = {
  updateLoader(state, loader) {
    state.loader = loader;
  },
  updateLoadingMessage(state, loadingMessage) {
    state.loadingMessage = loadingMessage;
  },
};

const actions = {
  showLoader({ commit }, loadingMessage) {
    commit("updateLoader", true);
    commit("updateLoadingMessage", loadingMessage);
  },
  hideLoader({ commit }) {
    commit("updateLoader", false);
    commit("updateLoadingMessage", "");
  },
};

const loaderState = {
  state: () => state,
  getters,
  mutations,
  actions,
};

export default loaderState;
