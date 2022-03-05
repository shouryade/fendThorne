const state = {
  myFiles: [],
  sharedWithMe: [],
  trash: [],
};

const getters = {
  myFiles: (state) => {
    return state.myFiles;
  },
  sharedWithMe: (state) => {
    return state.sharedWithMe;
  },
  trash: (state) => {
    return state.trash;
  },
};

const mutations = {
  updateMyFiles(state, myFiles) {
    state.myFiles = myFiles.map((file) => {
      file.fileId = file.did;
      return file;
    });
  },
  updateSharedWithMe(state, sharedWithMe) {
    state.sharedWithMe = sharedWithMe.map((file) => {
      file.fileId = file.did;
      return file;
    });
  },
  updateTrash(state, trash) {
    state.trash = trash;
  },
};

const actions = {
  updateFiles({ commit }, { myFiles, sharedWithMe }) {
    commit("updateMyFiles", myFiles);
    commit("updateSharedWithMe", sharedWithMe);
    // commit("updateTrash", trash);
  },
  updateSharedWithMe({ commit }, sharedWithMe) {
    commit("updateSharedWithMe", sharedWithMe);
  },
  updateMyFiles({ commit }, myFiles) {
    commit("updateMyFiles", myFiles);
  },
};

const fileState = {
  state: () => state,
  getters,
  mutations,
  actions,
};

export default fileState;
